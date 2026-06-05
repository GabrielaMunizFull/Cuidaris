"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, Plus, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { logoutAction } from "@/app/(auth)/actions";
import { Avatar } from "@cuidaris/ui";
import type { TipoConta } from "@cuidaris/db";

interface HeaderProps {
  assistenteNome: string;
  profissionais: { id: string; nome: string }[];
  tipoConta: TipoConta;
}

const breadcrumbMap: Record<string, string> = {
  dashboard: "Visão geral",
  profissionais: "Profissionais",
  pacientes: "Pacientes",
  agenda: "Agenda",
  financeiro: "Financeiro",
  relatorios: "Relatórios",
  convenios: "Convênios",
  planos: "Planos",
  novo: "Novo",
  editar: "Editar",
  configuracoes: "Configurações",
};

// Para autônomo, rotas dentro de /profissionais/[id]/ recebem labels personalizados
const breadcrumbAutonomo: Record<string, string> = {
  ...breadcrumbMap,
  pacientes: "Meus Pacientes",
  agenda: "Minha Agenda",
};

export function Header({ assistenteNome, profissionais, tipoConta }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const profissionalIdMatch = pathname.match(/^\/profissionais\/([^/]+)/);
  const profissionalId = profissionalIdMatch?.[1];

  const isAutonomo = tipoConta === "autonomo";
  const map = isAutonomo && profissionalId ? breadcrumbAutonomo : breadcrumbMap;

  // Para autônomo dentro de /profissionais/[id]/..., omitir o segmento "profissionais" e o UUID do breadcrumb
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumb = isAutonomo && profissionalId
    ? segments
        .filter((seg) => seg !== "profissionais" && seg !== profissionalId)
        .map((seg) => map[seg] ?? seg)
    : segments.map((seg) => map[seg] ?? seg);

  return (
    <header className="h-14 fixed top-0 left-0 lg:left-60 right-0 bg-[var(--surface)] border-b border-[var(--line)] flex items-center gap-4 px-6 z-10">
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
        <button
          type="button"
          className="relative w-8 h-8 flex items-center justify-center rounded-[10px] text-[var(--ink-3)] hover:bg-[var(--bg)] hover:text-[var(--ink-2)] transition-colors"
          title="Notificações (em breve)"
        >
          <Bell size={16} />
        </button>

        {/* CTA contextual */}
        {isAutonomo && profissionais[0] ? (
          // Autônomo: vai sempre direto para o próprio profissional
          profissionalId && profissionalId !== "novo" ? (
            <button
              type="button"
              onClick={() => router.push(`${pathname}?novo=1`)}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[10px] bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors"
            >
              <Plus size={13} />
              Novo paciente
            </button>
          ) : (
            <Link
              href={`/profissionais/${profissionais[0].id}/pacientes/novo`}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[10px] bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors"
            >
              <Plus size={13} />
              Novo paciente
            </Link>
          )
        ) : profissionalId && profissionalId !== "novo" ? (
          <button
            type="button"
            onClick={() => router.push(`${pathname}?novo=1`)}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[10px] bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors"
          >
            <Plus size={13} />
            Novo paciente
          </button>
        ) : profissionais.length === 0 ? (
          <Link
            href="/profissionais/novo"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[10px] bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors"
          >
            <Plus size={13} />
            Novo profissional
          </Link>
        ) : profissionais.length === 1 ? (
          <Link
            href={`/profissionais/${profissionais[0]!.id}/pacientes/novo`}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[10px] bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors"
          >
            <Plus size={13} />
            Novo paciente
          </Link>
        ) : (
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[10px] bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors"
            >
              <Plus size={13} />
              Novo paciente
              <ChevronDown size={12} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-10 w-48 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] shadow-lg py-1 z-50">
                {profissionais.map((prof) => (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push(`/profissionais/${prof.id}/pacientes/novo`);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--bg)] transition-colors truncate"
                  >
                    {prof.nome}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

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
