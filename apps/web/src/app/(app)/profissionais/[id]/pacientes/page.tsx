import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@cuidaris/ui";
import { Plus, Phone, Mail } from "lucide-react";
import { format, differenceInYears } from "date-fns";
import { ptBR } from "date-fns/locale";

export const metadata: Metadata = {
  title: "Pacientes — Cuidaris",
};

export default async function PacientesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: prof } = await supabase
    .from("profissionais")
    .select("id, nome")
    .eq("id", id)
    .single();

  if (!prof) notFound();

  const { data: pacientes } = await supabase
    .from("pacientes")
    .select("id, nome, email, telefone, data_nascimento, ativo")
    .eq("profissional_id", id)
    .eq("ativo", true)
    .order("nome");

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[var(--ink)]">Pacientes</h1>
          <p className="text-sm text-[var(--ink-2)] mt-0.5">
            {pacientes?.length ?? 0} paciente(s) ativo(s)
          </p>
        </div>
        <Link
          href={`/profissionais/${id}/pacientes/novo`}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
        >
          <Plus size={16} />
          Novo paciente
        </Link>
      </div>

      {!pacientes || pacientes.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-12 text-center">
          <p className="text-[var(--ink-2)] mb-4">
            Nenhum paciente cadastrado para {prof.nome}.
          </p>
          <Link
            href={`/profissionais/${id}/pacientes/novo`}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            <Plus size={16} />
            Adicionar primeiro paciente
          </Link>
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] divide-y divide-[var(--line)]">
          {pacientes.map((paciente) => {
            const idade = paciente.data_nascimento
              ? differenceInYears(new Date(), new Date(paciente.data_nascimento))
              : null;

            return (
              <Link
                key={paciente.id}
                href={`/profissionais/${id}/pacientes/${paciente.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--bg)] transition-colors"
              >
                <Avatar name={paciente.nome} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--ink)]">{paciente.nome}</p>
                  <p className="text-xs text-[var(--ink-3)] mt-0.5">
                    {idade !== null ? `${idade} anos` : "Idade não informada"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {paciente.telefone && (
                    <span className="flex items-center gap-1 text-xs text-[var(--ink-3)]">
                      <Phone size={12} />
                      {paciente.telefone}
                    </span>
                  )}
                  {paciente.email && (
                    <span className="flex items-center gap-1 text-xs text-[var(--ink-3)]">
                      <Mail size={12} />
                      {paciente.email}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
