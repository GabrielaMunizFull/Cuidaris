"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const convenioSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(80),
  valor_padrao: z.string().optional().transform((v) => {
    if (!v || v.trim() === "") return null;
    const num = parseFloat(v.replace(",", "."));
    return isNaN(num) ? null : num;
  }),
});

export async function criarConvenioAction(
  profissionalId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = convenioSchema.safeParse({
    nome: formData.get("nome"),
    valor_padrao: formData.get("valor_padrao"),
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  const { error } = await supabase.from("convenios").insert({
    profissional_id: profissionalId,
    assistente_id: user.id,
    nome: parsed.data.nome,
    valor_padrao: parsed.data.valor_padrao,
  });

  if (error) return { error: "Erro ao salvar convênio. Tente novamente." };

  revalidatePath(`/profissionais/${profissionalId}/convenios`);
  redirect(`/profissionais/${profissionalId}/convenios`);
}

export async function editarConvenioAction(
  profissionalId: string,
  convenioId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = convenioSchema.safeParse({
    nome: formData.get("nome"),
    valor_padrao: formData.get("valor_padrao"),
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase
    .from("convenios")
    .update({ nome: parsed.data.nome, valor_padrao: parsed.data.valor_padrao })
    .eq("id", convenioId);

  if (error) return { error: "Erro ao atualizar convênio." };

  revalidatePath(`/profissionais/${profissionalId}/convenios`);
  redirect(`/profissionais/${profissionalId}/convenios`);
}

export async function desativarConvenioAction(
  profissionalId: string,
  convenioId: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("convenios")
    .update({ ativo: false })
    .eq("id", convenioId);

  if (error) return { error: "Erro ao desativar convênio." };

  revalidatePath(`/profissionais/${profissionalId}/convenios`);
  redirect(`/profissionais/${profissionalId}/convenios`);
}
