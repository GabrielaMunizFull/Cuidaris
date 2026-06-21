"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Calendar, DollarSign, Shield, FileText } from "lucide-react";

type Tab = { href: string; label: string; icon: typeof Users; hasCount?: boolean; soon?: boolean };

const tabs: Tab[] = [
  { href: "pacientes", label: "Pacientes", icon: Users, hasCount: true },
  { href: "agenda", label: "Agenda", icon: Calendar },
  { href: "financeiro", label: "Financeiro", icon: DollarSign },
  { href: "convenios", label: "Convênios", icon: Shield },
  { href: "documentos", label: "Documentos", icon: FileText },
];

interface ProfissionalTabsProps {
  profissionalId: string;
  totalPacientes: number;
}

export function ProfissionalTabs({ profissionalId, totalPacientes }: ProfissionalTabsProps) {
  const pathname = usePathname();

  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] border-t-0 rounded-b-[var(--radius)] px-2">
      <div className="flex items-center">
        {tabs.map(({ href, label, icon: Icon, hasCount, soon }) => {
          const fullHref = `/profissionais/${profissionalId}/${href}`;
          const active = pathname.startsWith(fullHref);
          return (
            <Link
              key={href}
              href={soon ? "#" : fullHref}
              onClick={soon ? (e) => e.preventDefault() : undefined}
              className={[
                "inline-flex items-center gap-1.5 px-4 py-3.5 text-sm border-b-2 transition-colors whitespace-nowrap",
                active
                  ? "text-[var(--accent)] border-[var(--accent)] font-medium"
                  : "text-[var(--ink-3)] border-transparent hover:text-[var(--ink-2)] hover:border-[var(--line)]",
                soon ? "opacity-40 cursor-not-allowed" : "",
              ].join(" ")}
              title={soon ? "Em breve" : undefined}
            >
              <Icon size={15} />
              {label}
              {hasCount && totalPacientes > 0 && (
                <span
                  className={[
                    "ml-0.5 text-xs px-1.5 py-0.5 rounded-full font-medium",
                    active
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "bg-[var(--bg)] text-[var(--ink-3)]",
                  ].join(" ")}
                >
                  {totalPacientes}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
