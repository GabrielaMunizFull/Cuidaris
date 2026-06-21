"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { excluirConsultaAction } from "../actions";

interface ExcluirConsultaFormProps {
  profissionalId: string;
  consultaId: string;
}

export function ExcluirConsultaForm({ profissionalId, consultaId }: ExcluirConsultaFormProps) {
  const [confirmando, setConfirmando] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirmando) {
    return (
      <div className="flex flex-col gap-1 p-2 rounded-[10px] bg-red-50 border border-red-200">
        <p className="text-xs font-medium text-red-700">Cancelar esta consulta?</p>
        <p className="text-xs text-red-500">Esta ação não pode ser desfeita.</p>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => setConfirmando(false)}
            className="text-xs text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={() =>
              startTransition(async () => {
                await excluirConsultaAction(profissionalId, consultaId);
              })
            }
            disabled={isPending}
            className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
          >
            {isPending ? "..." : "Sim, cancelar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirmando(true)}
      disabled={isPending}
      title="Cancelar consulta"
      className="p-1 rounded-[6px] text-[var(--ink-3)] hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      <Trash2 size={12} />
    </button>
  );
}
