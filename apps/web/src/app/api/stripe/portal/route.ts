import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
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

  const host = request.headers.get("host") ?? "localhost:3000";
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? `${proto}://${host}`;

  const session = await getStripe().billingPortal.sessions.create({
    customer: assistente.stripe_customer_id,
    return_url: `${appUrl}/planos`,
  });

  return NextResponse.json({ url: session.url });
}
