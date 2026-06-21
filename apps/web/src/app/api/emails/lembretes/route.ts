import { NextResponse } from "next/server";
import { sendLembreteConsulta } from "@cuidaris/emails";
import { createClient } from "@supabase/supabase-js";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  // Janela: hoje 00:00 até 23:59 UTC
  const hoje = new Date();
  const inicio = new Date(hoje);
  inicio.setUTCHours(0, 0, 0, 0);
  const fim = new Date(hoje);
  fim.setUTCHours(23, 59, 59, 999);

  // Busca consultas do dia junto com a preferência da assistente
  const { data: consultas, error } = await supabase
    .from("agenda")
    .select(`
      id,
      data_hora,
      assistente_id,
      paciente:pacientes(nome, email),
      profissional:profissionais(nome, especialidade)
    `)
    .gte("data_hora", inicio.toISOString())
    .lte("data_hora", fim.toISOString())
    .in("status", ["confirmado", "pendente"]);

  if (error) {
    return NextResponse.json({ error: "Erro ao buscar consultas." }, { status: 500 });
  }

  // Busca preferências de lembrete das assistentes que têm consultas hoje
  const assistenteIds = [...new Set((consultas ?? []).map((c) => c.assistente_id))];
  const { data: assistentes } = await supabase
    .from("assistentes")
    .select("id, lembretes_ativos")
    .in("id", assistenteIds);

  const lembretesAtivosSet = new Set(
    (assistentes ?? [])
      .filter((a) => a.lembretes_ativos !== false) // default true se coluna não existir ainda
      .map((a) => a.id)
  );

  // Filtra apenas pacientes com email E cujas assistentes têm lembretes ativos
  const comEmail = (consultas ?? []).filter((c) => {
    const paciente = c.paciente as unknown as { nome: string; email: string | null } | null;
    return paciente?.email && lembretesAtivosSet.has(c.assistente_id);
  });

  const resultados = await Promise.allSettled(
    comEmail.map((c) => {
      const paciente = c.paciente as unknown as { nome: string; email: string };
      const profissional = c.profissional as unknown as { nome: string; especialidade: string };
      const horaFormatada = format(new Date(c.data_hora), "HH:mm 'de' EEEE, d 'de' MMMM", { locale: ptBR });

      return sendLembreteConsulta(
        paciente.email,
        paciente.nome,
        profissional.nome,
        profissional.especialidade,
        horaFormatada
      );
    })
  );

  const enviados = resultados.filter((r) => r.status === "fulfilled").length;
  const falhos = resultados.filter((r) => r.status === "rejected").length;
  const semEmail = (consultas ?? []).length - comEmail.length;

  return NextResponse.json({ enviados, falhos, semEmail });
}
