const passos = [
  {
    numero: "1",
    titulo: "Crie sua conta",
    descricao: "Cadastre-se em menos de 2 minutos. 14 dias grátis, sem precisar de cartão.",
  },
  {
    numero: "2",
    titulo: "Adicione os profissionais",
    descricao: "Cada profissional tem sua agenda, pacientes e financeiro completamente isolados.",
  },
  {
    numero: "3",
    titulo: "Gerencie tudo num só lugar",
    descricao: "Agenda, recibos em PDF e controle financeiro em um painel limpo e rápido.",
  },
];

export function ComoFunciona() {
  return (
    <section className="py-20 px-6 bg-[var(--surface)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--ink)] tracking-tight mb-3">
            Como funciona
          </h2>
          <p className="text-[var(--ink-2)]">Pronto para usar em menos de 5 minutos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* linha conectora visível apenas em desktop */}
          <div className="hidden md:block absolute top-5 left-[calc(16.6%+1rem)] right-[calc(16.6%+1rem)] h-px bg-[var(--line)]" />

          {passos.map(({ numero, titulo, descricao }) => (
            <div key={numero} className="flex flex-col items-center text-center gap-4">
              <div className="relative w-10 h-10 rounded-full bg-[var(--accent)] text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-sm">
                {numero}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--ink)] mb-1.5">{titulo}</h3>
                <p className="text-sm text-[var(--ink-3)] leading-relaxed">{descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
