"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PlanosActionsProps {
  planoKey: string;
  priceId: string;
  ativo: boolean;
  temAssinatura: boolean;
  destaque: boolean;
}

export function PlanosActions({ priceId, ativo, temAssinatura, destaque }: PlanosActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAssinar() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json();
    if (data.url) router.push(data.url);
    else setLoading(false);
  }

  async function handlePortal() {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) router.push(data.url);
    else setLoading(false);
  }

  if (ativo) {
    return (
      <button
        type="button"
        onClick={handlePortal}
        disabled={loading}
        className="w-full h-10 rounded-[var(--radius)] border border-[var(--line)] text-sm text-[var(--ink-2)] hover:bg-[var(--bg)] transition-colors disabled:opacity-50"
      >
        {loading ? "Aguarde..." : "Gerenciar assinatura"}
      </button>
    );
  }

  if (temAssinatura) {
    return (
      <button
        type="button"
        onClick={handleAssinar}
        disabled={loading}
        className="w-full h-10 rounded-[var(--radius)] border border-[var(--accent)] text-sm text-[var(--accent)] font-medium hover:bg-[var(--accent-soft)] transition-colors disabled:opacity-50"
      >
        {loading ? "Aguarde..." : "Mudar para este plano"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAssinar}
      disabled={loading}
      className={[
        "w-full h-10 rounded-[var(--radius)] text-sm font-medium transition-colors disabled:opacity-50",
        destaque
          ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
          : "border border-[var(--line)] text-[var(--ink-2)] hover:bg-[var(--bg)]",
      ].join(" ")}
    >
      {loading ? "Aguarde..." : "Assinar agora"}
    </button>
  );
}
