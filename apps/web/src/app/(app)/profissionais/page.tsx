import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Avatar, Badge } from "@cuidaris/ui";
import { Plus } from "lucide-react";
import { FlashBanner } from "@/components/flash-banner";

export const metadata: Metadata = {
  title: "Profissionais — Cuidaris",
};

export default async function ProfissionaisPage() {
  const supabase = await createClient();

  const { data: profissionais } = await supabase
    .from("profissionais")
    .select("id, nome, especialidade, registro, email, telefone, foto_url, ativo")
    .order("nome");

  const ativos = profissionais?.filter((p) => p.ativo) ?? [];
  const inativos = profissionais?.filter((p) => !p.ativo) ?? [];

  return (
    <div className="max-w-3xl mx-auto">
      <Suspense fallback={null}><FlashBanner /></Suspense>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[var(--ink)]">Profissionais</h1>
          <p className="text-sm text-[var(--ink-2)] mt-0.5">{ativos.length} ativo(s)</p>
        </div>
        <Link
          href="/profissionais/novo"
          className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
        >
          <Plus size={16} />
          Novo profissional
        </Link>
      </div>

      {ativos.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-12 text-center">
          <p className="text-sm font-medium text-[var(--ink)] mb-1">Boas-vindas ao Cuidaris!</p>
          <p className="text-sm text-[var(--ink-3)] mb-5">Comece adicionando o primeiro profissional que você gerencia.</p>
          <Link
            href="/profissionais/novo"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            <Plus size={16} />
            Adicionar profissional
          </Link>
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] divide-y divide-[var(--line)]">
          {ativos.map((prof) => (
            <Link
              key={prof.id}
              href={`/profissionais/${prof.id}/agenda`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--bg)] transition-colors"
            >
              <Avatar name={prof.nome} src={prof.foto_url} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--ink)]">{prof.nome}</p>
                <p className="text-xs text-[var(--ink-3)] mt-0.5">{prof.especialidade}</p>
              </div>
              {prof.registro && (
                <span className="text-xs text-[var(--ink-3)]">{prof.registro}</span>
              )}
              <Badge variant="confirmado">Ativo</Badge>
            </Link>
          ))}
        </div>
      )}

      {inativos.length > 0 && (
        <details className="mt-6">
          <summary className="cursor-pointer text-sm text-[var(--ink-3)] hover:text-[var(--ink-2)]">
            {inativos.length} profissional(is) inativo(s)
          </summary>
          <div className="mt-3 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] divide-y divide-[var(--line)] opacity-60">
            {inativos.map((prof) => (
              <div key={prof.id} className="flex items-center gap-4 px-6 py-4">
                <Avatar name={prof.nome} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--ink)]">{prof.nome}</p>
                  <p className="text-xs text-[var(--ink-3)]">{prof.especialidade}</p>
                </div>
                <Badge variant="cancelado">Inativo</Badge>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
