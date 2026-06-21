const depoimentos = [
  {
    nome: "Camila Rocha",
    cargo: "Assistente virtual — 3 psicólogos",
    texto:
      "Antes eu controlava tudo em planilha e sempre tinha erro. Com o Cuidaris centralizei agenda e financeiro e ainda gero os recibos na hora. Economizo pelo menos 3 horas por semana.",
    iniciais: "CR",
  },
  {
    nome: "Fernanda Lima",
    cargo: "Assistente virtual — clínica de nutrição",
    texto:
      "O que mais gosto é a agenda semanal: vejo todos os profissionais de uma vez e não preciso abrir planilha nenhuma. O suporte foi rápido quando precisei de ajuda.",
    iniciais: "FL",
  },
  {
    nome: "Juliana Santos",
    cargo: "Assistente virtual — fisioterapeuta autônoma",
    texto:
      "Uso o plano Solo para a minha própria clínica. É simples, limpo e funciona no celular. Nunca mais esqueci de registrar um pagamento.",
    iniciais: "JS",
  },
];

const cores = ["#10B981", "#3B82F6", "#8B5CF6"];

export function Depoimentos() {
  return (
    <section className="py-20 px-6 bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--ink)] tracking-tight mb-3">
            Quem já usa o Cuidaris
          </h2>
          <p className="text-[var(--ink-2)]">Assistentes virtuais que simplificaram a gestão dos seus profissionais.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {depoimentos.map(({ nome, cargo, texto, iniciais }, i) => (
            <div
              key={nome}
              className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-6 flex flex-col gap-4"
            >
              <p className="text-sm text-[var(--ink-2)] leading-relaxed flex-1">
                &ldquo;{texto}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: cores[i] }}
                >
                  {iniciais}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">{nome}</p>
                  <p className="text-xs text-[var(--ink-3)]">{cargo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
