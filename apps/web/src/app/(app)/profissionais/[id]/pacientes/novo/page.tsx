import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@cuidaris/ui";
import { PacienteForm } from "../_components/paciente-form";
import { criarPacienteAction } from "../actions";

export const metadata: Metadata = {
  title: "Novo paciente — Cuidaris",
};

export default async function NovoPacientePage({
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

  const action = criarPacienteAction.bind(null, id);

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--ink)]">Novo paciente</h1>
        <p className="text-sm text-[var(--ink-2)] mt-0.5">{prof.nome}</p>
      </div>
      <Card>
        <PacienteForm action={action} submitLabel="Adicionar paciente" />
      </Card>
    </div>
  );
}
