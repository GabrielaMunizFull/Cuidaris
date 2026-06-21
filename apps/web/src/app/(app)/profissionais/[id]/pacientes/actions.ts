"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { pacienteSchema } from "@/lib/validations/paciente";

export type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function criarPacienteAction(
  profissionalId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    nome: formData.get("nome") as string,
    email: formData.get("email") as string,
    telefone: formData.get("telefone") as string,
    data_nascimento: formData.get("data_nascimento") as string,
    convenio_id: formData.get("convenio_id") as string,
  };

  const parsed = pacienteSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  const { error } = await supabase.from("pacientes").insert({
    profissional_id: profissionalId,
    assistente_id: user.id,
    nome: parsed.data.nome,
    email: parsed.data.email || null,
    telefone: parsed.data.telefone || null,
    data_nascimento: parsed.data.data_nascimento || null,
    convenio_id: parsed.data.convenio_id || null,
  });

  if (error) return { error: "Erro ao salvar paciente. Tente novamente." };

  revalidatePath(`/profissionais/${profissionalId}/pacientes`);
  revalidateTag(`profissional-${profissionalId}`);
  redirect(`/profissionais/${profissionalId}/pacientes`);
}

export async function editarPacienteAction(
  profissionalId: string,
  pacienteId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    nome: formData.get("nome") as string,
    email: formData.get("email") as string,
    telefone: formData.get("telefone") as string,
    data_nascimento: formData.get("data_nascimento") as string,
    convenio_id: formData.get("convenio_id") as string,
  };

  const parsed = pacienteSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

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

  const { error } = await supabase
    .from("pacientes")
    .update({
      nome: parsed.data.nome,
      email: parsed.data.email || null,
      telefone: parsed.data.telefone || null,
      data_nascimento: parsed.data.data_nascimento || null,
      convenio_id: parsed.data.convenio_id || null,
    })
    .eq("id", pacienteId);

  if (error) return { error: "Erro ao atualizar paciente." };

  revalidatePath(`/profissionais/${profissionalId}/pacientes`);
  redirect(`/profissionais/${profissionalId}/pacientes/${pacienteId}`);
}

export async function desativarPacienteAction(
  profissionalId: string,
  pacienteId: string
): Promise<ActionResult> {
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

  const { error } = await supabase
    .from("pacientes")
    .update({ ativo: false })
    .eq("id", pacienteId);

  if (error) return { error: "Erro ao desativar paciente." };

  revalidatePath(`/profissionais/${profissionalId}/pacientes`);
  revalidateTag(`profissional-${profissionalId}`);
  redirect(`/profissionais/${profissionalId}/pacientes`);
}
