import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const { data: assistente } = await supabase
    .from("assistentes")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!assistente?.stripe_customer_id) {
    return NextResponse.json({ error: "Sem assinatura ativa." }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: assistente.stripe_customer_id,
    return_url: `${appUrl}/planos`,
  });

  return NextResponse.json({ url: session.url });
}
