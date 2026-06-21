import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function AppNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-14 h-14 rounded-[var(--radius)] bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center mb-5">
        <FileQuestion size={24} className="text-[var(--ink-3)]" />
      </div>
      <h1 className="text-xl font-semibold text-[var(--ink)] mb-2">Página não encontrada</h1>
      <p className="text-sm text-[var(--ink-2)] max-w-xs mb-8">
        O recurso que você tentou acessar não existe ou foi removido.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center h-9 px-5 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors"
      >
        Voltar ao painel
      </Link>
    </div>
  );
}
