"use client";

import { useActionState } from "react";
import type { ActionResult } from "../actions";

interface NovaConsultaFormProps {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>;
  pacientes: { id: string; nome: string }[];
  profissionalId: string;
  defaultValues?: {
    paciente_id?: string;
    data_hora?: string;
    duracao_minutos?: number;
    status?: string;
    observacoes?: string | null;
  };
  submitLabel?: string;
}

const initialState: ActionResult = {};

export function NovaConsultaForm({ action, pacientes, defaultValues, submitLabel = "Agendar consulta" }: NovaConsultaFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error && (
        <div className="rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="paciente_id" className="text-sm font-medium text-[var(--ink)]">
          Paciente <span className="text-red-500">*</span>
        </label>
        <select
          id="paciente_id"
          name="paciente_id"
          required
          defaultValue={defaultValues?.paciente_id ?? ""}
          className="h-10 w-full rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
        >
          <option value="">Selecione um paciente</option>
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
        {state.fieldErrors?.paciente_id && (
          <p className="text-xs text-red-600">{state.fieldErrors.paciente_id[0]}</p>
        )}
        {pacientes.length === 0 && (
          <p className="text-xs text-amber-600">Nenhum paciente cadastrado. Adicione um paciente primeiro.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex flex-col gap-1.5">
          <label htmlFor="data_hora" className="text-sm font-medium text-[var(--ink)]">
            Data e horário <span className="text-red-500">*</span>
          </label>
          <input
            id="data_hora"
            name="data_hora"
            type="datetime-local"
            required
            defaultValue={defaultValues?.data_hora}
            className="h-10 w-full rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
          {state.fieldErrors?.data_hora && (
            <p className="text-xs text-red-600">{state.fieldErrors.data_hora[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="duracao_minutos" className="text-sm font-medium text-[var(--ink)]">
            Duração (minutos)
          </label>
          <select
            id="duracao_minutos"
            name="duracao_minutos"
            defaultValue={defaultValues?.duracao_minutos ?? 50}
            className="h-10 w-full rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          >
            <option value="30">30 min</option>
            <option value="50">50 min</option>
            <option value="60">60 min</option>
            <option value="90">1h30</option>
            <option value="120">2h</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium text-[var(--ink)]">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={defaultValues?.status ?? "pendente"}
            className="h-10 w-full rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          >
            <option value="pendente">Pendente</option>
            <option value="confirmado">Confirmado</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="observacoes" className="text-sm font-medium text-[var(--ink)]">
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          rows={3}
          defaultValue={defaultValues?.observacoes ?? ""}
          placeholder="Informações adicionais..."
          className="w-full rounded-[10px] border border-[var(--line)] bg-white px-3 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none"
        />
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
          disabled={isPending || pacientes.length === 0}
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
