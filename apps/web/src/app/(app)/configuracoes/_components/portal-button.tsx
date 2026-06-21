"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";

interface PortalButtonClientProps {
  label?: string;
  variant?: "link" | "button";
}

export function PortalButtonClient({
  label = "Gerenciar assinatura",
  variant = "link",
}: PortalButtonClientProps) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  async function handlePortal() {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      } else {
        setErro("Não foi possível abrir o portal. Tente novamente.");
        setLoading(false);
      }
    } catch {
      setErro("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  if (variant === "button") {
    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={handlePortal}
          disabled={loading}
          className="w-full h-10 flex items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
        >
          <ExternalLink size={14} />
          {loading ? "Abrindo..." : label}
        </button>
        {erro && <p className="text-xs text-red-500">{erro}</p>}
      </div>
    );
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <button
        type="button"
        onClick={handlePortal}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors disabled:opacity-50"
      >
        <ExternalLink size={13} />
        {loading ? "Abrindo..." : label}
      </button>
      {erro && <span className="text-xs text-red-500">{erro}</span>}
    </span>
  );
}
