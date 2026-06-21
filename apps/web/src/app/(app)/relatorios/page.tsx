import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Download } from "lucide-react";
import { MesSeletor } from "./_components/mes-seletor";
import { GraficoTendencia } from "./_components/grafico-tendencia";

export const metadata: Metadata = { title: "Relatórios — Cuidaris" };

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const FORMAS: Record<string, string> = {
  dinheiro: "Dinheiro",
  pix: "PIX",
  cartao_credito: "Cartão de Crédito",
  cartao_debito: "Cartão de Débito",
  transferencia: "Transferência",
  convenio: "Convênio",
};

function brl(valor: number) {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

function pct(valor: number, total: number) {
  if (total === 0) return "0%";
  return `${Math.round((valor / total) * 100)}%`;
}

export default async function RelatoriosPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; ano?: string }>;
}) {
  const { mes: mesParam, ano: anoParam } = await searchParams;
  const hoje = new Date();
  const mes = mesParam ? Number(mesParam) : hoje.getMonth() + 1;
  const ano = anoParam ? Number(anoParam) : hoje.getFullYear();

  const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
  const fimDate = new Date(ano, mes, 0);
  const fim = `${ano}-${String(mes).padStart(2, "0")}-${String(fimDate.getDate()).padStart(2, "0")}`;

  const supabase = await createClient();

  // Janela dos últimos 12 meses para o gráfico de tendência
  const anoInicio = mes <= 6 ? ano - 1 : ano;
  const mesInicio = mes <= 6 ? mes + 6 : mes - 6;
  const inicioTendencia = `${anoInicio}-${String(mesInicio).padStart(2, "0")}-01`;

  const [{ data: lancamentos }, { data: consultas }, { data: profissionais }, { data: lancamentosTendencia }] =
    await Promise.all([
      supabase
        .from("lancamentos")
        .select("profissional_id, valor, status, forma_pagamento, paciente:pacientes(convenio_id, convenio:convenios(nome)), profissional:profissionais(nome)")
        .gte("data", inicio)
        .lte("data", fim)
        .limit(50000),
      supabase
        .from("agenda")
        .select("profissional_id, status")
        .gte("data_hora", `${inicio}T00:00:00`)
        .lte("data_hora", `${fim}T23:59:59`)
        .limit(50000),
      supabase
        .from("profissionais")
        .select("id, nome")
        .eq("ativo", true)
        .order("nome"),
      supabase
        .from("lancamentos")
        .select("valor, status, data")
        .gte("data", inicioTendencia)
        .lte("data", fim)
        .limit(50000),
    ]);

  const l = lancamentos ?? [];
  const c = consultas ?? [];

  // Totais gerais
  const totalFaturado = l.reduce((s, x) => s + x.valor, 0);
  const totalRecebido = l.filter((x) => x.status === "pago").reduce((s, x) => s + x.valor, 0);
  const totalPendente = l.filter((x) => x.status === "pendente").reduce((s, x) => s + x.valor, 0);
  const totalInadimplente = l.filter((x) => x.status === "atrasado").reduce((s, x) => s + x.valor, 0);

  // Por profissional
  const profMap = new Map<string, { nome: string; faturado: number; recebido: number; pendente: number; inadimplente: number; consultas: number }>();
  for (const prof of profissionais ?? []) {
    profMap.set(prof.id, { nome: prof.nome, faturado: 0, recebido: 0, pendente: 0, inadimplente: 0, consultas: 0 });
  }
  for (const x of l) {
    const entry = profMap.get(x.profissional_id);
    if (!entry) continue;
    entry.faturado += x.valor;
    if (x.status === "pago") entry.recebido += x.valor;
    else if (x.status === "pendente") entry.pendente += x.valor;
    else if (x.status === "atrasado") entry.inadimplente += x.valor;
  }
  for (const x of c) {
    const entry = profMap.get(x.profissional_id);
    if (entry && x.status === "confirmado") entry.consultas += 1;
  }
  const porProfissional = [...profMap.values()].filter((p) => p.faturado > 0 || p.consultas > 0);

  // Por forma de pagamento
  const formaMap = new Map<string, number>();
  for (const x of l) {
    formaMap.set(x.forma_pagamento, (formaMap.get(x.forma_pagamento) ?? 0) + x.valor);
  }
  const porForma = [...formaMap.entries()].sort((a, b) => b[1] - a[1]);

  // Por convênio
  const convenioMap = new Map<string, number>();
  for (const x of l) {
    const nome = (x.paciente as { convenio?: { nome: string } | null } | null)?.convenio?.nome ?? "Particular";
    convenioMap.set(nome, (convenioMap.get(nome) ?? 0) + x.valor);
  }
  const porConvenio = [...convenioMap.entries()].sort((a, b) => b[1] - a[1]);

  // Tendência: agrega por mês/ano
  const tendenciaMap = new Map<string, { faturado: number; recebido: number }>();
  for (const lt of lancamentosTendencia ?? []) {
    const d = new Date(lt.data + "T12:00:00");
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    const entry = tendenciaMap.get(key) ?? { faturado: 0, recebido: 0 };
    entry.faturado += lt.valor;
    if (lt.status === "pago") entry.recebido += lt.valor;
    tendenciaMap.set(key, entry);
  }
  // Gera os 12 meses no intervalo
  const dadosTendencia = Array.from({ length: 12 }, (_, i) => {
    let m = mesInicio + i;
    let a = anoInicio;
    if (m > 12) { m -= 12; a += 1; }
    const key = `${a}-${m}`;
    const entry = tendenciaMap.get(key) ?? { faturado: 0, recebido: 0 };
    return {
      mes: m,
      ano: a,
      label: MESES[m - 1]!.slice(0, 3),
      ...entry,
    };
  });

  const semDados = l.length === 0;

  return (
    <div className="max-w-4xl space-y-6 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--ink)]">Relatórios</h1>
          <p className="text-sm text-[var(--ink-2)] mt-0.5 capitalize">
            {MESES[mes - 1]} {ano}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MesSeletor mes={mes} ano={ano} />
          <a
            href={`/api/relatorios/csv?mes=${mes}&ano=${ano}`}
            download
            className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] text-sm text-[var(--ink-2)] hover:bg-[var(--bg)] hover:text-[var(--ink)] transition-colors"
          >
            <Download size={14} />
            CSV
          </a>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Faturado", valor: totalFaturado, cor: "text-[var(--ink)]" },
          { label: "Recebido", valor: totalRecebido, cor: "text-emerald-600" },
          { label: "A receber", valor: totalPendente, cor: "text-amber-600" },
          { label: "Inadimplente", valor: totalInadimplente, cor: "text-red-600" },
        ].map(({ label, valor, cor }) => (
          <div key={label} className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-3)]">{label}</p>
            <p className={`text-2xl font-semibold mt-1 tabular-nums ${cor}`}>{brl(valor)}</p>
          </div>
        ))}
      </div>

      {/* Gráfico de tendência — sempre visível */}
      <GraficoTendencia dados={dadosTendencia} mesAtivo={mes} anoAtivo={ano} />

      {semDados ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-12 text-center">
          <p className="text-sm text-[var(--ink-3)]">Nenhum lançamento em {MESES[mes - 1]} {ano}.</p>
        </div>
      ) : (
        <>
          {/* Por profissional */}
          {porProfissional.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-[var(--ink)] mb-3">Por profissional</h2>
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] overflow-hidden">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-2.5 border-b border-[var(--line)]">
                  {["PROFISSIONAL", "CONSULTAS", "FATURADO", "RECEBIDO", "PENDENTE", "INADIMP."].map((col) => (
                    <span key={col} className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{col}</span>
                  ))}
                </div>
                {porProfissional.map((p) => (
                  <div key={p.nome} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center px-6 py-3.5 border-b border-[var(--line)] last:border-0">
                    <span className="text-sm font-medium text-[var(--ink)] truncate">{p.nome}</span>
                    <span className="text-sm text-[var(--ink-2)]">{p.consultas}</span>
                    <span className="text-sm text-[var(--ink)] tabular-nums">{brl(p.faturado)}</span>
                    <span className="text-sm text-emerald-600 tabular-nums">{brl(p.recebido)}</span>
                    <span className="text-sm text-amber-600 tabular-nums">{brl(p.pendente)}</span>
                    <span className="text-sm text-red-600 tabular-nums">{brl(p.inadimplente)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Por forma de pagamento + por convênio lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-sm font-semibold text-[var(--ink)] mb-3">Por forma de pagamento</h2>
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] overflow-hidden">
                <div className="grid grid-cols-[2fr_1fr_auto] gap-4 px-5 py-2.5 border-b border-[var(--line)]">
                  {["FORMA", "TOTAL", "%"].map((col) => (
                    <span key={col} className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{col}</span>
                  ))}
                </div>
                {porForma.map(([forma, valor]) => (
                  <div key={forma} className="grid grid-cols-[2fr_1fr_auto] gap-4 items-center px-5 py-3 border-b border-[var(--line)] last:border-0">
                    <span className="text-sm text-[var(--ink)]">{FORMAS[forma] ?? forma}</span>
                    <span className="text-sm text-[var(--ink)] tabular-nums">{brl(valor)}</span>
                    <span className="text-xs text-[var(--ink-3)]">{pct(valor, totalFaturado)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[var(--ink)] mb-3">Por convênio</h2>
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] overflow-hidden">
                <div className="grid grid-cols-[2fr_1fr_auto] gap-4 px-5 py-2.5 border-b border-[var(--line)]">
                  {["CONVÊNIO", "TOTAL", "%"].map((col) => (
                    <span key={col} className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{col}</span>
                  ))}
                </div>
                {porConvenio.map(([nome, valor]) => (
                  <div key={nome} className="grid grid-cols-[2fr_1fr_auto] gap-4 items-center px-5 py-3 border-b border-[var(--line)] last:border-0">
                    <span className="text-sm text-[var(--ink)]">{nome}</span>
                    <span className="text-sm text-[var(--ink)] tabular-nums">{brl(valor)}</span>
                    <span className="text-xs text-[var(--ink-3)]">{pct(valor, totalFaturado)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
