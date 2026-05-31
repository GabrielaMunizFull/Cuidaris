"use client";

import { useState } from "react";
import { atualizarStatusLancamentoAction } from "../actions";
import type { StatusLancamento } from "@cuidaris/db";

interface LancamentoStatusFormProps {
  profissionalId: string;
  lancamentoId: string;
  statusAtual: StatusLancamento;
}

const statusLabels: Record<StatusLancamento, string> = {
  pago: "Pago",
  pendente: "Pendente",
  atrasado: "Atrasado",
};

export function LancamentoStatusForm({
  profissionalId,
  lancamentoId,
  statusAtual,
}: LancamentoStatusFormProps) {
  const [atualizando, setAtualizando] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setAtualizando(true);
    await atualizarStatusLancamentoAction(
      profissionalId,
      lancamentoId,
      e.target.value as StatusLancamento
    );
    setAtualizando(false);
  }

  return (
    <select
      value={statusAtual}
      disabled={atualizando}
      onChange={onChange}
      className="text-xs rounded-[6px] border border-[var(--line)] bg-[var(--bg)] px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-50"
    >
      {Object.entries(statusLabels).map(([val, label]) => (
        <option key={val} value={val}>{label}</option>
      ))}
    </select>
  );
}
