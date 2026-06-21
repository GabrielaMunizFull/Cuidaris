"use client";

import { useActionState } from "react";
import { editarPerfilAction, type ActionResult } from "../actions";

const initial: ActionResult = {};

export function EditarPerfilForm({ nomeAtual }: { nomeAtual: string }) {
  const [state, action, isPending] = useActionState(editarPerfilAction, initial);

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {state.success && (
        <p className="text-sm text-emerald-600">Nome atualizado com sucesso.</p>
      )}

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[var(--ink)]">Nome</label>
        <input
          name="nome"
          type="text"
          defaultValue={nomeAtual}
          className="w-full h-10 px-3 rounded-[10px] border border-[var(--line)] bg-[var(--surface)] text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
        />
        {state.fieldErrors?.nome && (
          <p className="text-xs text-red-500">{state.fieldErrors.nome[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60"
      >
        {isPending ? "Salvando…" : "Salvar nome"}
      </button>
    </form>
  );
}
