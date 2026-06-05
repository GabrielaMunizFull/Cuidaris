import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@cuidaris/ui";
import { PacienteForm } from "../../_components/paciente-form";
import { editarPacienteAction } from "../../actions";

export const metadata: Metadata = {
  title: "Editar paciente — Cuidaris",
};

export default async function EditarPacientePage({
  params,
}: {
  params: Promise<{ id: string; pacienteId: string }>;
}) {
  const { id: profissionalId, pacienteId } = await params;
  const supabase = await createClient();

  const [{ data: paciente }, { data: convenios }] = await Promise.all([
    supabase
      .from("pacientes")
      .select("id, nome, email, telefone, data_nascimento, convenio_id, ativo")
      .eq("id", pacienteId)
      .eq("profissional_id", profissionalId)
      .single(),
    supabase
      .from("convenios")
      .select("id, nome")
      .eq("profissional_id", profissionalId)
      .eq("ativo", true)
      .order("nome"),
  ]);

  if (!paciente || !paciente.ativo) notFound();

  const action = editarPacienteAction.bind(null, profissionalId, pacienteId);

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--ink)]">Editar paciente</h1>
        <p className="text-sm text-[var(--ink-2)] mt-0.5">{paciente.nome}</p>
      </div>
      <Card>
        <PacienteForm
          action={action}
          defaultValues={{
            nome: paciente.nome,
            email: paciente.email,
            telefone: paciente.telefone,
            data_nascimento: paciente.data_nascimento,
            convenio_id: paciente.convenio_id,
          }}
          convenios={convenios ?? []}
          submitLabel="Salvar alterações"
        />
      </Card>
    </div>
  );
}
