"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

const perfilSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(80),
});

export async function editarPerfilAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = perfilSchema.safeParse({ nome: formData.get("nome") });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  const { error } = await supabase
    .from("assistentes")
    .update({ nome: parsed.data.nome })
    .eq("id", user.id);

  if (error) return { error: "Erro ao salvar. Tente novamente." };

  revalidatePath("/configuracoes");
  return { success: true };
}

const senhaSchema = z
  .object({
    senha_atual: z.string().min(1, "Digite a senha atual"),
    nova_senha: z.string().min(8, "A nova senha deve ter pelo menos 8 caracteres"),
    confirmar_senha: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((d) => d.nova_senha === d.confirmar_senha, {
    message: "As senhas não coincidem",
    path: ["confirmar_senha"],
  });

export async function trocarSenhaAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = senhaSchema.safeParse({
    senha_atual: formData.get("senha_atual"),
    nova_senha: formData.get("nova_senha"),
    confirmar_senha: formData.get("confirmar_senha"),
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { error: "Não autorizado." };

  // Verifica senha atual re-autenticando
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.senha_atual,
  });
  if (authError) return { fieldErrors: { senha_atual: ["Senha atual incorreta."] } };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.nova_senha });
  if (error) return { error: "Erro ao atualizar a senha. Tente novamente." };

  return { success: true };
}

export async function toggleLembretesAction(ativo: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  const { error } = await supabase
    .from("assistentes")
    .update({ lembretes_ativos: ativo })
    .eq("id", user.id);

  if (error) return { error: "Erro ao salvar preferência." };

  revalidatePath("/configuracoes");
  return { success: true };
}
