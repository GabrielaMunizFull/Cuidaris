import Link from "next/link";
import { Check } from "lucide-react";
import { PLANOS } from "@/lib/stripe";

export function PricingSection() {
  return (
    <section id="precos" className="py-20 bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--ink)] tracking-tight">
            Planos simples e transparentes
          </h2>
          <p className="text-[var(--ink-2)] mt-3 text-lg">
            14 dias grátis em qualquer plano. Sem cartão de crédito.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.entries(PLANOS) as [keyof typeof PLANOS, typeof PLANOS[keyof typeof PLANOS]][]).map(
            ([, plano]) => {
              const destaque = "destaque" in plano && plano.destaque;
              return (
                <div
                  key={plano.nome}
                  className={[
                    "relative flex flex-col rounded-[var(--radius)] border bg-[var(--surface)] p-7",
                    destaque ? "border-[var(--accent)] shadow-lg" : "border-[var(--line)]",
                  ].join(" ")}
                >
                  {destaque && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Mais popular
                    </span>
                  )}

                  <div className="mb-5">
                    <h3 className="text-base font-semibold text-[var(--ink)]">{plano.nome}</h3>
                    <p className="text-xs text-[var(--ink-3)] mt-1">{plano.descricao}</p>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-[var(--ink)] tabular-nums">
                      {plano.preco.split("/")[0]}
                    </span>
                    <span className="text-sm text-[var(--ink-3)]">/mês</span>
                  </div>

                  <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                    {plano.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[var(--ink-2)]">
                        <Check size={14} className="text-[var(--accent)] shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/cadastro"
                    className={[
                      "w-full h-10 rounded-[var(--radius)] text-sm font-medium transition-colors flex items-center justify-center",
                      destaque
                        ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
                        : "border border-[var(--line)] text-[var(--ink-2)] hover:bg-[var(--bg)]",
                    ].join(" ")}
                  >
                    Começar grátis
                  </Link>
                </div>
              );
            }
          )}
        </div>

        <p className="text-center text-xs text-[var(--ink-3)] mt-8">
          Cancele a qualquer momento. Sem multa ou fidelidade.
        </p>
      </div>
    </section>
  );
}
