import Link from "next/link";
import { Users, CalendarDays, FileText } from "lucide-react";
import { CuidarisLogo } from "@/components/cuidaris-logo";
import { PricingSection } from "./_components/pricing-section";
import { ComoFunciona } from "./_components/como-funciona";
import { Depoimentos } from "./_components/depoimentos";
import { Faq } from "./_components/faq";

const features = [
  {
    icon: Users,
    titulo: "Vários profissionais, um só lugar",
    descricao: "Gerencie psicólogos, nutricionistas, fisioterapeutas e mais em um único painel.",
  },
  {
    icon: CalendarDays,
    titulo: "Agenda e confirmações",
    descricao: "Visualize e gerencie todas as sessões com status em tempo real.",
  },
  {
    icon: FileText,
    titulo: "Recibos e financeiro",
    descricao: "Emita recibos em PDF e acompanhe recebimentos em segundos.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--surface)]" style={{ fontFamily: "var(--font)" }}>
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[var(--surface)]/90 backdrop-blur border-b border-[var(--line)]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <CuidarisLogo size="sm" />
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="h-8 px-4 rounded-[10px] text-sm text-[var(--ink-2)] hover:bg-[var(--bg)] transition-colors flex items-center"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="h-8 px-4 rounded-[10px] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors flex items-center"
            >
              Começar grátis
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center bg-gradient-to-b from-white to-[var(--bg)]">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            14 dias grátis · Sem cartão de crédito
          </div>
          <h1 className="text-5xl font-bold text-[var(--ink)] tracking-tight leading-tight mb-5">
            O dia a dia da sua secretaria,{" "}
            <span className="text-[var(--accent)]">organizado e sem complicação.</span>
          </h1>
          <p className="text-lg text-[var(--ink-2)] mb-8 leading-relaxed">
            Gerencie vários profissionais de saúde, agenda, pacientes e financeiro em um único painel. Simples o bastante para quem não é técnico.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/cadastro"
              className="h-11 px-6 rounded-[var(--radius)] bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors flex items-center gap-2"
            >
              Começar 14 dias grátis
            </Link>
            <a
              href="#precos"
              className="h-11 px-6 rounded-[var(--radius)] border border-[var(--line)] text-[var(--ink-2)] text-sm font-medium hover:bg-[var(--bg)] transition-colors flex items-center"
            >
              Ver planos
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, titulo, descricao }) => (
            <div
              key={titulo}
              className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-6"
            >
              <div className="w-10 h-10 rounded-[10px] bg-[var(--accent-soft)] flex items-center justify-center mb-4">
                <Icon size={18} className="text-[var(--accent)]" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--ink)] mb-1.5">{titulo}</h3>
              <p className="text-sm text-[var(--ink-3)] leading-relaxed">{descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <ComoFunciona />

      {/* Depoimentos */}
      <Depoimentos />

      {/* Pricing */}
      <PricingSection />

      {/* FAQ */}
      <Faq />

      {/* CTA Final */}
      <section className="py-20 px-6 bg-[var(--accent)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-3">
            Pronta para simplificar sua rotina?
          </h2>
          <p className="text-emerald-100 mb-8 leading-relaxed">
            14 dias grátis, sem cartão. Cancele quando quiser.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/cadastro"
              className="h-11 px-6 rounded-[var(--radius)] bg-white text-[var(--accent)] font-semibold hover:bg-emerald-50 transition-colors flex items-center"
            >
              Começar grátis agora
            </Link>
            <a
              href="mailto:gabrielasmunizf@gmail.com"
              className="h-11 px-6 rounded-[var(--radius)] border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors flex items-center"
            >
              Falar com a equipe
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--line)] py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CuidarisLogo size="sm" />
        </div>
        <p className="text-xs text-[var(--ink-3)]">© 2026 Cuidaris · Feito para quem cuida.</p>
      </footer>
    </div>
  );
}
