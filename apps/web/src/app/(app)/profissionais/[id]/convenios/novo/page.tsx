import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@cuidaris/ui";
import { ConvenioForm } from "../_components/convenio-form";
import { criarConvenioAction } from "../actions";

export const metadata: Metadata = { title: "Novo convênio — Cuidaris" };

export default async function NovoConvenioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: prof } = await supabase.from("profissionais").select("nome").eq("id", id).single();
  if (!prof) notFound();

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--ink)]">Novo convênio</h1>
        <p className="text-sm text-[var(--ink-2)] mt-0.5">{prof.nome}</p>
      </div>
      <Card>
        <ConvenioForm action={criarConvenioAction.bind(null, id)} submitLabel="Adicionar convênio" />
      </Card>
    </div>
  );
}
