"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { consultaSchema, atualizarStatusSchema } from "@/lib/validations/consulta";
import type { StatusConsulta } from "@cuidaris/db";

export type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function criarConsultaAction(
  profissionalId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    paciente_id: formData.get("paciente_id") as string,
    data_hora: formData.get("data_hora") as string,
    duracao_minutos: formData.get("duracao_minutos") as string,
    status: formData.get("status") as string,
    observacoes: formData.get("observacoes") as string,
  };

  const parsed = consultaSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  // Verificar sobreposição de horário
  const { data: disponivel } = await supabase.rpc("check_horario_disponivel", {
    p_profissional_id: profissionalId,
    p_data_hora: new Date(parsed.data.data_hora).toISOString(),
    p_duracao_minutos: parsed.data.duracao_minutos,
  });

  if (!disponivel) {
    return { error: "Já existe uma consulta neste horário. Escolha outro." };
  }

  const { error } = await supabase.from("agenda").insert({
    profissional_id: profissionalId,
    assistente_id: user.id,
    paciente_id: parsed.data.paciente_id,
    data_hora: new Date(parsed.data.data_hora).toISOString(),
    duracao_minutos: parsed.data.duracao_minutos,
    status: parsed.data.status,
    observacoes: parsed.data.observacoes || null,
  });

  if (error) return { error: "Erro ao salvar consulta. Tente novamente." };

  revalidatePath(`/profissionais/${profissionalId}/agenda`);
  redirect(`/profissionais/${profissionalId}/agenda?salvo=consulta`);
}

export async function atualizarStatusConsultaAction(
  profissionalId: string,
  consultaId: string,
  status: StatusConsulta
): Promise<ActionResult> {
  const parsed = atualizarStatusSchema.safeParse({ status });
  if (!parsed.success) return { error: "Não foi possível atualizar o status. Tente novamente." };

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
    .from("agenda")
    .update({ status: parsed.data.status })
    .eq("id", consultaId);

  if (error) return { error: "Erro ao atualizar status." };

  revalidatePath(`/profissionais/${profissionalId}/agenda`);
  return {};
}

export async function cancelarConsultaAction(
  profissionalId: string,
  consultaId: string
): Promise<ActionResult> {
  return atualizarStatusConsultaAction(profissionalId, consultaId, "cancelado");
}

export async function editarConsultaAction(
  profissionalId: string,
  consultaId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    paciente_id: formData.get("paciente_id") as string,
    data_hora: formData.get("data_hora") as string,
    duracao_minutos: formData.get("duracao_minutos") as string,
    status: formData.get("status") as string,
    observacoes: formData.get("observacoes") as string,
  };

  const parsed = consultaSchema.safeParse(raw);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

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

  // Verifica sobreposição excluindo a própria consulta
  const { data: disponivel } = await supabase.rpc("check_horario_disponivel", {
    p_profissional_id: profissionalId,
    p_data_hora: new Date(parsed.data.data_hora).toISOString(),
    p_duracao_minutos: parsed.data.duracao_minutos,
    p_excluir_id: consultaId,
  });

  if (!disponivel) {
    return { error: "Já existe uma consulta neste horário. Escolha outro." };
  }

  const { error } = await supabase
    .from("agenda")
    .update({
      paciente_id: parsed.data.paciente_id,
      data_hora: new Date(parsed.data.data_hora).toISOString(),
      duracao_minutos: parsed.data.duracao_minutos,
      status: parsed.data.status,
      observacoes: parsed.data.observacoes || null,
    })
    .eq("id", consultaId);

  if (error) return { error: "Erro ao atualizar consulta. Tente novamente." };

  revalidatePath(`/profissionais/${profissionalId}/agenda`);
  redirect(`/profissionais/${profissionalId}/agenda?salvo=consulta`);
}

export async function excluirConsultaAction(
  profissionalId: string,
  consultaId: string
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
    .from("agenda")
    .delete()
    .eq("id", consultaId);

  if (error) return { error: "Erro ao excluir consulta." };

  revalidatePath(`/profissionais/${profissionalId}/agenda`);
  return {};
}
