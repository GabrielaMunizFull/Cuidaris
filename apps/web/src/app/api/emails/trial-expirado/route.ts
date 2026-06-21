import { NextResponse } from "next/server";
import { sendTrialExpirado } from "@cuidaris/emails";
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

  const hoje = new Date().toISOString().split("T")[0];

  // Busca assistentes cujo trial expirou hoje (ainda em status "trial")
  const { data: assistentes, error } = await supabase
    .from("assistentes")
    .select("id, email, nome")
    .eq("status_assinatura", "trial")
    .lt("trial_termina_em", `${hoje}T00:00:00`);

  if (error) {
    return NextResponse.json({ error: "Erro ao buscar assistentes." }, { status: 500 });
  }

  if (!assistentes || assistentes.length === 0) {
    return NextResponse.json({ enviados: 0, atualizados: 0 });
  }

  const ids = assistentes.map((a) => a.id);

  // Atualiza status para "cancelado" em lote
  await supabase
    .from("assistentes")
    .update({ status_assinatura: "cancelado" })
    .in("id", ids);

  // Envia e-mail para cada uma
  const resultados = await Promise.allSettled(
    assistentes.map((a) => sendTrialExpirado(a.email, a.nome))
  );

  const enviados = resultados.filter((r) => r.status === "fulfilled").length;
  const falhos = resultados.filter((r) => r.status === "rejected").length;

  return NextResponse.json({ enviados, falhos, atualizados: ids.length });
}
