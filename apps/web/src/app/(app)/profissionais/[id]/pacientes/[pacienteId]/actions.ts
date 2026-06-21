"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface AnotacaoResult {
  error?: string;
  anotacao?: {
    id: string;
    conteudo: string;
    created_at: string;
    updated_at: string;
  };
}

export async function criarAnotacaoAction(
  profissionalId: string,
  pacienteId: string,
  { conteudo }: { conteudo: string }
): Promise<AnotacaoResult> {
  if (!conteudo.trim()) return { error: "A anotação não pode estar vazia." };
  if (conteudo.length > 5000) return { error: "Anotação muito longa (máx. 5000 caracteres)." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  const { data, error } = await supabase
    .from("anotacoes_pacientes")
    .insert({
      profissional_id: profissionalId,
      assistente_id: user.id,
      paciente_id: pacienteId,
      conteudo: conteudo.trim(),
    })
    .select("id, conteudo, created_at, updated_at")
    .single();

  if (error) return { error: "Erro ao salvar anotação. Tente novamente." };

  revalidatePath(`/profissionais/${profissionalId}/pacientes/${pacienteId}`);
  return { anotacao: data };
}

export async function excluirAnotacaoAction(
  profissionalId: string,
  pacienteId: string,
  anotacaoId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("anotacoes_pacientes")
    .delete()
    .eq("id", anotacaoId);

  if (error) return { error: "Erro ao excluir anotação." };

  revalidatePath(`/profissionais/${profissionalId}/pacientes/${pacienteId}`);
  return {};
}
