import { NextResponse } from "next/server";
import { sendTrialExpirando } from "@cuidaris/emails";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Busca assistentes em trial com exatamente 3 dias restantes
  const tresDiasAFrente = new Date();
  tresDiasAFrente.setDate(tresDiasAFrente.getDate() + 3);
  const dataAlvo = tresDiasAFrente.toISOString().split("T")[0];

  const { data: assistentes, error } = await supabase
    .from("assistentes")
    .select("email, nome")
    .eq("status_assinatura", "trial")
    .gte("trial_termina_em", `${dataAlvo}T00:00:00`)
    .lt("trial_termina_em", `${dataAlvo}T23:59:59`);

  if (error) {
    return NextResponse.json({ error: "Erro ao buscar assistentes." }, { status: 500 });
  }

  const resultados = await Promise.allSettled(
    (assistentes ?? []).map((a) => sendTrialExpirando(a.email, a.nome, 3))
  );

  const enviados = resultados.filter((r) => r.status === "fulfilled").length;
  const falhos = resultados.filter((r) => r.status === "rejected").length;

  return NextResponse.json({ enviados, falhos });
}
