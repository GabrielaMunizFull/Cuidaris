"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Trash2, Plus } from "lucide-react";
import { criarAnotacaoAction, excluirAnotacaoAction } from "../actions";

interface Anotacao {
  id: string;
  conteudo: string;
  created_at: string;
  updated_at: string;
}

interface AnotacoesSectionProps {
  anotacoes: Anotacao[];
  profissionalId: string;
  pacienteId: string;
}

function ExcluirAnotacao({ profissionalId, pacienteId, anotacaoId }: { profissionalId: string; pacienteId: string; anotacaoId: string }) {
  const [isPending, startTransition] = useTransition();
  function handleClick() {
    if (!confirm("Excluir esta anotação?")) return;
    startTransition(async () => {
      await excluirAnotacaoAction(profissionalId, pacienteId, anotacaoId);
    });
  }
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="p-1 rounded-[6px] text-[var(--ink-3)] hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100"
      title="Excluir anotação"
    >
      <Trash2 size={13} />
    </button>
  );
}

export function AnotacoesSection({ anotacoes: inicial, profissionalId, pacienteId }: AnotacoesSectionProps) {
  const [anotacoes, setAnotacoes] = useState(inicial);
  const [conteudo, setConteudo] = useState("");
  const [aberto, setAberto] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!conteudo.trim()) return;
    setErro(null);
    startTransition(async () => {
      const result = await criarAnotacaoAction(profissionalId, pacienteId, { conteudo });
      if (result.error) {
        setErro(result.error);
      } else if (result.anotacao) {
        setAnotacoes((prev) => [result.anotacao!, ...prev]);
        setConteudo("");
        setAberto(false);
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[var(--ink)] flex items-center gap-2">
          <FileText size={15} className="text-[var(--ink-3)]" />
          Anotações
        </h2>
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors flex items-center gap-1"
        >
          <Plus size={13} />
          Nova anotação
        </button>
      </div>

      {aberto && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-4 flex flex-col gap-3">
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              rows={4}
              placeholder="Escreva suas observações, evolução clínica, próximos passos..."
              autoFocus
              className="w-full text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] bg-transparent border-none outline-none resize-none"
            />
            {erro && <p className="text-xs text-red-600">{erro}</p>}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => { setAberto(false); setConteudo(""); setErro(null); }}
                className="h-7 px-3 text-xs text-[var(--ink-2)] hover:bg-[var(--bg)] rounded-[8px] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending || !conteudo.trim()}
                className="h-7 px-3 text-xs font-medium bg-[var(--accent)] text-white rounded-[8px] hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
              >
                {isPending ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)]">
        {anotacoes.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-[var(--ink-3)]">Nenhuma anotação registrada.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--line)]">
            {anotacoes.map((a) => (
              <div key={a.id} className="group px-5 py-4 flex gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--ink-3)] mb-1.5">
                    {format(new Date(a.created_at), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    {a.updated_at !== a.created_at && " · editada"}
                  </p>
                  <p className="text-sm text-[var(--ink)] whitespace-pre-wrap leading-relaxed">{a.conteudo}</p>
                </div>
                <ExcluirAnotacao
                  profissionalId={profissionalId}
                  pacienteId={pacienteId}
                  anotacaoId={a.id}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
