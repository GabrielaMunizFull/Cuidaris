import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@cuidaris/ui";
import { logoutAction } from "@/app/(auth)/actions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PortalButtonClient } from "./_components/portal-button";

export const metadata: Metadata = { title: "Configurações — Cuidaris" };

const planoNome: Record<string, string> = {
  solo: "Solo",
  essencial: "Essencial",
  profissional: "Profissional",
  clinica: "Clínica",
};

const statusNome: Record<string, string> = {
  trial: "Período gratuito",
  ativo: "Ativo",
  cancelado: "Cancelado",
  inadimplente: "Inadimplente",
};

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: assistente } = await supabase
    .from("assistentes")
    .select("nome, email, plano, status_assinatura, trial_termina_em, stripe_customer_id, tipo_conta")
    .single();

  const trialTermina = assistente?.trial_termina_em
    ? format(new Date(assistente.trial_termina_em), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : null;

  return (
    <div className="max-w-xl space-y-6 mx-auto">
      <div>
        <h1 className="text-xl font-semibold text-[var(--ink)]">Configurações</h1>
        <p className="text-sm text-[var(--ink-2)] mt-0.5">Sua conta e assinatura</p>
      </div>

      {/* Perfil */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-6">
        <h2 className="text-sm font-semibold text-[var(--ink)] mb-4">Perfil</h2>
        <div className="flex items-center gap-4">
          <Avatar name={assistente?.nome ?? user?.email ?? "?"} size="lg" />
          <div>
            <p className="text-sm font-medium text-[var(--ink)]">{assistente?.nome ?? "—"}</p>
            <p className="text-sm text-[var(--ink-3)]">{assistente?.email ?? user?.email}</p>
            <p className="text-xs text-[var(--ink-3)] mt-0.5">
              {assistente?.tipo_conta === "autonomo" ? "Profissional Autônomo" : "Assistente Virtual"}
            </p>
          </div>
        </div>
      </div>

      {/* Assinatura */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--ink)]">Assinatura</h2>
          <Link
            href="/planos"
            className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors"
          >
            Ver planos
          </Link>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-[var(--line)]">
            <span className="text-sm text-[var(--ink-2)]">Plano</span>
            <span className="text-sm font-medium text-[var(--ink)]">
              {assistente?.plano ? planoNome[assistente.plano] : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[var(--line)]">
            <span className="text-sm text-[var(--ink-2)]">Status</span>
            <span className="text-sm font-medium text-[var(--ink)]">
              {assistente?.status_assinatura ? statusNome[assistente.status_assinatura] : "—"}
            </span>
          </div>
          {assistente?.status_assinatura === "trial" && trialTermina && (
            <div className="flex items-center justify-between py-2 border-b border-[var(--line)]">
              <span className="text-sm text-[var(--ink-2)]">Período gratuito termina em</span>
              <span className="text-sm text-amber-600 font-medium">{trialTermina}</span>
            </div>
          )}
          {assistente?.stripe_customer_id && (
            <div className="pt-1">
              <PortalButtonClient />
            </div>
          )}
        </div>
      </div>

      {/* Conta */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-6">
        <h2 className="text-sm font-semibold text-[var(--ink)] mb-4">Conta</h2>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-red-600 hover:text-red-700 transition-colors">
            Sair da conta
          </button>
        </form>
      </div>
    </div>
  );
}
