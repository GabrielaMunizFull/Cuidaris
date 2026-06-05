import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PLANOS } from "@/lib/stripe";
import { Check } from "lucide-react";
import { PlanosActions } from "./_components/planos-actions";

export const metadata: Metadata = {
  title: "Planos — Cuidaris",
};

export default async function PlanosPage({
  searchParams,
}: {
  searchParams: Promise<{ sucesso?: string }>;
}) {
  const { sucesso } = await searchParams;
  const supabase = await createClient();

  const { data: assistente } = await supabase
    .from("assistentes")
    .select("plano, status_assinatura, trial_termina_em, stripe_customer_id")
    .single();

  const planoAtual = assistente?.plano ?? null;
  const status = assistente?.status_assinatura ?? "trial";
  const temAssinatura = !!assistente?.stripe_customer_id;

  return (
    <div className="max-w-4xl mx-auto">
      {sucesso && (
        <div className="mb-6 rounded-[var(--radius)] bg-emerald-50 border border-emerald-200 px-5 py-4 text-sm text-emerald-700 font-medium">
          ✓ Assinatura ativada com sucesso! Bem-vinda ao Cuidaris.
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">Escolha o tamanho da sua operação.</h1>
        <p className="text-sm text-[var(--ink-2)] mt-1">
          {status === "trial"
            ? "Sem fidelidade. 14 dias grátis. Cancele quando quiser."
            : status === "ativo"
            ? `Você está no plano ${planoAtual}. Gerencie ou faça upgrade abaixo.`
            : "Seu período gratuito encerrou. Escolha um plano para continuar."}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {(Object.entries(PLANOS) as [keyof typeof PLANOS, typeof PLANOS[keyof typeof PLANOS]][]).map(
          ([key, plano]) => {
            const ativo = planoAtual === key;
            const destaque = "destaque" in plano && plano.destaque;

            return (
              <div
                key={key}
                className={[
                  "relative flex flex-col rounded-[var(--radius)] border bg-[var(--surface)] p-6",
                  destaque
                    ? "border-[var(--accent)] shadow-md"
                    : "border-[var(--line)]",
                  ativo ? "ring-2 ring-[var(--accent)]" : "",
                ].join(" ")}
              >
                {destaque && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Mais popular
                  </span>
                )}
                {ativo && (
                  <span className="absolute -top-3 right-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Plano atual
                  </span>
                )}

                <div className="mb-4">
                  <h2 className="text-base font-semibold text-[var(--ink)]">{plano.nome}</h2>
                  <p className="text-xs text-[var(--ink-3)] mt-0.5">{plano.descricao}</p>
                </div>

                <div className="mb-5">
                  <span className="text-3xl font-bold text-[var(--ink)] tabular-nums">
                    {plano.preco.split("/")[0]}
                  </span>
                  <span className="text-sm text-[var(--ink-3)]">/mês</span>
                </div>

                <ul className="flex flex-col gap-2 mb-6 flex-1">
                  {plano.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[var(--ink-2)]">
                      <Check size={14} className="text-[var(--accent)] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <PlanosActions
                  planoKey={key}
                  priceId={plano.priceId}
                  ativo={ativo}
                  temAssinatura={temAssinatura}
                  destaque={!!destaque}
                />
              </div>
            );
          }
        )}
      </div>

      <p className="mt-6 text-xs text-center text-[var(--ink-3)]">
        Todos os planos incluem 14 dias grátis. Cancele a qualquer momento.
      </p>
    </div>
  );
}
