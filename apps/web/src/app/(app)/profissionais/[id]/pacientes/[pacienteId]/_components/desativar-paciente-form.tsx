"use client";

import { useState, useTransition } from "react";
import { desativarPacienteAction } from "../../actions";

interface DesativarPacienteFormProps {
  profissionalId: string;
  pacienteId: string;
  pacienteNome: string;
}

export function DesativarPacienteForm({ profissionalId, pacienteId, pacienteNome }: DesativarPacienteFormProps) {
  const [confirmando, setConfirmando] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDesativar() {
    startTransition(async () => {
      await desativarPacienteAction(profissionalId, pacienteId);
    });
  }

  if (confirmando) {
    return (
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-[var(--ink)]">Desativar {pacienteNome}?</p>
        <p className="text-xs text-[var(--ink-3)]">O histórico será preservado, mas {pacienteNome} não aparecerá mais na agenda.</p>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => setConfirmando(false)}
            className="h-8 px-3 rounded-[10px] text-sm text-[var(--ink-2)] hover:bg-[var(--line)] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDesativar}
            disabled={isPending}
            className="h-8 px-3 rounded-[10px] bg-red-50 border border-red-200 text-sm text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {isPending ? "Desativando..." : "Desativar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirmando(true)}
      className="text-sm text-[var(--ink-3)] hover:text-red-600 transition-colors"
    >
      Desativar paciente
    </button>
  );
}
