"use client";

import { useActionState } from "react";
import type { ActionResult } from "../actions";

interface ProfissionalFormProps {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>;
  defaultValues?: {
    nome?: string;
    especialidade?: string;
    registro?: string;
    email?: string;
    telefone?: string;
  };
  submitLabel?: string;
}

const initialState: ActionResult = {};

export function ProfissionalForm({
  action,
  defaultValues = {},
  submitLabel = "Salvar profissional",
}: ProfissionalFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error && (
        <div className="rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex flex-col gap-1.5">
          <label htmlFor="nome" className="text-sm font-medium text-[var(--ink)]">
            Nome completo <span className="text-red-500">*</span>
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            defaultValue={defaultValues.nome}
            placeholder="Dra. Ana Souza"
            className="h-10 w-full rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
          {state.fieldErrors?.nome && (
            <p className="text-xs text-red-600">{state.fieldErrors.nome[0]}</p>
          )}
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <label htmlFor="especialidade" className="text-sm font-medium text-[var(--ink)]">
            Especialidade <span className="text-red-500">*</span>
          </label>
          <input
            id="especialidade"
            name="especialidade"
            type="text"
            required
            defaultValue={defaultValues.especialidade}
            placeholder="Psicóloga, Nutricionista, Fisioterapeuta..."
            className="h-10 w-full rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
          {state.fieldErrors?.especialidade && (
            <p className="text-xs text-red-600">{state.fieldErrors.especialidade[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="registro" className="text-sm font-medium text-[var(--ink)]">
            CRM / CRP / Registro
          </label>
          <input
            id="registro"
            name="registro"
            type="text"
            defaultValue={defaultValues.registro}
            placeholder="CRP 06/12345"
            className="h-10 w-full rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="telefone" className="text-sm font-medium text-[var(--ink)]">
            Telefone
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            defaultValue={defaultValues.telefone}
            placeholder="(11) 99999-9999"
            className="h-10 w-full rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-[var(--ink)]">
            E-mail profissional
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultValues.email}
            placeholder="profissional@email.com"
            className="h-10 w-full rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
          {state.fieldErrors?.email && (
            <p className="text-xs text-red-600">{state.fieldErrors.email[0]}</p>
          )}
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
