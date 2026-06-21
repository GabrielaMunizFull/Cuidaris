"use client";

import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";

interface OnboardingChecklistProps {
  temProfissional: boolean;
  temPaciente: boolean;
  temConsulta: boolean;
  temLancamento: boolean;
  primeiroProfissionalId?: string;
}

export function OnboardingChecklist({
  temProfissional,
  temPaciente,
  temConsulta,
  temLancamento,
  primeiroProfissionalId,
}: OnboardingChecklistProps) {
  const passos = [
    {
      feito: temProfissional,
      label: "Adicione o primeiro profissional",
      descricao: "Crie o perfil do profissional que você gerencia",
      href: temProfissional ? undefined : "/profissionais/novo",
      cta: "Adicionar",
    },
    {
      feito: temPaciente,
      label: "Cadastre o primeiro paciente",
      descricao: "Adicione um paciente à agenda do profissional",
      href: temPaciente || !primeiroProfissionalId ? undefined : `/profissionais/${primeiroProfissionalId}/pacientes/novo`,
      cta: "Cadastrar",
    },
    {
      feito: temConsulta,
      label: "Agende uma consulta",
      descricao: "Marque a primeira sessão na agenda",
      href: temConsulta || !primeiroProfissionalId ? undefined : `/profissionais/${primeiroProfissionalId}/agenda/nova`,
      cta: "Agendar",
    },
    {
      feito: temLancamento,
      label: "Registre um lançamento financeiro",
      descricao: "Controle recebimentos e gerencie o financeiro",
      href: temLancamento || !primeiroProfissionalId ? undefined : `/profissionais/${primeiroProfissionalId}/financeiro/novo`,
      cta: "Registrar",
    },
  ];

  const concluidos = passos.filter((p) => p.feito).length;
  const todos = passos.length;

  if (concluidos === todos) return null;

  return (
    <section className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-semibold text-[var(--ink)]">Primeiros passos</h2>
          <p className="text-sm text-[var(--ink-2)] mt-0.5">
            Configure o Cuidaris para começar a organizar sua rotina.
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold text-[var(--accent)] bg-[var(--accent-soft)] px-2.5 py-1 rounded-full">
          {concluidos}/{todos} concluídos
        </span>
      </div>

      {/* Barra de progresso */}
      <div className="h-1.5 bg-[var(--line)] rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
          style={{ width: `${(concluidos / todos) * 100}%` }}
        />
      </div>

      <div className="flex flex-col gap-3">
        {passos.map((passo) => (
          <div
            key={passo.label}
            className={[
              "flex items-center gap-3 p-3 rounded-[10px] transition-colors",
              passo.feito ? "opacity-60" : "hover:bg-[var(--bg)]",
            ].join(" ")}
          >
            {passo.feito ? (
              <CheckCircle2 size={18} className="shrink-0 text-[var(--accent)]" />
            ) : (
              <Circle size={18} className="shrink-0 text-[var(--ink-3)]" />
            )}
            <div className="flex-1 min-w-0">
              <p className={["text-sm font-medium", passo.feito ? "text-[var(--ink-3)] line-through" : "text-[var(--ink)]"].join(" ")}>
                {passo.label}
              </p>
              {!passo.feito && (
                <p className="text-xs text-[var(--ink-3)] mt-0.5">{passo.descricao}</p>
              )}
            </div>
            {!passo.feito && passo.href && (
              <Link
                href={passo.href}
                className="shrink-0 text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
              >
                {passo.cta} →
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
