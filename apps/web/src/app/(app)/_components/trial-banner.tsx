"use client";

import Link from "next/link";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface TrialBannerProps {
  diasRestantes: number;
}

export function TrialBanner({ diasRestantes }: TrialBannerProps) {
  const [fechado, setFechado] = useState(false);
  if (fechado) return null;

  const urgente = diasRestantes <= 2;

  return (
    <div
      className={[
        "flex items-center gap-3 px-6 py-2.5 text-sm",
        urgente
          ? "bg-red-50 border-b border-red-200 text-red-700"
          : "bg-amber-50 border-b border-amber-200 text-amber-700",
      ].join(" ")}
    >
      <AlertTriangle size={15} className="shrink-0" />
      <p className="flex-1">
        {diasRestantes <= 0
          ? "Seu período gratuito encerrou. Escolha um plano para continuar usando o Cuidaris."
          : diasRestantes === 1
          ? "Último dia do período gratuito! Assine agora para não perder o acesso."
          : `Seu período gratuito termina em ${diasRestantes} dias. Escolha um plano para continuar sem interrupções.`}
      </p>
      <Link
        href="/planos"
        className={[
          "shrink-0 font-semibold underline underline-offset-2 hover:no-underline",
          urgente ? "text-red-700" : "text-amber-700",
        ].join(" ")}
      >
        Ver planos
      </Link>
      <button
        type="button"
        onClick={() => setFechado(true)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  );
}
