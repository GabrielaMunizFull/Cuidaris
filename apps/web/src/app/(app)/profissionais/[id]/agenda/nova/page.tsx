import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@cuidaris/ui";
import { NovaConsultaForm } from "../_components/nova-consulta-form";
import { criarConsultaAction } from "../actions";

export const metadata: Metadata = {
  title: "Nova consulta — Cuidaris",
};

export default async function NovaConsultaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: prof } = await supabase
    .from("profissionais")
    .select("id, nome")
    .eq("id", id)
    .single();

  if (!prof) notFound();

  const { data: pacientes } = await supabase
    .from("pacientes")
    .select("id, nome")
    .eq("profissional_id", id)
    .eq("ativo", true)
    .order("nome");

  const action = criarConsultaAction.bind(null, id);

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--ink)]">Nova consulta</h1>
        <p className="text-sm text-[var(--ink-2)] mt-0.5">{prof.nome}</p>
      </div>
      <Card>
        <NovaConsultaForm
          action={action}
          pacientes={pacientes ?? []}
          profissionalId={id}
        />
      </Card>
    </div>
  );
}
