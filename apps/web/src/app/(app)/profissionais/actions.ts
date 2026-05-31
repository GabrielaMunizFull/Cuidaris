"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { profissionalSchema } from "@/lib/validations/profissional";
import { LIMITE_PROFISSIONAIS } from "@cuidaris/db";
import type { PlanoAssinatura } from "@cuidaris/db";

export type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function criarProfissionalAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    nome: formData.get("nome") as string,
    especialidade: formData.get("especialidade") as string,
    registro: formData.get("registro") as string,
    email: formData.get("email") as string,
    telefone: formData.get("telefone") as string,
  };

  const parsed = profissionalSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  // Verificar limite do plano antes de inserir
  const { data: assistente } = await supabase
    .from("assistentes")
    .select("plano, status_assinatura")
    .eq("id", user.id)
    .single();

  const { count } = await supabase
    .from("profissionais")
    .select("id", { count: "exact", head: true })
    .eq("assistente_id", user.id)
    .eq("ativo", true);

  const plano = (assistente?.plano ?? "essencial") as PlanoAssinatura;
  const limite = LIMITE_PROFISSIONAIS[plano];

  if ((count ?? 0) >= limite) {
    return {
      error: `Seu plano ${plano} permite até ${limite === Infinity ? "ilimitados" : limite} profissional(is). Faça upgrade para adicionar mais.`,
    };
  }

  const { error } = await supabase.from("profissionais").insert({
    assistente_id: user.id,
    nome: parsed.data.nome,
    especialidade: parsed.data.especialidade,
    registro: parsed.data.registro || null,
    email: parsed.data.email || null,
    telefone: parsed.data.telefone || null,
  });

  if (error) return { error: "Erro ao salvar profissional. Tente novamente." };

  revalidatePath("/profissionais");
  redirect("/profissionais");
}

export async function editarProfissionalAction(
  id: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    nome: formData.get("nome") as string,
    especialidade: formData.get("especialidade") as string,
    registro: formData.get("registro") as string,
    email: formData.get("email") as string,
    telefone: formData.get("telefone") as string,
  };

  const parsed = profissionalSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profissionais")
    .update({
      nome: parsed.data.nome,
      especialidade: parsed.data.especialidade,
      registro: parsed.data.registro || null,
      email: parsed.data.email || null,
      telefone: parsed.data.telefone || null,
    })
    .eq("id", id);

  if (error) return { error: "Erro ao atualizar profissional." };

  revalidatePath("/profissionais");
  revalidatePath(`/profissionais/${id}`);
  redirect(`/profissionais/${id}/agenda`);
}

export async function desativarProfissionalAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profissionais")
    .update({ ativo: false })
    .eq("id", id);

  if (error) return { error: "Erro ao desativar profissional." };

  revalidatePath("/profissionais");
  redirect("/profissionais");
}
