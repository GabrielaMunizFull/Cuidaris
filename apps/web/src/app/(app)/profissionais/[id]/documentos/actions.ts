"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/stripe";
import { z } from "zod";

export type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const BUCKET = "documentos";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const uploadSchema = z.object({
  titulo: z.string().min(1, "Preencha o título do documento").max(120),
  tipo: z.enum(["prontuario", "exame", "receita", "atestado", "outro"]),
  paciente_id: z.string().uuid("Selecione um paciente"),
});

export async function uploadDocumentoAction(
  profissionalId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = uploadSchema.safeParse({
    titulo: formData.get("titulo"),
    tipo: formData.get("tipo"),
    paciente_id: formData.get("paciente_id"),
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const arquivo = formData.get("arquivo") as File | null;
  if (!arquivo || arquivo.size === 0) return { fieldErrors: { arquivo: ["Selecione um arquivo."] } };
  if (arquivo.size > MAX_BYTES) return { fieldErrors: { arquivo: ["O arquivo deve ter no máximo 10 MB."] } };

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

  const ext = arquivo.name.split(".").pop() ?? "bin";
  const storagePath = `${user.id}/${profissionalId}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await arquivo.arrayBuffer());

  const { error: storageError } = await getSupabaseAdmin().storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType: arquivo.type, upsert: false });

  if (storageError) return { error: "Erro ao enviar o arquivo. Tente novamente." };

  const { error: dbError } = await getSupabaseAdmin().from("documentos_pacientes").insert({
    profissional_id: profissionalId,
    assistente_id: user.id,
    paciente_id: parsed.data.paciente_id,
    titulo: parsed.data.titulo,
    tipo: parsed.data.tipo,
    storage_path: storagePath,
    nome_arquivo: arquivo.name,
    tamanho_bytes: arquivo.size,
    mime_type: arquivo.type || null,
  });

  if (dbError) {
    await getSupabaseAdmin().storage.from(BUCKET).remove([storagePath]);
    return { error: "Erro ao salvar documento. Tente novamente." };
  }

  revalidatePath(`/profissionais/${profissionalId}/documentos`);
  redirect(`/profissionais/${profissionalId}/documentos`);
}

export async function deletarDocumentoAction(
  profissionalId: string,
  documentoId: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  const { data: doc } = await supabase
    .from("documentos_pacientes")
    .select("storage_path")
    .eq("id", documentoId)
    .eq("assistente_id", user.id)
    .single();

  if (!doc) return { error: "Documento não encontrado." };

  await getSupabaseAdmin().storage.from(BUCKET).remove([doc.storage_path]);

  const { error } = await supabase
    .from("documentos_pacientes")
    .delete()
    .eq("id", documentoId);

  if (error) return { error: "Erro ao remover documento." };

  revalidatePath(`/profissionais/${profissionalId}/documentos`);
  redirect(`/profissionais/${profissionalId}/documentos`);
}
