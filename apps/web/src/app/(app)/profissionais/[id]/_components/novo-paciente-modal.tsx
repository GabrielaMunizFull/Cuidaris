"use client";

import { useActionState, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";
import type { ActionResult } from "../pacientes/actions";

interface NovoPacienteModalProps {
  profissionalNome: string;
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>;
  convenios?: { id: string; nome: string }[];
}

const initialState: ActionResult = {};

export function NovoPacienteModal({ profissionalNome, action, convenios = [] }: NovoPacienteModalProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(action, initialState);

  // Abre automaticamente quando ?novo=1 está na URL
  useEffect(() => {
    if (searchParams.get("novo") === "1") setOpen(true);
  }, [searchParams]);

  function handleClose() {
    setOpen(false);
    // Remove o parâmetro da URL sem navegar
    const params = new URLSearchParams(searchParams.toString());
    params.delete("novo");
    const newUrl = params.size > 0 ? `${pathname}?${params}` : pathname;
    router.replace(newUrl, { scroll: false });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Novo paciente
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-xl">
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[var(--line)]">
              <div>
                <h2 className="text-base font-semibold text-[var(--ink)]">Novo paciente</h2>
                <p className="text-sm text-[var(--ink-3)] mt-0.5">
                  Cadastro rápido — você pode completar os dados depois.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-[10px] text-[var(--ink-3)] hover:bg-[var(--bg)] hover:text-[var(--ink)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form action={formAction} className="px-6 py-5 flex flex-col gap-4">
              {state.error && (
                <div className="rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {state.error}
                </div>
              )}

              {/* Profissional (somente leitura) */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-3)] mb-2">
                  Profissional responsável
                </p>
                <span className="inline-flex items-center h-8 px-3 rounded-[10px] bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-sm text-[var(--accent)] font-medium">
                  • {profissionalNome}
                </span>
              </div>

              {/* Nome */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-nome" className="text-sm font-medium text-[var(--ink)]">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <input
                  id="modal-nome"
                  name="nome"
                  type="text"
                  required
                  placeholder="Ex.: Ana Beatriz Carvalho"
                  autoFocus
                  className="h-10 rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                />
                {state.fieldErrors?.nome && (
                  <p className="text-xs text-red-600">{state.fieldErrors.nome[0]}</p>
                )}
              </div>

              {/* Data nascimento + Telefone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-nascimento" className="text-sm font-medium text-[var(--ink)]">
                    Data de nascimento
                  </label>
                  <input
                    id="modal-nascimento"
                    name="data_nascimento"
                    type="date"
                    className="h-10 rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-telefone" className="text-sm font-medium text-[var(--ink)]">
                    Telefone com DDD
                  </label>
                  <input
                    id="modal-telefone"
                    name="telefone"
                    type="tel"
                    placeholder="(11) 90000-0000"
                    className="h-10 rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                  />
                </div>
              </div>

              {/* E-mail */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-email" className="text-sm font-medium text-[var(--ink)]">
                  E-mail
                </label>
                <input
                  id="modal-email"
                  name="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  className="h-10 rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                />
                {state.fieldErrors?.email && (
                  <p className="text-xs text-red-600">{state.fieldErrors.email[0]}</p>
                )}
              </div>

              {/* Convênio */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-convenio" className="text-sm font-medium text-[var(--ink)]">
                  Convênio
                </label>
                <select
                  id="modal-convenio"
                  name="convenio_id"
                  className="h-10 rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                >
                  <option value="">Particular</option>
                  {convenios.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              {/* LGPD */}
              <p className="text-xs text-[var(--ink-3)] flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                </svg>
                Dados protegidos conforme a LGPD.
              </p>

              {/* Ações */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-9 px-4 rounded-[var(--radius)] text-sm text-[var(--ink-2)] hover:bg-[var(--bg)] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
                >
                  {isPending ? (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                  Salvar paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
