"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction, type ActionResult } from "../../actions";

const initialState: ActionResult = {};

const inputClass =
  "h-11 w-full rounded-[10px] border border-[var(--line)] bg-white px-3.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] transition-colors focus:outline-none focus:border-[var(--accent)] focus:ring-3 focus:ring-[var(--accent)]/15";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div
          className="rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="nome" className="block text-sm font-medium text-[var(--ink)]">
          Seu nome
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          autoComplete="name"
          required
          placeholder="Maria Silva"
          className={inputClass}
        />
        {state.fieldErrors?.nome && (
          <p className="text-xs text-red-600">{state.fieldErrors.nome[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-[var(--ink)]">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="voce@email.com"
          className={inputClass}
        />
        {state.fieldErrors?.email && (
          <p className="text-xs text-red-600">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium text-[var(--ink)]">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Mínimo 8 caracteres"
          className={inputClass}
        />
        {state.fieldErrors?.password && (
          <p className="text-xs text-red-600">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--ink)]">
          Confirmar senha
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Repita a senha"
          className={inputClass}
        />
        {state.fieldErrors?.confirmPassword && (
          <p className="text-xs text-red-600">{state.fieldErrors.confirmPassword[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 h-11 w-full rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
      >
        {isPending ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Criando conta...
          </>
        ) : (
          "Criar conta — 14 dias grátis"
        )}
      </button>

      <p className="text-center text-sm text-[var(--ink-2)]">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors"
        >
          Entrar
        </Link>
      </p>

      <p className="text-center text-xs text-[var(--ink-3)]">
        Sem cartão de crédito. Cancele quando quiser.
      </p>
    </form>
  );
}
