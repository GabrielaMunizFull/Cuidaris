"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, Avatar } from "@cuidaris/ui";
import { Search } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Consulta {
  id: string;
  data_hora: string;
  status: string;
  paciente: { nome: string } | null;
  profissional: {
    id: string;
    nome: string;
    especialidade: string;
    foto_url: string | null;
  } | null;
}

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

export function AgendaBusca({ consultas }: { consultas: Consulta[] }) {
  const [busca, setBusca] = useState("");

  const filtradas = busca.trim()
    ? consultas.filter((c) => {
        const termo = busca.toLowerCase();
        return (
          (c.paciente?.nome ?? "").toLowerCase().includes(termo) ||
          (c.profissional?.nome ?? "").toLowerCase().includes(termo) ||
          (c.profissional?.especialidade ?? "").toLowerCase().includes(termo)
        );
      })
    : consultas;

  // Agrupa por dia
  const porDia = new Map<string, Consulta[]>();
  for (const c of filtradas) {
    const dia = format(new Date(c.data_hora), "yyyy-MM-dd");
    if (!porDia.has(dia)) porDia.set(dia, []);
    porDia.get(dia)!.push(c);
  }

  return (
    <div>
      <div className="relative mb-5 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)]" />
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar paciente ou profissional..."
          className="h-9 w-full rounded-[10px] border border-[var(--line)] bg-[var(--surface)] pl-8 pr-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-colors"
        />
      </div>

      {porDia.size === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-12 text-center">
          <p className="text-sm font-medium text-[var(--ink-2)]">
            {busca ? "Nenhuma sessão encontrada para essa busca." : "Dia livre nos próximos 14 dias"}
          </p>
          {!busca && (
            <p className="text-sm text-[var(--ink-3)] mt-1">Nenhuma sessão agendada para este período.</p>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {[...porDia.entries()].map(([dia, items]) => (
            <div key={dia}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-3)] mb-2 capitalize">
                {labelData(items[0]!.data_hora)}
              </p>
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] divide-y divide-[var(--line)]">
                {items.map((c) => (
                  <Link
                    key={c.id}
                    href={`/profissionais/${c.profissional?.id}/agenda`}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--bg)] transition-colors"
                  >
                    <p className="w-12 text-sm font-medium tabular-nums text-[var(--ink)] shrink-0">
                      {format(new Date(c.data_hora), "HH:mm")}
                    </p>
                    <Avatar
                      name={c.profissional?.nome ?? "?"}
                      src={c.profissional?.foto_url ?? undefined}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--ink)] truncate">{c.paciente?.nome ?? "Paciente"}</p>
                      <p className="text-xs text-[var(--ink-3)] truncate">
                        {c.profissional?.nome} · {c.profissional?.especialidade}
                      </p>
                    </div>
                    <Badge variant={c.status as "confirmado" | "pendente" | "cancelado" | "remarcado"}>
                      {statusLabel[c.status] ?? c.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
