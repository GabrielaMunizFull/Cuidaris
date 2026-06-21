"use client";

import { useActionState } from "react";
import { CuidarisLogo } from "@/components/cuidaris-logo";
import { redefinirSenhaAction } from "../actions";

const initialState = {};

export default function RedefinirSenhaPage() {
  const [state, formAction, isPending] = useActionState(redefinirSenhaAction, initialState);

  return (
    <div className="space-y-8">
      <div className="hidden lg:block">
        <CuidarisLogo size="md" variant="dark" />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">
          Criar nova senha
        </h1>
        <p className="mt-1.5 text-sm text-[var(--ink-2)]">
          Escolha uma senha forte com pelo menos 8 caracteres.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        {"error" in state && !!state.error && (
          <div className="rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
            {state.error as string}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-[var(--ink)]">
            Nova senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Mínimo 8 caracteres"
            className="h-11 w-full rounded-[10px] border border-[var(--line)] bg-white px-3.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] transition-colors focus:outline-none focus:border-[var(--accent)] focus:ring-3 focus:ring-[var(--accent)]/15"
          />
          {"fieldErrors" in state && (state.fieldErrors as Record<string, string[]>)?.password && (
            <p className="text-xs text-red-600">{(state.fieldErrors as Record<string, string[]>).password?.[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--ink)]">
            Confirmar nova senha
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Repita a senha"
            className="h-11 w-full rounded-[10px] border border-[var(--line)] bg-white px-3.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] transition-colors focus:outline-none focus:border-[var(--accent)] focus:ring-3 focus:ring-[var(--accent)]/15"
          />
          {"fieldErrors" in state && (state.fieldErrors as Record<string, string[]>)?.confirmPassword && (
            <p className="text-xs text-red-600">{(state.fieldErrors as Record<string, string[]>).confirmPassword?.[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="h-11 w-full rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Salvando...
            </>
          ) : (
            "Salvar nova senha"
          )}
        </button>
      </form>
    </div>
  );
}
