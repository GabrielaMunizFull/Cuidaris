import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const { priceId } = await request.json();
  if (!priceId) return NextResponse.json({ error: "priceId obrigatório." }, { status: 400 });

  const { data: assistente } = await supabase
    .from("assistentes")
    .select("stripe_customer_id, email, nome")
    .eq("id", user.id)
    .single();

  if (!assistente) return NextResponse.json({ error: "Assistente não encontrada." }, { status: 404 });

  // Cria customer no Stripe se ainda não existir
  let customerId = assistente.stripe_customer_id;
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: assistente.email,
      name: assistente.nome,
      metadata: { assistente_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from("assistentes")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/planos?sucesso=1`,
    cancel_url: `${appUrl}/planos`,
    metadata: { assistente_id: user.id },
    subscription_data: {
      metadata: { assistente_id: user.id },
    },
  });

  return NextResponse.json({ url: session.url });
}
