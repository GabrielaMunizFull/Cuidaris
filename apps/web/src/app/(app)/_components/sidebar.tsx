"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, DollarSign, Settings } from "lucide-react";
import type { Profissional } from "@cuidaris/db";
import { Avatar } from "@cuidaris/ui";
import { CuidarisLogo } from "@/components/cuidaris-logo";

interface SidebarProps {
  profissionais: Pick<Profissional, "id" | "nome" | "especialidade" | "foto_url">[];
  assistenteNome: string;
}

const navGlobal = [
  { href: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/financeiro", label: "Financeiro", icon: DollarSign },
];

const navProfissional = [
  { href: "agenda", label: "Agenda", icon: Calendar },
  { href: "pacientes", label: "Pacientes", icon: Users },
  { href: "financeiro", label: "Financeiro", icon: DollarSign },
];

export function Sidebar({ profissionais, assistenteNome }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-[var(--surface)] border-r border-[var(--line)] flex flex-col z-20">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-[var(--line)]">
        <CuidarisLogo size="sm" variant="dark" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-0.5">
        {navGlobal.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-sm transition-colors",
                active
                  ? "bg-[var(--accent-soft)] text-[var(--accent)] font-medium"
                  : "text-[var(--ink-2)] hover:bg-[var(--bg)] hover:text-[var(--ink)]",
              ].join(" ")}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}

        {/* Profissionais */}
        <div className="mt-4 mb-1 px-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-3)]">
            Profissionais
          </span>
        </div>

        {profissionais.length === 0 ? (
          <Link
            href="/profissionais/novo"
            className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-sm text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors"
          >
            + Adicionar profissional
          </Link>
        ) : (
          profissionais.map((prof) => {
            const base = `/profissionais/${prof.id}`;
            const isActive = pathname.startsWith(base);
            return (
              <div key={prof.id}>
                <Link
                  href={`${base}/agenda`}
                  className={[
                    "flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-sm transition-colors",
                    isActive
                      ? "bg-[var(--accent-soft)] text-[var(--accent)] font-medium"
                      : "text-[var(--ink-2)] hover:bg-[var(--bg)] hover:text-[var(--ink)]",
                  ].join(" ")}
                >
                  <Avatar name={prof.nome} src={prof.foto_url} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm">{prof.nome}</p>
                    <p className="truncate text-xs text-[var(--ink-3)]">{prof.especialidade}</p>
                  </div>
                </Link>

                {isActive && (
                  <div className="ml-8 mt-0.5 flex flex-col gap-0.5">
                    {navProfissional.map(({ href: subHref, label, icon: Icon }) => {
                      const fullHref = `${base}/${subHref}`;
                      const subActive = pathname === fullHref;
                      return (
                        <Link
                          key={subHref}
                          href={fullHref}
                          className={[
                            "flex items-center gap-2 px-3 py-1.5 rounded-[10px] text-sm transition-colors",
                            subActive
                              ? "text-[var(--accent)] font-medium"
                              : "text-[var(--ink-3)] hover:text-[var(--ink)]",
                          ].join(" ")}
                        >
                          <Icon size={14} />
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--line)] p-3">
        <Link
          href="/configuracoes"
          className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-sm text-[var(--ink-2)] hover:bg-[var(--bg)] hover:text-[var(--ink)] transition-colors"
        >
          <Settings size={16} />
          Configurações
        </Link>
        <div className="mt-1 flex items-center gap-2.5 px-3 py-2">
          <Avatar name={assistenteNome} size="sm" />
          <span className="text-sm text-[var(--ink-2)] truncate">{assistenteNome}</span>
        </div>
      </div>
    </aside>
  );
}
