"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { lancamentoSchema } from "@/lib/validations/lancamento";
import type { StatusLancamento } from "@cuidaris/db";

export type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function criarLancamentoAction(
  profissionalId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    descricao: formData.get("descricao") as string,
    valor: formData.get("valor") as string,
    data: formData.get("data") as string,
    forma_pagamento: formData.get("forma_pagamento") as string,
    status: formData.get("status") as string,
    paciente_id: formData.get("paciente_id") as string,
    consulta_id: formData.get("consulta_id") as string,
  };

  const parsed = lancamentoSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  const { error } = await supabase.from("lancamentos").insert({
    profissional_id: profissionalId,
    assistente_id: user.id,
    descricao: parsed.data.descricao,
    valor: parsed.data.valor,
    data: parsed.data.data,
    forma_pagamento: parsed.data.forma_pagamento,
    status: parsed.data.status,
    paciente_id: parsed.data.paciente_id || null,
    consulta_id: parsed.data.consulta_id || null,
  });

  if (error) return { error: "Erro ao salvar lançamento." };

  revalidatePath(`/profissionais/${profissionalId}/financeiro`);
  redirect(`/profissionais/${profissionalId}/financeiro`);
}

export async function atualizarStatusLancamentoAction(
  profissionalId: string,
  lancamentoId: string,
  status: StatusLancamento
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("lancamentos")
    .update({ status })
    .eq("id", lancamentoId);

  if (error) return { error: "Erro ao atualizar status." };

  revalidatePath(`/profissionais/${profissionalId}/financeiro`);
  return {};
}
