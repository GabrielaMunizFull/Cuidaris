import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { addDays } from "date-fns";
import { AgendaBusca } from "./_components/agenda-busca";

export const metadata: Metadata = { title: "Agenda — Cuidaris" };

export default async function AgendaGlobalPage() {
  const supabase = await createClient();

  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);
  const fim = addDays(inicio, 14);

  const { data: consultas } = await supabase
    .from("agenda")
    .select("id, data_hora, status, paciente:pacientes(nome), profissional:profissionais(id, nome, especialidade, foto_url)")
    .gte("data_hora", inicio.toISOString())
    .lte("data_hora", fim.toISOString())
    .not("status", "eq", "cancelado")
    .order("data_hora");

  const consultasFormatadas = (consultas ?? []).map((c) => ({
    id: c.id,
    data_hora: c.data_hora,
    status: c.status,
    paciente: c.paciente as unknown as { nome: string } | null,
    profissional: c.profissional as unknown as {
      id: string;
      nome: string;
      especialidade: string;
      foto_url: string | null;
    } | null,
  }));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--ink)]">Agenda</h1>
        <p className="text-sm text-[var(--ink-2)] mt-0.5">Próximos 14 dias — todos os profissionais</p>
      </div>
      <AgendaBusca consultas={consultasFormatadas} />
    </div>
  );
}
