"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";

export function PortalButtonClient() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handlePortal() {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) router.push(data.url);
    else setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handlePortal}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors disabled:opacity-50"
    >
      <ExternalLink size={13} />
      {loading ? "Abrindo..." : "Gerenciar assinatura"}
    </button>
  );
}
