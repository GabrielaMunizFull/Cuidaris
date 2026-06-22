import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { Plus, FileText, Image, FileQuestion } from "lucide-react";
import { DeletarDocumentoForm } from "./_components/deletar-documento-form";

export const metadata: Metadata = { title: "Documentos — Cuidaris" };

const TIPO_LABEL: Record<string, string> = {
  prontuario: "Prontuário",
  exame: "Exame",
  receita: "Receita",
  atestado: "Atestado",
  outro: "Outro",
};

const TIPO_CORES: Record<string, string> = {
  prontuario: "bg-blue-50 text-blue-700",
  exame: "bg-purple-50 text-purple-700",
  receita: "bg-emerald-50 text-emerald-700",
  atestado: "bg-amber-50 text-amber-700",
  outro: "bg-[var(--bg)] text-[var(--ink-3)]",
};

function FileIcon({ mime }: { mime: string | null }) {
  if (mime?.startsWith("image/")) return <Image size={16} className="text-[var(--ink-3)]" />;
  if (mime === "application/pdf") return <FileText size={16} className="text-[var(--ink-3)]" />;
  return <FileQuestion size={16} className="text-[var(--ink-3)]" />;
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function DocumentosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: prof } = await supabase
    .from("profissionais")
    .select("id")
    .eq("id", id)
    .single();

  if (!prof) notFound();

  const { data: docs } = await supabase
    .from("documentos_pacientes")
    .select("id, titulo, tipo, storage_path, nome_arquivo, tamanho_bytes, mime_type, created_at, paciente:pacientes(id, nome)")
    .eq("profissional_id", id)
    .order("created_at", { ascending: false });

  // Gera URLs assinadas (1h) para download
  const docsComUrl = await Promise.all(
    (docs ?? []).map(async (doc) => {
      const { data } = await getSupabaseAdmin().storage
        .from("documentos")
        .createSignedUrl(doc.storage_path, 3600);
      return { ...doc, url: data?.signedUrl ?? null };
    })
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[var(--ink)]">Documentos</h1>
          <p className="text-sm text-[var(--ink-2)] mt-0.5">
            {docsComUrl.length} documento(s)
          </p>
        </div>
        <Link
          href={`/profissionais/${id}/documentos/novo`}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
        >
          <Plus size={15} />
          Novo documento
        </Link>
      </div>

      {docsComUrl.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-12 text-center">
          <div className="w-10 h-10 rounded-[10px] bg-[var(--bg)] flex items-center justify-center mx-auto mb-3">
            <FileText size={18} className="text-[var(--ink-3)]" />
          </div>
          <p className="text-sm text-[var(--ink-2)] mb-4">
            Nenhum documento anexado ainda.
          </p>
          <Link
            href={`/profissionais/${id}/documentos/novo`}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            <Plus size={15} />
            Adicionar primeiro documento
          </Link>
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] divide-y divide-[var(--line)]">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-2.5">
            {["", "DOCUMENTO", "PACIENTE", "TIPO", ""].map((col, i) => (
              <span key={i} className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">
                {col}
              </span>
            ))}
          </div>

          {docsComUrl.map((doc) => {
            const paciente = doc.paciente as unknown as { id: string; nome: string } | null;
            return (
              <div
                key={doc.id}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-6 py-4"
              >
                <div className="w-9 h-9 rounded-[10px] bg-[var(--bg)] flex items-center justify-center">
                  <FileIcon mime={doc.mime_type} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--ink)] truncate">{doc.titulo}</p>
                  <p className="text-xs text-[var(--ink-3)]">
                    {formatData(doc.created_at)}
                    {doc.tamanho_bytes ? ` · ${formatBytes(doc.tamanho_bytes)}` : ""}
                  </p>
                </div>

                <p className="text-sm text-[var(--ink-2)] whitespace-nowrap">
                  {paciente?.nome ?? "—"}
                </p>

                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${TIPO_CORES[doc.tipo] ?? TIPO_CORES.outro}`}
                >
                  {TIPO_LABEL[doc.tipo] ?? doc.tipo}
                </span>

                <div className="flex items-center gap-1">
                  {doc.url ? (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={doc.nome_arquivo}
                      className="w-8 h-8 flex items-center justify-center rounded-[10px] text-[var(--ink-3)] hover:bg-[var(--bg)] hover:text-[var(--ink)] transition-colors"
                      title="Baixar"
                    >
                      <FileText size={14} />
                    </a>
                  ) : null}
                  <DeletarDocumentoForm profissionalId={id} documentoId={doc.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
