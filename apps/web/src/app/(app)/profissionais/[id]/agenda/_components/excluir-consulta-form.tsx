"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { excluirConsultaAction } from "../actions";

interface ExcluirConsultaFormProps {
  profissionalId: string;
  consultaId: string;
}

export function ExcluirConsultaForm({ profissionalId, consultaId }: ExcluirConsultaFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Excluir esta consulta? Esta ação não pode ser desfeita.")) return;
    startTransition(async () => {
      await excluirConsultaAction(profissionalId, consultaId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      title="Excluir consulta"
      className="p-1 rounded-[6px] text-[var(--ink-3)] hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      <Trash2 size={12} />
    </button>
  );
}
