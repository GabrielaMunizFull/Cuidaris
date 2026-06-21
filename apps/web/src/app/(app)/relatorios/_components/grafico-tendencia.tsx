interface MesDado {
  mes: number;
  ano: number;
  label: string;
  faturado: number;
  recebido: number;
}

interface GraficoTendenciaProps {
  dados: MesDado[];
  mesAtivo: number;
  anoAtivo: number;
}

function brl(valor: number) {
  if (valor >= 1000) return `R$ ${(valor / 1000).toFixed(1)}k`;
  return `R$ ${valor.toFixed(0)}`;
}

export function GraficoTendencia({ dados, mesAtivo, anoAtivo }: GraficoTendenciaProps) {
  const max = Math.max(...dados.map((d) => d.faturado), 1);

  return (
    <div>
      <h2 className="text-sm font-semibold text-[var(--ink)] mb-4">Tendência de faturamento</h2>
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-5">
        {/* Legenda */}
        <div className="flex items-center gap-5 mb-5">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[var(--accent)]/20 border border-[var(--accent)]/40 inline-block" />
            <span className="text-xs text-[var(--ink-3)]">Faturado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[var(--accent)] inline-block" />
            <span className="text-xs text-[var(--ink-3)]">Recebido</span>
          </div>
        </div>

        {/* Barras */}
        <div className="flex items-end gap-2" style={{ height: 160 }}>
          {dados.map((d) => {
            const isAtivo = d.mes === mesAtivo && d.ano === anoAtivo;
            const alturaPct = (d.faturado / max) * 100;
            const recebidoPct = d.faturado > 0 ? (d.recebido / d.faturado) * alturaPct : 0;

            return (
              <div key={`${d.ano}-${d.mes}`} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                {/* Tooltip */}
                {d.faturado > 0 && (
                  <div className="absolute bottom-full mb-8 left-1/2 -translate-x-1/2 bg-[var(--ink)] text-white text-xs rounded-[8px] px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                    <p className="font-medium">{brl(d.faturado)}</p>
                    <p className="text-white/70">{brl(d.recebido)} recebido</p>
                  </div>
                )}

                {/* Barra */}
                <div className="w-full flex flex-col justify-end" style={{ height: 140 }}>
                  <div
                    className="w-full relative rounded-t-[4px] overflow-hidden"
                    style={{ height: `${Math.max(alturaPct, d.faturado > 0 ? 4 : 0)}%` }}
                  >
                    {/* Fundo (faturado) */}
                    <div className={[
                      "absolute inset-0 rounded-t-[4px]",
                      isAtivo ? "bg-[var(--accent)]/30 border border-[var(--accent)]/50" : "bg-[var(--accent)]/15",
                    ].join(" ")} />
                    {/* Recebido */}
                    {recebidoPct > 0 && (
                      <div
                        className={[
                          "absolute bottom-0 left-0 right-0 rounded-t-[4px]",
                          isAtivo ? "bg-[var(--accent)]" : "bg-[var(--accent)]/70",
                        ].join(" ")}
                        style={{ height: `${(recebidoPct / alturaPct) * 100}%` }}
                      />
                    )}
                  </div>
                </div>

                {/* Label */}
                <span className={[
                  "text-[10px] capitalize",
                  isAtivo ? "font-semibold text-[var(--accent)]" : "text-[var(--ink-3)]",
                ].join(" ")}>
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
