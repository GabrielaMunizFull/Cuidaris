import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/app/(auth)/actions";
import { PortalButtonClient } from "@/app/(app)/configuracoes/_components/portal-button";

export const metadata: Metadata = {
  title: "Acesso suspenso — Cuidaris",
};

const TEXTOS = {
  inadimplente: {
    titulo: "Pagamento pendente",
    descricao:
      "Houve um problema com o pagamento da sua assinatura. Atualize seu método de pagamento para restaurar o acesso imediatamente.",
    badge: "bg-amber-50 border-amber-200 text-amber-700",
    badgeLabel: "Pagamento pendente",
  },
  cancelado: {
    titulo: "Assinatura encerrada",
    descricao:
      "Sua assinatura foi cancelada. Todos os dados estão preservados por 30 dias. Reative agora para continuar de onde parou.",
    badge: "bg-red-50 border-red-200 text-red-700",
    badgeLabel: "Assinatura cancelada",
  },
} as const;

export default async function AcessoSuspensPage({
  searchParams,
}: {
  searchParams: Promise<{ motivo?: string }>;
}) {
  const { motivo } = await searchParams;
  const chave = motivo === "inadimplente" || motivo === "cancelado" ? motivo : "cancelado";
  const texto = TEXTOS[chave];

  const supabase = await createClient();
  const { data: assistente } = await supabase
    .from("assistentes")
    .select("stripe_customer_id")
    .single();

  const temPortal = !!assistente?.stripe_customer_id;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold text-[var(--ink)] tracking-tight mb-10">
        Cuidaris
      </Link>

      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-8 shadow-sm text-center">
        {/* Badge de status */}
        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${texto.badge} mb-6`}>
          {texto.badgeLabel}
        </span>

        <h1 className="text-xl font-bold text-[var(--ink)] tracking-tight mb-3">
          {texto.titulo}
        </h1>
        <p className="text-sm text-[var(--ink-2)] leading-relaxed mb-8">
          {texto.descricao}
        </p>

        <div className="flex flex-col gap-3">
          {temPortal ? (
            <PortalButtonClient
              label="Atualizar forma de pagamento"
              variant="button"
            />
          ) : (
            <Link
              href="/planos"
              className="w-full h-10 flex items-center justify-center rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
            >
              Escolher um plano
            </Link>
          )}

          <Link
            href="/planos"
            className="w-full h-10 flex items-center justify-center rounded-[var(--radius)] border border-[var(--line)] text-sm text-[var(--ink-2)] hover:bg-[var(--bg)] transition-colors"
          >
            Ver planos e preços
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--line)]">
          <p className="text-xs text-[var(--ink-3)] mb-3">
            Dúvidas? Entre em contato:{" "}
            <a href="mailto:suporte@cuidaris.com.br" className="text-[var(--accent)] hover:underline">
              suporte@cuidaris.com.br
            </a>
          </p>
          <form action={logoutAction}>
            <button type="submit" className="text-xs text-[var(--ink-3)] hover:text-red-600 transition-colors">
              Sair da conta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
