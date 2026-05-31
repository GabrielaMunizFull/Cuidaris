"use client";

import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/(auth)/actions";
import { Avatar } from "@cuidaris/ui";

interface HeaderProps {
  assistenteNome: string;
}

export function Header({ assistenteNome }: HeaderProps) {
  const pathname = usePathname();

  const breadcrumb = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      const map: Record<string, string> = {
        dashboard: "Dashboard",
        profissionais: "Profissionais",
        pacientes: "Pacientes",
        agenda: "Agenda",
        financeiro: "Financeiro",
        novo: "Novo",
        configuracoes: "Configurações",
      };
      return map[segment] ?? segment;
    });

  return (
    <header className="h-14 fixed top-0 left-60 right-0 bg-[var(--surface)] border-b border-[var(--line)] flex items-center justify-between px-6 z-10">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm">
          {breadcrumb.map((crumb, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-[var(--ink-3)]">/</span>}
              <span
                className={
                  i === breadcrumb.length - 1
                    ? "font-medium text-[var(--ink)]"
                    : "text-[var(--ink-3)]"
                }
              >
                {crumb}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <form action={logoutAction}>
        <button
          type="submit"
          className="flex items-center gap-2 text-sm text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors"
          title="Sair"
        >
          <Avatar name={assistenteNome} size="sm" />
        </button>
      </form>
    </header>
  );
}
