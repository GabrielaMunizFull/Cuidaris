"use client";

import { useActionState } from "react";
import type { ActionResult } from "../actions";

interface LancamentoFormProps {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>;
  pacientes: { id: string; nome: string }[];
  defaultValues?: {
    descricao?: string;
    valor?: number;
    data?: string;
    forma_pagamento?: string;
    status?: string;
    paciente_id?: string | null;
  };
  submitLabel?: string;
}

const initialState: ActionResult = {};

const hoje = new Date().toISOString().slice(0, 10);

export function LancamentoForm({ action, pacientes, defaultValues, submitLabel = "Salvar lançamento" }: LancamentoFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error && (
        <div className="rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="descricao" className="text-sm font-medium text-[var(--ink)]">
          Descrição <span className="text-red-500">*</span>
        </label>
        <input
          id="descricao"
          name="descricao"
          type="text"
          required
          defaultValue={defaultValues?.descricao ?? ""}
          placeholder="Consulta, sessão, avaliação..."
          className="h-10 w-full rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
        />
        {state.fieldErrors?.descricao && (
          <p className="text-xs text-red-600">{state.fieldErrors.descricao[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="valor" className="text-sm font-medium text-[var(--ink)]">
            Valor (R$) <span className="text-red-500">*</span>
          </label>
          <input
            id="valor"
            name="valor"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={defaultValues?.valor ?? ""}
            placeholder="0,00"
            className="h-10 w-full rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
          {state.fieldErrors?.valor && (
            <p className="text-xs text-red-600">{state.fieldErrors.valor[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="data" className="text-sm font-medium text-[var(--ink)]">
            Data <span className="text-red-500">*</span>
          </label>
          <input
            id="data"
            name="data"
            type="date"
            required
            defaultValue={defaultValues?.data ?? hoje}
            className="h-10 w-full rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="forma_pagamento" className="text-sm font-medium text-[var(--ink)]">
            Forma de pagamento <span className="text-red-500">*</span>
          </label>
          <select
            id="forma_pagamento"
            name="forma_pagamento"
            required
            defaultValue={defaultValues?.forma_pagamento ?? "pix"}
            className="h-10 w-full rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          >
            <option value="pix">PIX</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao_credito">Cartão de Crédito</option>
            <option value="cartao_debito">Cartão de Débito</option>
            <option value="transferencia">Transferência</option>
            <option value="convenio">Convênio</option>
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
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
            <option value="atrasado">Atrasado</option>
          </select>
        </div>
      </div>

      {pacientes.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="paciente_id" className="text-sm font-medium text-[var(--ink)]">
            Paciente (opcional)
          </label>
          <select
            id="paciente_id"
            name="paciente_id"
            defaultValue={defaultValues?.paciente_id ?? ""}
            className="h-10 w-full rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          >
            <option value="">Sem vínculo</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>
      )}

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
