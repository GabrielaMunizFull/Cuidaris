"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, Badge } from "@cuidaris/ui";
import { Search, Plus } from "lucide-react";
import { format, differenceInYears } from "date-fns";
import { ptBR } from "date-fns/locale";

type StatusPaciente = "ativo" | "pendente" | "inadimplente";

export type PacienteEnriquecido = {
  id: string;
  nome: string;
  telefone: string | null;
  data_nascimento: string | null;
  ultima_visita: string | null;
  status: StatusPaciente;
  convenio_nome: string | null;
};

const filtros = [
  { label: "Todos", value: "todos" },
  { label: "Ativos", value: "ativo" },
  { label: "Pendentes", value: "pendente" },
  { label: "Inadimplentes", value: "inadimplente" },
] as const;

const statusLabel: Record<StatusPaciente, string> = {
  ativo: "Ativo",
  pendente: "Pendente",
  inadimplente: "Inadimplente",
};

const statusVariant: Record<StatusPaciente, "ativo" | "pendente" | "atrasado"> = {
  ativo: "ativo",
  pendente: "pendente",
  inadimplente: "atrasado",
};

interface PacientesListaProps {
  pacientes: PacienteEnriquecido[];
  profissionalId: string;
  profissionalNome?: string;
}

export function PacientesLista({ pacientes, profissionalId, profissionalNome }: PacientesListaProps) {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"todos" | StatusPaciente>("todos");

  const filtrados = pacientes.filter((p) => {
    const buscaOk = p.nome.toLowerCase().includes(busca.toLowerCase());
    const filtroOk = filtro === "todos" || p.status === filtro;
    return buscaOk && filtroOk;
  });

  return (
    <div>
      {/* Busca + filtros */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)]" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar paciente..."
            className="h-9 w-full rounded-[10px] border border-[var(--line)] bg-[var(--surface)] pl-8 pr-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {filtros.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFiltro(value)}
              className={[
                "h-8 px-3 rounded-[10px] text-sm transition-colors border",
                filtro === value
                  ? "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/30 font-medium"
                  : "bg-[var(--surface)] text-[var(--ink-2)] border-[var(--line)] hover:border-[var(--ink-3)]",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] overflow-hidden">
        {filtrados.length === 0 ? (
          <div className="py-16 text-center">
            {busca || filtro !== "todos" ? (
              <p className="text-sm text-[var(--ink-3)]">Nenhum paciente encontrado com esses filtros.</p>
            ) : (
              <>
                <p className="text-sm font-medium text-[var(--ink)] mb-1">Nenhum paciente ainda</p>
                <p className="text-sm text-[var(--ink-3)] mb-5">
                  {profissionalNome
                    ? `Adicione o primeiro paciente de ${profissionalNome} para começar a organizar a agenda.`
                    : "Adicione o primeiro paciente para começar a organizar a agenda."}
                </p>
                <button
                  type="button"
                  onClick={() => router.push("?novo=1")}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
                >
                  <Plus size={15} />
                  Adicionar paciente
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Cabeçalho da tabela */}
            <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_1fr] gap-4 px-6 py-2.5 border-b border-[var(--line)]">
              {["PACIENTE", "IDADE", "TELEFONE", "CONVÊNIO", "ÚLTIMA VISITA", "STATUS"].map((col) => (
                <span key={col} className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">
                  {col}
                </span>
              ))}
            </div>

            {/* Linhas */}
            <div className="divide-y divide-[var(--line)]">
              {filtrados.map((p) => {
                const idade = p.data_nascimento
                  ? differenceInYears(new Date(), new Date(p.data_nascimento))
                  : null;

                return (
                  <Link
                    key={p.id}
                    href={`/profissionais/${profissionalId}/pacientes/${p.id}`}
                    className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_1fr] gap-4 items-center px-6 py-3.5 hover:bg-[var(--bg)] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={p.nome} size="sm" />
                      <span className="text-sm font-medium text-[var(--ink)] truncate">{p.nome}</span>
                    </div>
                    <span className="text-sm text-[var(--ink-2)]">
                      {idade !== null ? `${idade} anos` : "—"}
                    </span>
                    <span className="text-sm text-[var(--ink-2)]">{p.telefone ?? "—"}</span>
                    <span className="text-sm text-[var(--ink-2)]">{p.convenio_nome ?? "Particular"}</span>
                    <span className="text-sm text-[var(--ink-2)]">
                      {p.ultima_visita
                        ? format(new Date(p.ultima_visita), "d MMM", { locale: ptBR })
                        : "—"}
                    </span>
                    <Badge variant={statusVariant[p.status]}>
                      {statusLabel[p.status]}
                    </Badge>
                  </Link>
                );
              })}
            </div>

            {/* Rodapé */}
            <div className="px-6 py-3 border-t border-[var(--line)]">
              <span className="text-xs text-[var(--ink-3)]">{filtrados.length} pacientes</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
