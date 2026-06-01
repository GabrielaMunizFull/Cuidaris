"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, Plus } from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";
import { Avatar } from "@cuidaris/ui";

interface HeaderProps {
  assistenteNome: string;
}

const breadcrumbMap: Record<string, string> = {
  dashboard: "Visão geral",
  profissionais: "Profissionais",
  pacientes: "Pacientes",
  agenda: "Agenda",
  financeiro: "Financeiro",
  novo: "Novo",
  editar: "Editar",
  configuracoes: "Configurações",
};

export function Header({ assistenteNome }: HeaderProps) {
  const pathname = usePathname();

  const breadcrumb = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => breadcrumbMap[segment] ?? segment);

  return (
    <header className="h-14 fixed top-0 left-60 right-0 bg-[var(--surface)] border-b border-[var(--line)] flex items-center gap-4 px-6 z-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="shrink-0">
        <ol className="flex items-center gap-1.5 text-sm">
          {breadcrumb.map((crumb, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-[var(--ink-3)]">/</span>}
              <span className={i === breadcrumb.length - 1 ? "font-medium text-[var(--ink)]" : "text-[var(--ink-3)]"}>
                {crumb}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      {/* Busca central */}
      <div className="flex-1 max-w-sm mx-auto">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)]" />
          <input
            type="search"
            placeholder="Buscar paciente, recibo..."
            className="h-8 w-full rounded-[10px] border border-[var(--line)] bg-[var(--bg)] pl-8 pr-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-colors"
          />
        </div>
      </div>

      {/* Ações à direita */}
      <div className="shrink-0 flex items-center gap-2">
        {/* Sino de notificação */}
        <button
          type="button"
          className="relative w-8 h-8 flex items-center justify-center rounded-[10px] text-[var(--ink-3)] hover:bg-[var(--bg)] hover:text-[var(--ink-2)] transition-colors"
          title="Notificações (em breve)"
        >
          <Bell size={16} />
        </button>

        {/* CTA Novo paciente */}
        <Link
          href="/profissionais/novo"
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[10px] bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors"
        >
          <Plus size={13} />
          Novo paciente
        </Link>

        {/* Avatar + sair */}
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-2 text-sm text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors ml-1"
            title={`Sair (${assistenteNome})`}
          >
            <Avatar name={assistenteNome} size="sm" />
          </button>
        </form>
      </div>
    </header>
  );
}
