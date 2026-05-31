import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card } from "@cuidaris/ui";

export const metadata: Metadata = {
  title: "Dashboard — Cuidaris",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const hoje = new Date();
  const inicioHoje = new Date(hoje.setHours(0, 0, 0, 0)).toISOString();
  const fimHoje = new Date(hoje.setHours(23, 59, 59, 999)).toISOString();

  const { data: consultasHoje } = await supabase
    .from("agenda")
    .select("id, data_hora, status, profissional_id, paciente:pacientes(nome), profissional:profissionais(nome)")
    .gte("data_hora", inicioHoje)
    .lte("data_hora", fimHoje)
    .order("data_hora");

  const { count: totalProfissionais } = await supabase
    .from("profissionais")
    .select("id", { count: "exact", head: true })
    .eq("ativo", true);

  const { count: totalPacientes } = await supabase
    .from("pacientes")
    .select("id", { count: "exact", head: true })
    .eq("ativo", true);

  const dataFormatada = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--ink)] capitalize">{dataFormatada}</h1>
        <p className="text-sm text-[var(--ink-2)] mt-0.5">Visão geral do seu dia</p>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card padding="md">
          <p className="text-2xl font-semibold text-[var(--ink)]">{consultasHoje?.length ?? 0}</p>
          <p className="text-sm text-[var(--ink-2)] mt-0.5">Consultas hoje</p>
        </Card>
        <Card padding="md">
          <p className="text-2xl font-semibold text-[var(--ink)]">{totalProfissionais ?? 0}</p>
          <p className="text-sm text-[var(--ink-2)] mt-0.5">Profissionais</p>
        </Card>
        <Card padding="md">
          <p className="text-2xl font-semibold text-[var(--ink)]">{totalPacientes ?? 0}</p>
          <p className="text-sm text-[var(--ink-2)] mt-0.5">Pacientes ativos</p>
        </Card>
      </div>

      {/* Consultas do dia */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-[var(--line)]">
          <h2 className="text-base font-semibold text-[var(--ink)]">Consultas de hoje</h2>
        </div>

        {!consultasHoje || consultasHoje.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-[var(--ink-2)] text-sm">Nenhuma consulta agendada para hoje.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--line)]">
            {consultasHoje.map((consulta) => {
              const horario = format(new Date(consulta.data_hora), "HH:mm");
              const statusColors: Record<string, string> = {
                confirmado: "bg-emerald-50 text-emerald-700",
                pendente: "bg-amber-50 text-amber-700",
                cancelado: "bg-red-50 text-red-700",
                remarcado: "bg-blue-50 text-blue-700",
              };
              return (
                <li key={consulta.id} className="px-6 py-4 flex items-center gap-4">
                  <span className="text-sm font-medium text-[var(--ink-2)] tabular-nums w-12 shrink-0">
                    {horario}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--ink)] truncate">
                      {(consulta.paciente as { nome: string } | null)?.nome ?? "—"}
                    </p>
                    <p className="text-xs text-[var(--ink-3)] truncate">
                      {(consulta.profissional as { nome: string } | null)?.nome ?? "—"}
                    </p>
                  </div>
                  <span
                    className={[
                      "text-xs font-medium px-2 py-0.5 rounded border text-nowrap",
                      statusColors[consulta.status] ?? "",
                    ].join(" ")}
                  >
                    {consulta.status}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
