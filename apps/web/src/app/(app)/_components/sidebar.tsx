"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, DollarSign, BarChart2, Settings, Users, Shield } from "lucide-react";
import type { Profissional, TipoConta } from "@cuidaris/db";
import { Avatar } from "@cuidaris/ui";
import { CuidarisLogo } from "@/components/cuidaris-logo";

interface SidebarProps {
  profissionais: Pick<Profissional, "id" | "nome" | "especialidade" | "foto_url">[];
  assistenteNome: string;
  tipoConta: TipoConta;
}

const navAssistente = [
  { href: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/financeiro", label: "Financeiro", icon: DollarSign },
  { href: "/relatorios", label: "Relatórios", icon: BarChart2 },
];

function navAutonomo(profissionalId: string) {
  return [
    { href: "/dashboard", label: "Início", icon: LayoutDashboard },
    { href: `/profissionais/${profissionalId}/pacientes`, label: "Meus Pacientes", icon: Users },
    { href: `/profissionais/${profissionalId}/agenda`, label: "Minha Agenda", icon: Calendar },
    { href: `/profissionais/${profissionalId}/financeiro`, label: "Financeiro", icon: DollarSign },
    { href: `/profissionais/${profissionalId}/convenios`, label: "Convênios", icon: Shield },
    { href: "/relatorios", label: "Relatórios", icon: BarChart2 },
  ];
}

export function Sidebar({ profissionais, assistenteNome, tipoConta }: SidebarProps) {
  const pathname = usePathname();

  const isAutonomo = tipoConta === "autonomo";
  const profissionalId = profissionais[0]?.id;
  const navItems = isAutonomo && profissionalId
    ? navAutonomo(profissionalId)
    : navAssistente;

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 bg-[var(--surface)] border-r border-[var(--line)] flex-col z-20">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-[var(--line)]">
        <CuidarisLogo size="sm" variant="dark" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === "/dashboard"
            ? pathname === href
            : pathname.startsWith(href);
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

        {/* Seção Profissionais — apenas para assistente */}
        {!isAutonomo && (
          <>
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
                  <Link
                    key={prof.id}
                    href={`${base}/pacientes`}
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
                );
              })
            )}
          </>
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
