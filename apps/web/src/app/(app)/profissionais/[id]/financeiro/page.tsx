import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@cuidaris/ui";
import { Plus, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LancamentoStatusForm } from "./_components/lancamento-status-form";

export const metadata: Metadata = {
  title: "Financeiro — Cuidaris",
};

const formasPagamento: Record<string, string> = {
  dinheiro: "Dinheiro",
  pix: "PIX",
  cartao_credito: "Cartão de Crédito",
  cartao_debito: "Cartão de Débito",
  transferencia: "Transferência",
  convenio: "Convênio",
};

export default async function FinanceiroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: prof } = await supabase
    .from("profissionais")
    .select("id, nome")
    .eq("id", id)
    .single();

  if (!prof) notFound();

  const mesAtual = new Date();
  const inicioMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const fimMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);

  const { data: lancamentos } = await supabase
    .from("lancamentos")
    .select("id, descricao, valor, data, forma_pagamento, status, numero_recibo, paciente:pacientes(nome)")
    .eq("profissional_id", id)
    .gte("data", inicioMes)
    .lte("data", fimMes)
    .order("data", { ascending: false });

  const totalRecebido = lancamentos
    ?.filter((l) => l.status === "pago")
    .reduce((sum, l) => sum + l.valor, 0) ?? 0;

  const totalPendente = lancamentos
    ?.filter((l) => l.status === "pendente")
    .reduce((sum, l) => sum + l.valor, 0) ?? 0;

  const mesLabel = format(mesAtual, "MMMM yyyy", { locale: ptBR });

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[var(--ink)] capitalize">
            Financeiro — {mesLabel}
          </h1>
          <p className="text-sm text-[var(--ink-2)] mt-0.5">{prof.nome}</p>
        </div>
        <Link
          href={`/profissionais/${id}/financeiro/novo`}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
        >
          <Plus size={16} />
          Novo lançamento
        </Link>
      </div>

      {/* Resumo do mês */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-5">
          <p className="text-xs font-medium text-[var(--ink-3)] uppercase tracking-wide">Recebido</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1 tabular-nums">
            R$ {totalRecebido.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-5">
          <p className="text-xs font-medium text-[var(--ink-3)] uppercase tracking-wide">A receber</p>
          <p className="text-2xl font-semibold text-amber-600 mt-1 tabular-nums">
            R$ {totalPendente.toFixed(2).replace(".", ",")}
          </p>
        </div>
      </div>

      {/* Lista de lançamentos */}
      {!lancamentos || lancamentos.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-12 text-center">
          <p className="text-[var(--ink-2)] mb-4">Nenhum lançamento neste mês.</p>
          <Link
            href={`/profissionais/${id}/financeiro/novo`}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            <Plus size={16} />
            Adicionar lançamento
          </Link>
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] divide-y divide-[var(--line)]">
          {lancamentos.map((lanc) => (
            <div key={lanc.id} className="flex items-center gap-4 px-6 py-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--ink)] truncate">{lanc.descricao}</p>
                <p className="text-xs text-[var(--ink-3)] mt-0.5">
                  {(lanc.paciente as { nome: string } | null)?.nome ?? ""}{" "}
                  {(lanc.paciente as { nome: string } | null)?.nome ? "·" : ""}{" "}
                  {formasPagamento[lanc.forma_pagamento] ?? lanc.forma_pagamento} ·{" "}
                  {format(new Date(lanc.data + "T12:00:00"), "d/MM/yyyy")}
                </p>
              </div>

              <p className="text-sm font-semibold text-[var(--ink)] tabular-nums">
                R$ {lanc.valor.toFixed(2).replace(".", ",")}
              </p>

              {lanc.numero_recibo && (
                <Link
                  href={`/profissionais/${id}/financeiro/${lanc.id}/recibo`}
                  className="text-[var(--ink-3)] hover:text-[var(--accent)] transition-colors"
                  title={`Recibo ${lanc.numero_recibo}`}
                >
                  <FileText size={16} />
                </Link>
              )}

              <LancamentoStatusForm
                profissionalId={id}
                lancamentoId={lanc.id}
                statusAtual={lanc.status as "pago" | "pendente" | "atrasado"}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
