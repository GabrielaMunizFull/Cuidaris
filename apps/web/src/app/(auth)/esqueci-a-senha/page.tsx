"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CuidarisLogo } from "@/components/cuidaris-logo";
import { esqueceuSenhaAction } from "../actions";

const initialState = {};

export default function EsqueciASenhaPage() {
  const [state, formAction, isPending] = useActionState(esqueceuSenhaAction, initialState);

  return (
    <div className="space-y-8">
      <div className="hidden lg:block">
        <CuidarisLogo size="md" variant="dark" />
      </div>

      {"success" in state && state.success ? (
        <div className="space-y-6">
          <div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">
              Verifique seu e-mail
            </h1>
            <p className="mt-1.5 text-sm text-[var(--ink-2)]">
              Enviamos um link de recuperação para o seu e-mail. Verifique também a pasta de spam.
            </p>
          </div>
          <Link
            href="/login"
            className="block text-center text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors"
          >
            ← Voltar para o login
          </Link>
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">
              Esqueceu a senha?
            </h1>
            <p className="mt-1.5 text-sm text-[var(--ink-2)]">
              Informe seu e-mail e enviaremos um link para criar uma nova senha.
            </p>
          </div>

          <form action={formAction} className="space-y-5">
            {"error" in state && state.error && (
              <div className="rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
                {state.error as string}
              </div>
            )}

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
                className="h-11 w-full rounded-[10px] border border-[var(--line)] bg-white px-3.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] transition-colors focus:outline-none focus:border-[var(--accent)] focus:ring-3 focus:ring-[var(--accent)]/15"
              />
              {"fieldErrors" in state && (state.fieldErrors as Record<string, string[]>)?.email && (
                <p className="text-xs text-red-600">{(state.fieldErrors as Record<string, string[]>).email[0]}</p>
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
                  Enviando...
                </>
              ) : (
                "Enviar link de recuperação"
              )}
            </button>

            <p className="text-center text-sm text-[var(--ink-2)]">
              Lembrou a senha?{" "}
              <Link href="/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors">
                Voltar ao login
              </Link>
            </p>
          </form>
        </>
      )}
    </div>
  );
}
