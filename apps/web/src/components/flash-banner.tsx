"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

const MENSAGENS: Record<string, string> = {
  profissional: "Profissional salvo.",
  paciente: "Paciente salvo.",
  consulta: "Consulta agendada.",
  lancamento: "Lançamento registrado.",
  convenio: "Convênio salvo.",
  documento: "Documento enviado.",
  "1": "Salvo com sucesso.",
};

export function FlashBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const salvo = searchParams.get("salvo");
  const [visivel, setVisivel] = useState(!!salvo);

  useEffect(() => {
    if (!salvo) return;
    const timer = setTimeout(() => {
      setVisivel(false);
      // Remove o param da URL sem reload
      const params = new URLSearchParams(searchParams.toString());
      params.delete("salvo");
      const nova = params.size > 0 ? `${pathname}?${params}` : pathname;
      router.replace(nova, { scroll: false });
    }, 4000);
    return () => clearTimeout(timer);
  }, [salvo, pathname, router, searchParams]);

  if (!visivel || !salvo) return null;

  const mensagem = MENSAGENS[salvo] ?? "Salvo com sucesso.";

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-[var(--accent-soft)] border border-emerald-200 text-sm text-emerald-800">
      <CheckCircle2 size={16} className="shrink-0 text-[var(--accent)]" />
      {mensagem}
    </div>
  );
}
