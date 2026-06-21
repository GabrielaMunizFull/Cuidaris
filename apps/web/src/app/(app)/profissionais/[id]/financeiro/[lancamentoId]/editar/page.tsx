import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@cuidaris/ui";
import { LancamentoForm } from "../../_components/lancamento-form";
import { editarLancamentoAction } from "../../actions";

export const metadata: Metadata = {
  title: "Editar lançamento — Cuidaris",
};

export default async function EditarLancamentoPage({
  params,
}: {
  params: Promise<{ id: string; lancamentoId: string }>;
}) {
  const { id: profissionalId, lancamentoId } = await params;
  const supabase = await createClient();

  const [{ data: lanc }, { data: pacientes }] = await Promise.all([
    supabase
      .from("lancamentos")
      .select("id, descricao, valor, data, forma_pagamento, status, paciente_id")
      .eq("id", lancamentoId)
      .eq("profissional_id", profissionalId)
      .single(),
    supabase
      .from("pacientes")
      .select("id, nome")
      .eq("profissional_id", profissionalId)
      .eq("ativo", true)
      .order("nome"),
  ]);

  if (!lanc) notFound();

  const action = editarLancamentoAction.bind(null, profissionalId, lancamentoId);

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--ink)]">Editar lançamento</h1>
        <p className="text-sm text-[var(--ink-2)] mt-0.5">{lanc.descricao}</p>
      </div>
      <Card>
        <LancamentoForm
          action={action}
          pacientes={pacientes ?? []}
          defaultValues={{
            descricao: lanc.descricao,
            valor: lanc.valor,
            data: lanc.data,
            forma_pagamento: lanc.forma_pagamento,
            status: lanc.status,
            paciente_id: lanc.paciente_id,
          }}
          submitLabel="Salvar alterações"
        />
      </Card>
    </div>
  );
}
