import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@cuidaris/ui";
import { ProfissionalForm } from "../../_components/profissional-form";
import { editarProfissionalAction } from "../../actions";

export const metadata: Metadata = {
  title: "Editar profissional — Cuidaris",
};

export default async function EditarProfissionalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: prof } = await supabase
    .from("profissionais")
    .select("id, nome, especialidade, registro, email, telefone")
    .eq("id", id)
    .single();

  if (!prof) notFound();

  const action = editarProfissionalAction.bind(null, id);

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--ink)]">Editar profissional</h1>
        <p className="text-sm text-[var(--ink-2)] mt-0.5">{prof.nome}</p>
      </div>
      <Card>
        <ProfissionalForm
          action={action}
          defaultValues={prof}
          submitLabel="Salvar alterações"
        />
      </Card>
    </div>
  );
}
