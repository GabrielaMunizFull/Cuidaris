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
  const [erro, setErro] = useState<string | null>(null);

  async function handleAssinar() {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) router.push(data.url);
      else setErro(data.error ?? "Não foi possível iniciar o pagamento. Tente novamente.");
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePortal() {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) router.push(data.url);
      else setErro(data.error ?? "Não foi possível abrir o portal. Tente novamente.");
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const btnBase = "w-full h-10 rounded-[var(--radius)] text-sm font-medium transition-colors disabled:opacity-50";

  if (ativo) {
    return (
      <div className="space-y-1">
        <button type="button" onClick={handlePortal} disabled={loading}
          className={`${btnBase} border border-[var(--line)] text-[var(--ink-2)] hover:bg-[var(--bg)]`}>
          {loading ? "Aguarde..." : "Gerenciar assinatura"}
        </button>
        {erro && <p className="text-xs text-red-500 text-center">{erro}</p>}
      </div>
    );
  }

  if (temAssinatura) {
    return (
      <div className="space-y-1">
        <button type="button" onClick={handleAssinar} disabled={loading}
          className={`${btnBase} border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-soft)]`}>
          {loading ? "Aguarde..." : "Mudar para este plano"}
        </button>
        {erro && <p className="text-xs text-red-500 text-center">{erro}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button type="button" onClick={handleAssinar} disabled={loading}
        className={[btnBase, destaque
          ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
          : "border border-[var(--line)] text-[var(--ink-2)] hover:bg-[var(--bg)]",
        ].join(" ")}>
        {loading ? "Aguarde..." : "Assinar agora"}
      </button>
      {erro && <p className="text-xs text-red-500 text-center">{erro}</p>}
    </div>
  );
}
