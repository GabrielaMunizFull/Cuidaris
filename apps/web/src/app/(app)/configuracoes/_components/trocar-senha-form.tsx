"use client";

import { useActionState } from "react";
import { trocarSenhaAction, type ActionResult } from "../actions";

const initial: ActionResult = {};

function Field({
  name,
  label,
  error,
}: {
  name: string;
  label: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[var(--ink)]">{label}</label>
      <input
        name={name}
        type="password"
        autoComplete={name === "senha_atual" ? "current-password" : "new-password"}
        className="w-full h-10 px-3 rounded-[10px] border border-[var(--line)] bg-[var(--surface)] text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function TrocarSenhaForm() {
  const [state, action, isPending] = useActionState(trocarSenhaAction, initial);

  return (
    <form action={action} className="space-y-4">
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-emerald-600">Senha alterada com sucesso.</p>
      )}

      <Field name="senha_atual" label="Senha atual" error={state.fieldErrors?.senha_atual?.[0]} />
      <Field name="nova_senha" label="Nova senha" error={state.fieldErrors?.nova_senha?.[0]} />
      <Field name="confirmar_senha" label="Confirmar nova senha" error={state.fieldErrors?.confirmar_senha?.[0]} />

      <button
        type="submit"
        disabled={isPending}
        className="h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60"
      >
        {isPending ? "Atualizando…" : "Trocar senha"}
      </button>
    </form>
  );
}
