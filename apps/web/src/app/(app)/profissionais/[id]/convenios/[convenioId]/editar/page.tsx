import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@cuidaris/ui";
import { ConvenioForm } from "../../_components/convenio-form";
import { editarConvenioAction } from "../../actions";

export const metadata: Metadata = { title: "Editar convênio — Cuidaris" };

export default async function EditarConvenioPage({
  params,
}: {
  params: Promise<{ id: string; convenioId: string }>;
}) {
  const { id, convenioId } = await params;
  const supabase = await createClient();
  const { data: convenio } = await supabase
    .from("convenios")
    .select("id, nome, valor_padrao")
    .eq("id", convenioId)
    .eq("profissional_id", id)
    .single();

  if (!convenio) notFound();

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--ink)]">Editar convênio</h1>
        <p className="text-sm text-[var(--ink-2)] mt-0.5">{convenio.nome}</p>
      </div>
      <Card>
        <ConvenioForm
          action={editarConvenioAction.bind(null, id, convenioId)}
          defaultValues={{ nome: convenio.nome, valor_padrao: convenio.valor_padrao }}
          submitLabel="Salvar alterações"
        />
      </Card>
    </div>
  );
}
