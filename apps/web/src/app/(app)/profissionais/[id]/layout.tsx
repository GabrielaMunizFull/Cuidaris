import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@cuidaris/ui";
import { Phone } from "lucide-react";
import { ProfissionalTabs } from "./_components/profissional-tabs";
import { NovoPacienteModal } from "./_components/novo-paciente-modal";
import { criarPacienteAction } from "./pacientes/actions";

export default async function ProfissionalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: prof }, { count: totalPacientes }, { data: convenios }] = await Promise.all([
    supabase
      .from("profissionais")
      .select("id, nome, especialidade, registro, telefone, foto_url")
      .eq("id", id)
      .eq("ativo", true)
      .single(),
    supabase
      .from("pacientes")
      .select("id", { count: "exact", head: true })
      .eq("profissional_id", id)
      .eq("ativo", true),
    supabase
      .from("convenios")
      .select("id, nome")
      .eq("profissional_id", id)
      .eq("ativo", true)
      .order("nome"),
  ]);

  if (!prof) notFound();

  return (
    <div>
      {/* Cabeçalho do profissional */}
      <div className="bg-[var(--surface)] border border-[var(--line)] border-b-0 rounded-t-[var(--radius)] px-6 py-5">
        <div className="flex items-center gap-4">
          <Avatar name={prof.nome} src={prof.foto_url ?? undefined} size="lg" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-[var(--ink)] tracking-tight">{prof.nome}</h1>
            <p className="text-sm text-[var(--ink-3)] mt-0.5">
              {prof.especialidade}
              {prof.registro && ` · ${prof.registro}`}
              {totalPacientes !== null && ` · ${totalPacientes} pacientes`}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {prof.telefone && (
              <a
                href={`tel:${prof.telefone}`}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[var(--radius)] border border-[var(--line)] text-sm text-[var(--ink-2)] hover:bg-[var(--bg)] transition-colors"
              >
                <Phone size={14} />
                Contato
              </a>
            )}
            <NovoPacienteModal
              profissionalNome={prof.nome}
              action={criarPacienteAction.bind(null, id)}
              convenios={convenios ?? []}
            />
          </div>
        </div>
      </div>

      {/* Abas */}
      <ProfissionalTabs profissionalId={id} totalPacientes={totalPacientes ?? 0} />

      {/* Conteúdo */}
      <div className="mt-6">{children}</div>
    </div>
  );
}
