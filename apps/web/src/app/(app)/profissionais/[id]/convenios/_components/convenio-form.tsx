"use client";

import { useActionState } from "react";
import type { ActionResult } from "../actions";

interface ConvenioFormProps {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>;
  defaultValues?: { nome?: string; valor_padrao?: number | null };
  submitLabel?: string;
}

const initialState: ActionResult = {};

export function ConvenioForm({ action, defaultValues = {}, submitLabel = "Salvar convênio" }: ConvenioFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error && (
        <div className="rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="nome" className="text-sm font-medium text-[var(--ink)]">
          Nome do convênio <span className="text-red-500">*</span>
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          defaultValue={defaultValues.nome}
          placeholder="Ex.: Unimed, Bradesco Saúde, Particular"
          className="h-10 rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
        />
        {state.fieldErrors?.nome && (
          <p className="text-xs text-red-600">{state.fieldErrors.nome[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="valor_padrao" className="text-sm font-medium text-[var(--ink)]">
          Valor padrão da sessão
          <span className="text-[var(--ink-3)] font-normal ml-1">(opcional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--ink-3)]">R$</span>
          <input
            id="valor_padrao"
            name="valor_padrao"
            type="text"
            inputMode="decimal"
            defaultValue={defaultValues.valor_padrao?.toString().replace(".", ",") ?? ""}
            placeholder="0,00"
            className="h-10 w-full rounded-[10px] border border-[var(--line)] bg-white pl-9 pr-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => history.back()}
          className="h-9 px-4 rounded-[var(--radius)] text-sm text-[var(--ink-2)] hover:bg-[var(--line)] transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isPending && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
