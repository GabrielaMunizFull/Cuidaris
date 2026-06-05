import { NextResponse } from "next/server";
import { stripe, supabaseAdmin } from "@/lib/stripe";
import type Stripe from "stripe";

// Necessário para ler o body raw e validar assinatura
export const runtime = "nodejs";

const priceToPlano: Record<string, string> = {
  [process.env.STRIPE_PRICE_SOLO ?? ""]: "solo",
  [process.env.STRIPE_PRICE_ESSENCIAL ?? ""]: "essencial",
  [process.env.STRIPE_PRICE_PROFISSIONAL ?? ""]: "profissional",
  [process.env.STRIPE_PRICE_CLINICA ?? ""]: "clinica",
};

function planoFromSubscription(subscription: Stripe.Subscription): string | null {
  const priceId = subscription.items.data[0]?.price.id;
  return priceId ? (priceToPlano[priceId] ?? null) : null;
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
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const assistenteId = session.metadata?.assistente_id;
      if (!assistenteId || !session.subscription) break;

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const plano = planoFromSubscription(subscription);

      await supabaseAdmin
        .from("assistentes")
        .update({
          stripe_subscription_id: subscription.id,
          plano,
          status_assinatura: "ativo",
        })
        .eq("id", assistenteId);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const assistenteId = subscription.metadata?.assistente_id;
      if (!assistenteId) break;

      const plano = planoFromSubscription(subscription);
      const status = subscription.status === "active" ? "ativo" : "inadimplente";

      await supabaseAdmin
        .from("assistentes")
        .update({ plano, status_assinatura: status })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await supabaseAdmin
        .from("assistentes")
        .update({ status_assinatura: "cancelado", plano: null })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      // Na API 2026-05-27.dahlia a subscription fica em invoice.parent
      const subscriptionId =
        (invoice as unknown as { subscription?: string }).subscription ??
        (invoice.parent as unknown as { subscription_details?: { subscription?: string } } | null)
          ?.subscription_details?.subscription;
      if (!subscriptionId) break;
      await supabaseAdmin
        .from("assistentes")
        .update({ status_assinatura: "inadimplente" })
        .eq("stripe_subscription_id", subscriptionId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
