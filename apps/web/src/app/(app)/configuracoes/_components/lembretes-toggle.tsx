"use client";

import { useTransition } from "react";
import { toggleLembretesAction } from "../actions";

interface LembretesToggleProps {
  ativo: boolean;
}

export function LembretesToggle({ ativo }: LembretesToggleProps) {
  const [isPending, startTransition] = useTransition();

  function handleChange() {
    startTransition(async () => {
      await toggleLembretesAction(!ativo);
    });
  }

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-[var(--ink)]">Lembretes de consulta por e-mail</p>
        <p className="text-xs text-[var(--ink-3)] mt-0.5">
          Envia um e-mail para o paciente no dia da consulta com hora e profissional
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={ativo}
        onClick={handleChange}
        disabled={isPending}
        className={[
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 disabled:opacity-50",
          ativo ? "bg-[var(--accent)]" : "bg-[var(--line)]",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
            ativo ? "translate-x-6" : "translate-x-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
