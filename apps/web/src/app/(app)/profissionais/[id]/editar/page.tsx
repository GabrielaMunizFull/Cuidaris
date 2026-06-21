import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@cuidaris/ui";
import { ProfissionalForm } from "../../_components/profissional-form";
import { FotoUploadForm } from "../../_components/foto-upload-form";
import { editarProfissionalAction, uploadFotoAction } from "../../actions";

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
    .select("id, nome, especialidade, registro, email, telefone, foto_url")
    .eq("id", id)
    .single();

  if (!prof) notFound();

  const action = editarProfissionalAction.bind(null, id);
  const fotoAction = uploadFotoAction.bind(null, id);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--ink)]">Editar profissional</h1>
        <p className="text-sm text-[var(--ink-2)] mt-0.5">{prof.nome}</p>
      </div>

      {/* Foto */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-5">
        <p className="text-sm font-semibold text-[var(--ink)] mb-4">Foto de perfil</p>
        <FotoUploadForm
          action={fotoAction}
          nomeProfissional={prof.nome}
          fotoAtual={prof.foto_url}
        />
      </div>

      {/* Dados */}
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
