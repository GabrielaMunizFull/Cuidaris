"use client";

import { useActionState, useRef } from "react";
import type { ActionResult } from "../actions";

interface Paciente {
  id: string;
  nome: string;
}

const TIPOS = [
  { value: "prontuario", label: "Prontuário / Ficha" },
  { value: "exame", label: "Exame / Laudo" },
  { value: "receita", label: "Receita" },
  { value: "atestado", label: "Atestado" },
  { value: "outro", label: "Outro" },
];

interface DocumentoUploadFormProps {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>;
  pacientes: Paciente[];
  pacienteIdInicial?: string;
}

const initialState: ActionResult = {};

export function DocumentoUploadForm({ action, pacientes, pacienteIdInicial }: DocumentoUploadFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="p-3 rounded-[10px] bg-red-50 border border-red-200 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[var(--ink)]">
          Paciente <span className="text-red-500">*</span>
        </label>
        <select
          name="paciente_id"
          defaultValue={pacienteIdInicial ?? ""}
          className="w-full h-10 px-3 rounded-[10px] border border-[var(--line)] bg-[var(--surface)] text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          <option value="" disabled>Selecione um paciente</option>
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
        {state.fieldErrors?.paciente_id && (
          <p className="text-xs text-red-500">{state.fieldErrors.paciente_id[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[var(--ink)]">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          name="titulo"
          type="text"
          placeholder="Ex: Exame de sangue — jan/2026"
          className="w-full h-10 px-3 rounded-[10px] border border-[var(--line)] bg-[var(--surface)] text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        {state.fieldErrors?.titulo && (
          <p className="text-xs text-red-500">{state.fieldErrors.titulo[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[var(--ink)]">Tipo</label>
        <select
          name="tipo"
          defaultValue="outro"
          className="w-full h-10 px-3 rounded-[10px] border border-[var(--line)] bg-[var(--surface)] text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          {TIPOS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[var(--ink)]">
          Arquivo <span className="text-red-500">*</span>
        </label>
        <input
          ref={fileRef}
          name="arquivo"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          className="w-full text-sm text-[var(--ink-2)] file:mr-3 file:h-8 file:px-3 file:rounded-[8px] file:border-0 file:text-xs file:font-medium file:bg-[var(--accent-soft)] file:text-[var(--accent)] hover:file:bg-emerald-100 cursor-pointer"
        />
        <p className="text-xs text-[var(--ink-3)]">PDF, imagem ou documento Word · Máx. 10 MB</p>
        {state.fieldErrors?.arquivo && (
          <p className="text-xs text-red-500">{state.fieldErrors.arquivo[0]}</p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="h-10 px-5 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60"
        >
          {isPending ? "Enviando…" : "Enviar documento"}
        </button>
        <a
          href=".."
          className="h-10 px-5 rounded-[var(--radius)] border border-[var(--line)] text-[var(--ink-2)] text-sm hover:bg-[var(--bg)] transition-colors flex items-center"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
