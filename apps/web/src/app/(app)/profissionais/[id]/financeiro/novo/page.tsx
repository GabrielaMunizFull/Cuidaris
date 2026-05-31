import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@cuidaris/ui";
import { LancamentoForm } from "../_components/lancamento-form";
import { criarLancamentoAction } from "../actions";

export const metadata: Metadata = {
  title: "Novo lançamento — Cuidaris",
};

export default async function NovoLancamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: prof } = await supabase
    .from("profissionais")
    .select("nome")
    .eq("id", id)
    .single();

  if (!prof) notFound();

  const { data: pacientes } = await supabase
    .from("pacientes")
    .select("id, nome")
    .eq("profissional_id", id)
    .eq("ativo", true)
    .order("nome");

  const action = criarLancamentoAction.bind(null, id);

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--ink)]">Novo lançamento</h1>
        <p className="text-sm text-[var(--ink-2)] mt-0.5">{prof.nome}</p>
      </div>
      <Card>
        <LancamentoForm action={action} pacientes={pacientes ?? []} />
      </Card>
    </div>
  );
}
