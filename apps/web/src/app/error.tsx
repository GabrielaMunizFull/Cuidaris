"use client";

import Link from "next/link";
import { CuidarisLogo } from "@/components/cuidaris-logo";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-6 text-center">
      <CuidarisLogo size="sm" />
      <p className="mt-6 text-5xl font-bold text-[var(--ink)] tracking-tight">Oops</p>
      <h1 className="mt-3 text-xl font-semibold text-[var(--ink)]">Algo deu errado</h1>
      <p className="mt-2 text-sm text-[var(--ink-2)] max-w-xs">
        Ocorreu um erro inesperado. Seus dados estão salvos — tente novamente.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center h-10 px-5 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors"
        >
          Tentar novamente
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center h-10 px-5 rounded-[var(--radius)] border border-[var(--line)] text-[var(--ink-2)] text-sm hover:bg-[var(--surface)] transition-colors"
        >
          Ir para o painel
        </Link>
      </div>
    </div>
  );
}
