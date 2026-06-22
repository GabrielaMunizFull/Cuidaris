import Link from "next/link";
import { CuidarisLogo } from "@/components/cuidaris-logo";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <CuidarisLogo size="sm" />
          </Link>
          <Link
            href="/"
            className="text-sm text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors"
          >
            ← Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">{children}</main>

      <footer className="border-t border-[var(--line)] py-6 text-center">
        <p className="text-xs text-[var(--ink-3)]">© 2026 Cuidaris · Feito para quem cuida.</p>
      </footer>
    </div>
  );
}
