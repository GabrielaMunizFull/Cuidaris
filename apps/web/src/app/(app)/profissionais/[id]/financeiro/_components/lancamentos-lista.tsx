"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Badge } from "@cuidaris/ui";
import { Search, FileText, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { LancamentoStatusForm } from "./lancamento-status-form";
import { excluirLancamentoAction } from "../actions";

type StatusLancamento = "pago" | "pendente" | "atrasado";

interface Lancamento {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  forma_pagamento: string;
  status: StatusLancamento;
  numero_recibo: string | null;
  paciente: { nome: string } | null;
}

const FORMAS: Record<string, string> = {
  dinheiro: "Dinheiro",
  pix: "PIX",
  cartao_credito: "Cartão de Crédito",
  cartao_debito: "Cartão de Débito",
  transferencia: "Transferência",
  convenio: "Convênio",
};

const FILTROS = [
  { label: "Todos", value: "todos" },
  { label: "Pago", value: "pago" },
  { label: "Pendente", value: "pendente" },
  { label: "Atrasado", value: "atrasado" },
] as const;

interface LancamentosListaProps {
  lancamentos: Lancamento[];
  profissionalId: string;
}

function ExcluirLancamento({ profissionalId, lancamentoId }: { profissionalId: string; lancamentoId: string }) {
  const [isPending, startTransition] = useTransition();
  function handleClick() {
    if (!confirm("Excluir este lançamento? Esta ação não pode ser desfeita.")) return;
    startTransition(async () => {
      await excluirLancamentoAction(profissionalId, lancamentoId);
    });
  }
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      title="Excluir lançamento"
      className="p-1.5 rounded-[8px] text-[var(--ink-3)] hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 shrink-0"
    >
      <Trash2 size={14} />
    </button>
  );
}

export function LancamentosLista({ lancamentos, profissionalId }: LancamentosListaProps) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"todos" | StatusLancamento>("todos");

  const filtrados = lancamentos.filter((l) => {
    const termo = busca.toLowerCase();
    const buscaOk =
      l.descricao.toLowerCase().includes(termo) ||
      (l.paciente?.nome ?? "").toLowerCase().includes(termo);
    const filtroOk = filtro === "todos" || l.status === filtro;
    return buscaOk && filtroOk;
  });

  if (lancamentos.length === 0) return null;

  return (
    <div>
      {/* Busca + filtros de status */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)]" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por descrição ou paciente..."
            className="h-9 w-full rounded-[10px] border border-[var(--line)] bg-[var(--surface)] pl-8 pr-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {FILTROS.map(({ label, value }) => (
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

      {filtrados.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] py-10 text-center">
          <p className="text-sm text-[var(--ink-3)]">Nenhum lançamento encontrado com esses filtros.</p>
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] divide-y divide-[var(--line)]">
          {filtrados.map((lanc) => (
            <div key={lanc.id} className="flex items-center gap-4 px-6 py-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--ink)] truncate">{lanc.descricao}</p>
                <p className="text-xs text-[var(--ink-3)] mt-0.5">
                  {lanc.paciente?.nome ? `${lanc.paciente.nome} · ` : ""}
                  {FORMAS[lanc.forma_pagamento] ?? lanc.forma_pagamento} ·{" "}
                  {format(new Date(lanc.data + "T12:00:00"), "d/MM/yyyy")}
                </p>
              </div>

              <p className="text-sm font-semibold text-[var(--ink)] tabular-nums shrink-0">
                R$ {lanc.valor.toFixed(2).replace(".", ",")}
              </p>

              {lanc.numero_recibo && (
                <Link
                  href={`/profissionais/${profissionalId}/financeiro/${lanc.id}/recibo`}
                  className="text-[var(--ink-3)] hover:text-[var(--accent)] transition-colors shrink-0"
                  title={`Recibo ${lanc.numero_recibo}`}
                >
                  <FileText size={16} />
                </Link>
              )}

              <Link
                href={`/profissionais/${profissionalId}/financeiro/${lanc.id}/editar`}
                title="Editar lançamento"
                className="p-1.5 rounded-[8px] text-[var(--ink-3)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors shrink-0"
              >
                <Pencil size={14} />
              </Link>

              <ExcluirLancamento profissionalId={profissionalId} lancamentoId={lanc.id} />

              <LancamentoStatusForm
                profissionalId={profissionalId}
                lancamentoId={lanc.id}
                statusAtual={lanc.status}
              />
            </div>
          ))}
          <div className="px-6 py-3">
            <span className="text-xs text-[var(--ink-3)]">{filtrados.length} lançamento(s)</span>
          </div>
        </div>
      )}
    </div>
  );
}
