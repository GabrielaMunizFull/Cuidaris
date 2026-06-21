"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { desativarConvenioAction } from "../actions";

export function DesativarConvenioForm({ profissionalId, convenioId }: { profissionalId: string; convenioId: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirmando) {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-xs text-[var(--ink-2)]">Este convênio não aparecerá mais nos novos pacientes.</p>
        <div className="flex items-center gap-2">
          <button onClick={() => setConfirmando(false)} className="text-xs text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => startTransition(async () => { await desativarConvenioAction(profissionalId, convenioId); })}
            disabled={isPending}
            className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
          >
            {isPending ? "..." : "Desativar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirmando(true)}
      className="w-8 h-8 flex items-center justify-center rounded-[10px] text-[var(--ink-3)] hover:bg-red-50 hover:text-red-600 transition-colors"
      title="Desativar"
    >
      <Trash2 size={14} />
    </button>
  );
}
