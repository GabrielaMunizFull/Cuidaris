import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Plus, Pencil } from "lucide-react";
import { DesativarConvenioForm } from "./_components/desativar-convenio-form";

export const metadata: Metadata = { title: "Convênios — Cuidaris" };

export default async function ConveniosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: prof } = await supabase
    .from("profissionais")
    .select("id")
    .eq("id", id)
    .single();

  if (!prof) notFound();

  const { data: convenios } = await supabase
    .from("convenios")
    .select("id, nome, valor_padrao")
    .eq("profissional_id", id)
    .eq("ativo", true)
    .order("nome");

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[var(--ink)]">Convênios</h1>
          <p className="text-sm text-[var(--ink-2)] mt-0.5">
            {convenios?.length ?? 0} convênio(s) ativo(s)
          </p>
        </div>
        <Link
          href={`/profissionais/${id}/convenios/novo`}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
        >
          <Plus size={15} />
          Novo convênio
        </Link>
      </div>

      {!convenios || convenios.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-12 text-center">
          <p className="text-[var(--ink-2)] mb-4">Nenhum convênio cadastrado ainda.</p>
          <Link
            href={`/profissionais/${id}/convenios/novo`}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            <Plus size={15} />
            Adicionar primeiro convênio
          </Link>
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] divide-y divide-[var(--line)]">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-2.5">
            {["NOME", "VALOR PADRÃO", ""].map((col) => (
              <span key={col} className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">
                {col}
              </span>
            ))}
          </div>
          {convenios.map((c) => (
            <div key={c.id} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-6 py-4">
              <p className="text-sm font-medium text-[var(--ink)]">{c.nome}</p>
              <p className="text-sm text-[var(--ink-2)] tabular-nums">
                {c.valor_padrao
                  ? `R$ ${Number(c.valor_padrao).toFixed(2).replace(".", ",")}`
                  : "—"}
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href={`/profissionais/${id}/convenios/${c.id}/editar`}
                  className="w-8 h-8 flex items-center justify-center rounded-[10px] text-[var(--ink-3)] hover:bg-[var(--bg)] hover:text-[var(--ink)] transition-colors"
                  title="Editar"
                >
                  <Pencil size={14} />
                </Link>
                <DesativarConvenioForm profissionalId={id} convenioId={c.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
