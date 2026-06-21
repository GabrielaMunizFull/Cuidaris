"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deletarDocumentoAction } from "../actions";

export function DeletarDocumentoForm({
  profissionalId,
  documentoId,
}: {
  profissionalId: string;
  documentoId: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Remover este documento? Esta ação não pode ser desfeita.")) return;
    startTransition(() => { void deletarDocumentoAction(profissionalId, documentoId); });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="w-8 h-8 flex items-center justify-center rounded-[10px] text-[var(--ink-3)] hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
      title="Remover documento"
    >
      <Trash2 size={14} />
    </button>
  );
}
