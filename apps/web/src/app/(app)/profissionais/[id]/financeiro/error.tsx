"use client";

import { AlertTriangle } from "lucide-react";

export default function FinanceiroError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-14 h-14 rounded-[var(--radius)] bg-red-50 border border-red-100 flex items-center justify-center mb-5">
        <AlertTriangle size={24} className="text-red-500" />
      </div>
      <h1 className="text-xl font-semibold text-[var(--ink)] mb-2">Erro ao carregar financeiro</h1>
      <p className="text-sm text-[var(--ink-2)] max-w-xs mb-8">
        Não foi possível carregar os lançamentos. Seus dados estão salvos.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center h-9 px-5 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  );
}
