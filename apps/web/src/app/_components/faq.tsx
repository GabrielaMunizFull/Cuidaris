"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const perguntas = [
  {
    pergunta: "O período de teste exige cartão de crédito?",
    resposta:
      "Não. Você tem 14 dias grátis sem precisar cadastrar nenhum método de pagamento. Só pedimos cartão se você decidir continuar depois do trial.",
  },
  {
    pergunta: "Posso gerenciar mais de um profissional?",
    resposta:
      "Sim! Os planos Profissional (até 5) e Clínica (ilimitados) foram feitos exatamente para isso. Cada profissional tem agenda, pacientes e financeiro completamente separados.",
  },
  {
    pergunta: "E se eu precisar cancelar?",
    resposta:
      "Cancele quando quiser direto pelo painel, sem burocracia. Você continua com acesso até o fim do período já pago. Não há multa nem fidelidade.",
  },
  {
    pergunta: "Os dados dos pacientes ficam seguros?",
    resposta:
      "Sim. Cada assistente só enxerga seus próprios dados graças ao isolamento por RLS no banco de dados. Usamos Supabase (PostgreSQL) com criptografia em repouso e em trânsito.",
  },
  {
    pergunta: "Funciona para qual especialidade?",
    resposta:
      "Qualquer profissional de saúde: psicólogos, nutricionistas, fisioterapeutas, médicos, fonoaudiólogos, terapeutas ocupacionais e muito mais.",
  },
  {
    pergunta: "Como funciona o faturamento?",
    resposta:
      "Cobrança mensal recorrente via cartão de crédito. Você pode mudar de plano ou cancelar a qualquer momento pelo portal do cliente, sem precisar falar com ninguém.",
  },
];

export function Faq() {
  const [aberto, setAberto] = useState<number | null>(null);

  return (
    <section className="py-20 px-6 bg-[var(--surface)]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--ink)] tracking-tight mb-3">
            Perguntas frequentes
          </h2>
          <p className="text-[var(--ink-2)]">Ainda tem dúvida? Fala com a gente pelo e-mail.</p>
        </div>

        <div className="divide-y divide-[var(--line)] border border-[var(--line)] rounded-[var(--radius)] overflow-hidden">
          {perguntas.map(({ pergunta, resposta }, i) => (
            <div key={i}>
              <button
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[var(--bg)] transition-colors"
                onClick={() => setAberto(aberto === i ? null : i)}
                aria-expanded={aberto === i}
              >
                <span className="text-sm font-medium text-[var(--ink)]">{pergunta}</span>
                <ChevronDown
                  size={16}
                  className="text-[var(--ink-3)] shrink-0 transition-transform duration-200"
                  style={{ transform: aberto === i ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              {aberto === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-[var(--ink-2)] leading-relaxed">{resposta}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
