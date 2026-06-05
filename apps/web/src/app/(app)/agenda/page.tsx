import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge, Avatar } from "@cuidaris/ui";
import { format, isToday, isTomorrow, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export const metadata: Metadata = { title: "Agenda — Cuidaris" };

const statusLabel: Record<string, string> = {
  confirmado: "Confirmado",
  pendente: "Pendente",
  cancelado: "Cancelado",
  remarcado: "Remarcado",
};

function labelData(dataHora: string) {
  const d = new Date(dataHora);
  if (isToday(d)) return "Hoje";
  if (isTomorrow(d)) return "Amanhã";
  return format(d, "EEEE, d 'de' MMMM", { locale: ptBR });
}

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

  // Agrupa por dia
  const porDia = new Map<string, typeof consultas>();
  for (const c of consultas ?? []) {
    const dia = format(new Date(c.data_hora), "yyyy-MM-dd");
    if (!porDia.has(dia)) porDia.set(dia, []);
    porDia.get(dia)!.push(c);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--ink)]">Agenda</h1>
        <p className="text-sm text-[var(--ink-2)] mt-0.5">Próximos 14 dias — todos os profissionais</p>
      </div>

      {porDia.size === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-12 text-center">
          <p className="text-sm font-medium text-[var(--ink-2)]">Dia livre nos próximos 14 dias</p>
          <p className="text-sm text-[var(--ink-3)] mt-1">Nenhuma sessão agendada para este período.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {[...porDia.entries()].map(([dia, items]) => (
            <div key={dia}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-3)] mb-2 capitalize">
                {labelData(items![0]!.data_hora)}
              </p>
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] divide-y divide-[var(--line)]">
                {items!.map((c) => {
                  const prof = c.profissional as { id: string; nome: string; especialidade: string; foto_url: string | null } | null;
                  const paciente = c.paciente as { nome: string } | null;
                  return (
                    <Link
                      key={c.id}
                      href={`/profissionais/${prof?.id}/agenda`}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--bg)] transition-colors"
                    >
                      <p className="w-12 text-sm font-medium tabular-nums text-[var(--ink)] shrink-0">
                        {format(new Date(c.data_hora), "HH:mm")}
                      </p>
                      <Avatar name={prof?.nome ?? "?"} src={prof?.foto_url ?? undefined} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--ink)] truncate">{paciente?.nome ?? "Paciente"}</p>
                        <p className="text-xs text-[var(--ink-3)] truncate">{prof?.nome} · {prof?.especialidade}</p>
                      </div>
                      <Badge variant={c.status as "confirmado" | "pendente" | "cancelado" | "remarcado"}>
                        {statusLabel[c.status] ?? c.status}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
