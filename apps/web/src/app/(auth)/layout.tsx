import { Users, CalendarDays, FileText } from "lucide-react";
import { CuidarisLogo } from "@/components/cuidaris-logo";

const features = [
  {
    icon: Users,
    title: "Vários profissionais, um só lugar",
    description: "Espaços isolados para cada profissional de saúde.",
  },
  {
    icon: CalendarDays,
    title: "Agenda e confirmações",
    description: "Sessões e consultas com status em tempo real.",
  },
  {
    icon: FileText,
    title: "Recibos e financeiro",
    description: "Emita recibos e acompanhe recebimentos em segundos.",
  },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Painel esquerdo — marketing */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-12 bg-gradient-to-br from-[#0B3D2E] via-[#0D4A38] to-[#0F7A52] relative overflow-hidden">
        {/* Círculos decorativos de fundo */}
        <div className="absolute top-[-80px] right-[-80px] w-[360px] h-[360px] rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-[-120px] left-[-60px] w-[400px] h-[400px] rounded-full bg-white/5 pointer-events-none" />

        {/* Logo */}
        <CuidarisLogo size="md" variant="light" />

        {/* Conteúdo central */}
        <div className="space-y-10">
          <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
            O dia a dia da sua secretaria,{" "}
            <span className="text-emerald-300">organizado e sem complicação.</span>
          </h1>

          <ul className="space-y-6">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="mt-0.5 w-9 h-9 rounded-[10px] bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-emerald-300" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-sm text-white/60 mt-0.5">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Rodapé */}
        <p className="text-xs text-white/40">© 2026 Cuidaris · Feito para quem cuida.</p>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white min-h-screen">
        {/* Logo visível só no mobile */}
        <div className="lg:hidden mb-8">
          <CuidarisLogo size="md" variant="dark" />
        </div>

        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
