import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DocumentoUploadForm } from "../_components/documento-upload-form";
import { uploadDocumentoAction } from "../actions";

export const metadata: Metadata = { title: "Novo documento — Cuidaris" };

export default async function NovoDocumentoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ paciente?: string }>;
}) {
  const { id } = await params;
  const { paciente: pacienteIdInicial } = await searchParams;
  const supabase = await createClient();

  const { data: prof } = await supabase
    .from("profissionais")
    .select("id")
    .eq("id", id)
    .single();

  if (!prof) notFound();

  const { data: pacientes } = await supabase
    .from("pacientes")
    .select("id, nome")
    .eq("profissional_id", id)
    .eq("ativo", true)
    .order("nome");

  const action = uploadDocumentoAction.bind(null, id);

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--ink)]">Novo documento</h1>
        <p className="text-sm text-[var(--ink-2)] mt-0.5">
          Anexe um arquivo ao prontuário do paciente.
        </p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-6">
        <DocumentoUploadForm
          action={action}
          pacientes={pacientes ?? []}
          pacienteIdInicial={pacienteIdInicial}
        />
      </div>
    </div>
  );
}
