"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { profissionalSchema } from "@/lib/validations/profissional";
import { LIMITE_PROFISSIONAIS } from "@cuidaris/db";
import type { PlanoAssinatura } from "@cuidaris/db";

const BUCKET_FOTOS = "fotos";
const MAX_FOTO_BYTES = 3 * 1024 * 1024; // 3 MB

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

  // Verificar tipo de conta e limite do plano antes de inserir
  const { data: assistente } = await supabase
    .from("assistentes")
    .select("plano, status_assinatura, tipo_conta")
    .eq("id", user.id)
    .single();

  // Conta autônoma não pode adicionar profissionais manualmente
  if (assistente?.tipo_conta === "autonomo") {
    return {
      error: "Conta autônoma não suporta cadastro de profissionais adicionais. Faça upgrade para o plano Profissional para gerenciar outros profissionais.",
    };
  }

  const { count } = await supabase
    .from("profissionais")
    .select("id", { count: "exact", head: true })
    .eq("assistente_id", user.id)
    .eq("ativo", true);

  const plano = (assistente?.plano ?? "essencial") as PlanoAssinatura;
  const limite = LIMITE_PROFISSIONAIS[plano];

  if ((count ?? 0) >= limite) {
    const nomes: Record<string, string> = { essencial: "Essencial", profissional: "Profissional", clinica: "Clínica" };
    const limiteTexto = limite === Infinity ? "ilimitados" : String(limite);
    return {
      error: `Você atingiu o limite de ${limiteTexto} profissional(is) do plano ${nomes[plano] ?? plano}. Faça upgrade para adicionar mais. Acesse /planos para ver as opções.`,
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
  redirect("/profissionais?salvo=profissional");
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  const { data: prof } = await supabase
    .from("profissionais")
    .select("id")
    .eq("id", id)
    .eq("assistente_id", user.id)
    .single();
  if (!prof) return { error: "Não autorizado." };

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
  redirect(`/profissionais/${id}/agenda?salvo=profissional`);
}

export async function uploadFotoAction(
  profissionalId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const foto = formData.get("foto") as File | null;
  if (!foto || foto.size === 0) return { fieldErrors: { foto: ["Selecione uma imagem."] } };
  if (foto.size > MAX_FOTO_BYTES) return { fieldErrors: { foto: ["A imagem deve ter no máximo 3 MB."] } };
  if (!foto.type.startsWith("image/")) return { fieldErrors: { foto: ["Envie apenas imagens (JPG, PNG, WebP)."] } };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  const { data: prof } = await supabase
    .from("profissionais")
    .select("id")
    .eq("id", profissionalId)
    .eq("assistente_id", user.id)
    .single();
  if (!prof) return { error: "Não autorizado." };

  const ext = foto.name.split(".").pop() ?? "jpg";
  const storagePath = `profissionais/${profissionalId}/foto.${ext}`;
  const buffer = Buffer.from(await foto.arrayBuffer());

  const { error: uploadError } = await getSupabaseAdmin().storage
    .from(BUCKET_FOTOS)
    .upload(storagePath, buffer, { contentType: foto.type, upsert: true });

  if (uploadError) return { error: "Erro ao enviar a imagem. Tente novamente." };

  const { data: { publicUrl } } = getSupabaseAdmin().storage
    .from(BUCKET_FOTOS)
    .getPublicUrl(storagePath);

  // Adiciona cache-buster para forçar recarga da imagem no browser
  const fotoUrl = `${publicUrl}?t=${Date.now()}`;

  const { error: dbError } = await supabase
    .from("profissionais")
    .update({ foto_url: fotoUrl })
    .eq("id", profissionalId);

  if (dbError) return { error: "Erro ao salvar a foto. Tente novamente." };

  revalidatePath(`/profissionais/${profissionalId}`);
  revalidatePath("/dashboard");
  return { success: true } as ActionResult & { success: boolean };
}

export async function desativarProfissionalAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  const { data: prof } = await supabase
    .from("profissionais")
    .select("id")
    .eq("id", id)
    .eq("assistente_id", user.id)
    .single();
  if (!prof) return { error: "Não autorizado." };

  const { error } = await supabase
    .from("profissionais")
    .update({ ativo: false })
    .eq("id", id);

  if (error) return { error: "Erro ao desativar profissional." };

  revalidatePath("/profissionais");
  redirect("/profissionais");
}
