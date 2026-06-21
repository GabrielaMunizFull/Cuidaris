import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@cuidaris/ui";
import { NovaConsultaForm } from "../../_components/nova-consulta-form";
import { editarConsultaAction } from "../../actions";

export const metadata: Metadata = {
  title: "Editar consulta — Cuidaris",
};

export default async function EditarConsultaPage({
  params,
}: {
  params: Promise<{ id: string; consultaId: string }>;
}) {
  const { id: profissionalId, consultaId } = await params;
  const supabase = await createClient();

  const [{ data: consulta }, { data: pacientes }] = await Promise.all([
    supabase
      .from("agenda")
      .select("*, paciente:pacientes(id, nome)")
      .eq("id", consultaId)
      .eq("profissional_id", profissionalId)
      .single(),
    supabase
      .from("pacientes")
      .select("id, nome")
      .eq("profissional_id", profissionalId)
      .eq("ativo", true)
      .order("nome"),
  ]);

  if (!consulta) notFound();

  // Formata para o input datetime-local (YYYY-MM-DDTHH:mm)
  const dataHoraLocal = format(new Date(consulta.data_hora), "yyyy-MM-dd'T'HH:mm");

  const action = editarConsultaAction.bind(null, profissionalId, consultaId);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--ink)]">Editar consulta</h1>
        <p className="text-sm text-[var(--ink-2)] mt-0.5">
          {(consulta.paciente as { nome: string } | null)?.nome ?? "Paciente não encontrado"}
        </p>
      </div>

      <Card>
        <NovaConsultaForm
          action={action}
          pacientes={pacientes ?? []}
          profissionalId={profissionalId}
          defaultValues={{
            paciente_id: consulta.paciente_id,
            data_hora: dataHoraLocal,
            duracao_minutos: consulta.duracao_minutos,
            status: consulta.status,
            observacoes: consulta.observacoes,
          }}
          submitLabel="Salvar alterações"
        />
      </Card>
    </div>
  );
}
