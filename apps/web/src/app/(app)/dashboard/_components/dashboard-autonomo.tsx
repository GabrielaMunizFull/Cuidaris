import Link from "next/link";
import { format, addDays, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, AlertTriangle, DollarSign, Users, Plus } from "lucide-react";
import { StatCard } from "./stat-card";
import { createClient } from "@/lib/supabase/server";

interface DashboardAutonomoProps {
  profissionalId: string;
  saudacao: string;
}

const statusColors: Record<string, string> = {
  confirmado: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pendente: "bg-amber-50 text-amber-700 border-amber-200",
  cancelado: "bg-red-50 text-red-700 border-red-200",
  remarcado: "bg-blue-50 text-blue-700 border-blue-200",
};

export async function DashboardAutonomo({ profissionalId, saudacao }: DashboardAutonomoProps) {
  const supabase = await createClient();

  const agora = new Date();
  const inicioHoje = startOfDay(agora).toISOString();
  const fimHoje = endOfDay(agora).toISOString();
  const fimSemana = endOfDay(addDays(agora, 7)).toISOString();

  const [
    { data: consultasHoje },
    { data: pacientes },
    { data: inadimplentes },
    { data: pendencias },
  ] = await Promise.all([
    supabase
      .from("agenda")
      .select("id, data_hora, status, paciente:pacientes(nome)")
      .eq("profissional_id", profissionalId)
      .gte("data_hora", inicioHoje)
      .lte("data_hora", fimHoje)
      .order("data_hora"),
    supabase
      .from("pacientes")
      .select("id")
      .eq("profissional_id", profissionalId)
      .eq("ativo", true),
    supabase
      .from("lancamentos")
      .select("id")
      .eq("profissional_id", profissionalId)
      .eq("status", "atrasado"),
    supabase
      .from("agenda")
      .select("id, data_hora, paciente:pacientes(nome)")
      .eq("profissional_id", profissionalId)
      .gte("data_hora", inicioHoje)
      .lte("data_hora", fimSemana)
      .eq("status", "pendente")
      .order("data_hora")
      .limit(5),
  ]);

  const totalConsultasHoje = consultasHoje?.length ?? 0;
  const totalPacientes = pacientes?.length ?? 0;
  const totalInadimplentes = inadimplentes?.length ?? 0;
  const totalPendencias = pendencias?.length ?? 0;

  return (
    <div className="max-w-4xl space-y-8 mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">{saudacao}</h1>
          <p className="text-sm text-[var(--ink-2)] mt-1">
            <span className="font-medium text-[var(--ink)]">{totalPacientes} paciente{totalPacientes !== 1 ? "s" : ""} ativo{totalPacientes !== 1 ? "s" : ""}</span>
          </p>
        </div>
        <Link
          href={`/profissionais/${profissionalId}/agenda/nova`}
          className="shrink-0 inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
        >
          <Plus size={15} />
          Nova consulta
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Consultas hoje" value={totalConsultasHoje} />
        <StatCard icon={Users} label="Pacientes ativos" value={totalPacientes} />
        <StatCard icon={AlertTriangle} label="Pendências" value={totalPendencias} highlight={totalPendencias > 0 ? "amber" : undefined} />
        <StatCard icon={DollarSign} label="Inadimplentes" value={totalInadimplentes} highlight={totalInadimplentes > 0 ? "red" : undefined} />
      </div>

      {/* Consultas de hoje + pendências */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[var(--ink)]">Consultas de hoje</h2>
            <Link
              href={`/profissionais/${profissionalId}/agenda/nova`}
              className="text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
            >
              + Agendar
            </Link>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)]">
            {!consultasHoje || consultasHoje.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm font-medium text-[var(--ink-2)]">Dia livre hoje</p>
                <p className="text-xs text-[var(--ink-3)] mt-1">Nenhuma sessão agendada para hoje.</p>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--line)]">
                {consultasHoje.map((c) => (
                  <li key={c.id} className="px-5 py-3.5 flex items-center gap-3">
                    <span className="text-sm font-medium text-[var(--ink-2)] tabular-nums w-11 shrink-0">
                      {format(new Date(c.data_hora), "HH:mm")}
                    </span>
                    <p className="flex-1 text-sm font-medium text-[var(--ink)] truncate">
                      {(c.paciente as unknown as { nome: string } | null)?.nome ?? "—"}
                    </p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded border ${statusColors[c.status] ?? ""}`}>
                      {c.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[var(--ink)]">Pendências da semana</h2>
            {totalPendencias > 0 && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                {totalPendencias} {totalPendencias === 1 ? "aberta" : "abertas"}
              </span>
            )}
          </div>
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)]">
            {!pendencias || pendencias.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm font-medium text-[var(--ink-2)]">Nenhuma pendência</p>
                <p className="text-xs text-[var(--ink-3)] mt-1">Todas as sessões estão confirmadas.</p>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--line)]">
                {pendencias.map((p) => (
                  <li key={p.id} className="px-5 py-3.5 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--ink)] truncate">
                        {(p.paciente as unknown as { nome: string } | null)?.nome ?? "—"}
                      </p>
                      <p className="text-xs text-[var(--ink-3)]">
                        {format(new Date(p.data_hora), "EEE d/MM 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <Link
                      href={`/profissionais/${profissionalId}/agenda`}
                      className="shrink-0 text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                    >
                      Resolver
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
