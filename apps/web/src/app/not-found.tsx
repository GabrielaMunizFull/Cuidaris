import Link from "next/link";
import { CuidarisLogo } from "@/components/cuidaris-logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-6 text-center">
      <CuidarisLogo size="sm" />
      <p className="mt-6 text-7xl font-bold text-[var(--ink)] tracking-tight">404</p>
      <h1 className="mt-3 text-xl font-semibold text-[var(--ink)]">Página não encontrada</h1>
      <p className="mt-2 text-sm text-[var(--ink-2)] max-w-xs">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center h-10 px-5 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
