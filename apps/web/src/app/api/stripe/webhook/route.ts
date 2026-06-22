import { NextResponse } from "next/server";
import { stripe, supabaseAdmin } from "@/lib/stripe";
import { sendPagamentoConfirmado, sendTrialExpirando, sendCancelamento } from "@cuidaris/emails";
import type Stripe from "stripe";

export const runtime = "nodejs";

const priceToPlano: Record<string, string> = {
  [process.env.STRIPE_PRICE_SOLO ?? ""]: "solo",
  [process.env.STRIPE_PRICE_ESSENCIAL ?? ""]: "essencial",
  [process.env.STRIPE_PRICE_PROFISSIONAL ?? ""]: "profissional",
  [process.env.STRIPE_PRICE_CLINICA ?? ""]: "clinica",
};

// Mapeamento completo de todos os status possíveis do Stripe
const stripeStatusToApp: Record<string, string> = {
  active: "ativo",
  trialing: "trial",
  past_due: "inadimplente",
  incomplete: "inadimplente",
  unpaid: "inadimplente",
  canceled: "cancelado",
  paused: "cancelado",
  incomplete_expired: "cancelado",
};

function planoFromSubscription(subscription: Stripe.Subscription): string | null {
  const priceId = subscription.items.data[0]?.price.id;
  return priceId ? (priceToPlano[priceId] ?? null) : null;
}

function subscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  // Compatibilidade com API 2026-05-27.dahlia onde subscription fica em invoice.parent
  return (
    (invoice as unknown as { subscription?: string }).subscription ??
    (invoice.parent as unknown as { subscription_details?: { subscription?: string } } | null)
      ?.subscription_details?.subscription ??
    null
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) return NextResponse.json({ error: "Sem assinatura." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  switch (event.type) {
    // Checkout concluído — primeira assinatura ou reativação via checkout
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const assistenteId = session.metadata?.assistente_id;
      if (!assistenteId || !session.subscription) break;

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const plano = planoFromSubscription(subscription);

      const { data: assistente } = await supabaseAdmin
        .from("assistentes")
        .update({
          stripe_subscription_id: subscription.id,
          plano,
          status_assinatura: "ativo",
        })
        .eq("id", assistenteId)
        .select("email, nome")
        .single();

      if (assistente && plano) {
        sendPagamentoConfirmado(assistente.email, assistente.nome, plano).catch(() => {});
      }
      break;
    }

    // Assinatura atualizada (upgrade, downgrade, status mudou)
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const novoStatus = stripeStatusToApp[subscription.status];
      if (!novoStatus) break; // status desconhecido — ignorar

      const plano = planoFromSubscription(subscription);
      const update: Record<string, unknown> = { status_assinatura: novoStatus };
      if (plano) update.plano = plano; // só atualiza plano se reconhecido

      await supabaseAdmin
        .from("assistentes")
        .update(update)
        .eq("stripe_subscription_id", subscription.id);
      break;
    }

    // Assinatura cancelada definitivamente
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      const { data: assistente } = await supabaseAdmin
        .from("assistentes")
        .update({ status_assinatura: "cancelado" })
        .eq("stripe_subscription_id", subscription.id)
        .select("email, nome")
        .single();

      if (assistente) {
        sendCancelamento(assistente.email, assistente.nome).catch(console.error);
      }
      break;
    }

    // Pagamento recuperado após falha — restaura acesso
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = subscriptionIdFromInvoice(invoice);
      if (!subscriptionId) break;

      // Recupera o plano atual da subscription para garantir consistência
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const plano = planoFromSubscription(subscription);
      const update: Record<string, unknown> = { status_assinatura: "ativo" };
      if (plano) update.plano = plano;

      await supabaseAdmin
        .from("assistentes")
        .update(update)
        .eq("stripe_subscription_id", subscriptionId);
      break;
    }

    // Pagamento falhou — suspende acesso
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = subscriptionIdFromInvoice(invoice);
      if (!subscriptionId) break;

      await supabaseAdmin
        .from("assistentes")
        .update({ status_assinatura: "inadimplente" })
        .eq("stripe_subscription_id", subscriptionId);
      break;
    }

    // Trial terminando em 3 dias — Stripe envia este evento automaticamente
    case "customer.subscription.trial_will_end": {
      const subscription = event.data.object as Stripe.Subscription;
      const assistenteId = subscription.metadata?.assistente_id;
      if (!assistenteId) break;

      const { data: assistente } = await supabaseAdmin
        .from("assistentes")
        .select("email, nome, trial_termina_em")
        .eq("id", assistenteId)
        .single();

      if (assistente) {
        // Calcula dias restantes baseado no trial_ends_at da subscription
        const trialEnd = subscription.trial_end;
        const diasRestantes = trialEnd
          ? Math.max(1, Math.ceil((trialEnd * 1000 - Date.now()) / 86_400_000))
          : 3;
        sendTrialExpirando(assistente.email, assistente.nome, diasRestantes).catch(() => {});
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
