"use client";

import { useRouter, useSearchParams } from "next/navigation";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

interface MesSeletorProps {
  mes: number;
  ano: number;
}

export function MesSeletor({ mes, ano }: MesSeletorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const anoAtual = new Date().getFullYear();
  const anos = [anoAtual, anoAtual - 1, anoAtual - 2];

  function navegar(novoMes: number, novoAno: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mes", String(novoMes));
    params.set("ano", String(novoAno));
    router.push(`?${params}`);
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={mes}
        onChange={(e) => navegar(Number(e.target.value), ano)}
        className="h-9 rounded-[10px] border border-[var(--line)] bg-[var(--surface)] px-3 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
      >
        {MESES.map((nome, i) => (
          <option key={i} value={i + 1}>{nome}</option>
        ))}
      </select>
      <select
        value={ano}
        onChange={(e) => navegar(mes, Number(e.target.value))}
        className="h-9 rounded-[10px] border border-[var(--line)] bg-[var(--surface)] px-3 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
      >
        {anos.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
    </div>
  );
}
