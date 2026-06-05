import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Avatar, Badge } from "@cuidaris/ui";
import { Phone, Mail, Pencil, Calendar, DollarSign } from "lucide-react";
import { format, differenceInYears } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DesativarPacienteForm } from "./_components/desativar-paciente-form";

export const metadata: Metadata = {
  title: "Perfil do paciente — Cuidaris",
};

const statusConsultaLabel: Record<string, string> = {
  confirmado: "Confirmado",
  pendente: "Pendente",
  cancelado: "Cancelado",
  remarcado: "Remarcado",
};

const statusLancamentoLabel: Record<string, string> = {
  pago: "Pago",
  pendente: "Pendente",
  atrasado: "Atrasado",
};

export default async function PerfilPacientePage({
  params,
}: {
  params: Promise<{ id: string; pacienteId: string }>;
}) {
  const { id: profissionalId, pacienteId } = await params;
  const supabase = await createClient();

  const [{ data: paciente }, { data: consultas }, { data: lancamentos }] =
    await Promise.all([
      supabase
        .from("pacientes")
        .select("id, nome, email, telefone, data_nascimento, convenio_id, ativo")
        .eq("id", pacienteId)
        .eq("profissional_id", profissionalId)
        .single(),
      supabase
        .from("agenda")
        .select("id, data_hora, duracao_minutos, status, observacoes")
        .eq("paciente_id", pacienteId)
        .eq("profissional_id", profissionalId)
        .order("data_hora", { ascending: false })
        .limit(20),
      supabase
        .from("lancamentos")
        .select("id, descricao, valor, data, status")
        .eq("paciente_id", pacienteId)
        .eq("profissional_id", profissionalId)
        .order("data", { ascending: false })
        .limit(20),
    ]);

  if (!paciente || !paciente.ativo) notFound();

  const idade = paciente.data_nascimento
    ? differenceInYears(new Date(), new Date(paciente.data_nascimento))
    : null;

  return (
    <div className="max-w-2xl space-y-6 mx-auto">
      {/* Header */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-6">
        <div className="flex items-start gap-4">
          <Avatar name={paciente.nome} size="lg" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-[var(--ink)]">{paciente.nome}</h1>
            <p className="text-sm text-[var(--ink-3)] mt-0.5">
              {idade !== null ? `${idade} anos` : "Idade não informada"}
              {paciente.data_nascimento &&
                ` · ${format(new Date(paciente.data_nascimento + "T12:00:00"), "d/MM/yyyy")}`}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-3">
              {paciente.telefone && (
                <a
                  href={`tel:${paciente.telefone}`}
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-2)] hover:text-[var(--accent)] transition-colors"
                >
                  <Phone size={14} />
                  {paciente.telefone}
                </a>
              )}
              {paciente.email && (
                <a
                  href={`mailto:${paciente.email}`}
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-2)] hover:text-[var(--accent)] transition-colors"
                >
                  <Mail size={14} />
                  {paciente.email}
                </a>
              )}
            </div>
          </div>

          <Link
            href={`/profissionais/${profissionalId}/pacientes/${pacienteId}/editar`}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[10px] text-sm text-[var(--ink-2)] border border-[var(--line)] hover:bg-[var(--bg)] transition-colors"
          >
            <Pencil size={14} />
            Editar
          </Link>
        </div>
      </div>

      {/* Consultas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--ink)] flex items-center gap-2">
            <Calendar size={15} className="text-[var(--ink-3)]" />
            Consultas
          </h2>
          <Link
            href={`/profissionais/${profissionalId}/agenda/nova?paciente=${pacienteId}`}
            className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors"
          >
            + Nova consulta
          </Link>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] divide-y divide-[var(--line)]">
          {!consultas || consultas.length === 0 ? (
            <p className="px-6 py-8 text-sm text-[var(--ink-3)] text-center">
              Nenhuma consulta registrada.
            </p>
          ) : (
            consultas.map((c) => (
              <div key={c.id} className="flex items-center gap-4 px-6 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--ink)]">
                    {format(new Date(c.data_hora), "d 'de' MMMM, HH:mm", { locale: ptBR })}
                  </p>
                  {c.observacoes && (
                    <p className="text-xs text-[var(--ink-3)] mt-0.5 truncate">{c.observacoes}</p>
                  )}
                </div>
                <Badge variant={c.status as "confirmado" | "pendente" | "cancelado" | "remarcado"}>
                  {statusConsultaLabel[c.status] ?? c.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Financeiro */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--ink)] flex items-center gap-2">
            <DollarSign size={15} className="text-[var(--ink-3)]" />
            Financeiro
          </h2>
          <Link
            href={`/profissionais/${profissionalId}/financeiro/novo?paciente=${pacienteId}`}
            className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors"
          >
            + Novo lançamento
          </Link>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] divide-y divide-[var(--line)]">
          {!lancamentos || lancamentos.length === 0 ? (
            <p className="px-6 py-8 text-sm text-[var(--ink-3)] text-center">
              Nenhum lançamento registrado.
            </p>
          ) : (
            lancamentos.map((l) => (
              <div key={l.id} className="flex items-center gap-4 px-6 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--ink)] truncate">{l.descricao}</p>
                  <p className="text-xs text-[var(--ink-3)] mt-0.5">
                    {format(new Date(l.data + "T12:00:00"), "d/MM/yyyy")}
                  </p>
                </div>
                <p className="text-sm font-semibold text-[var(--ink)] tabular-nums">
                  R$ {l.valor.toFixed(2).replace(".", ",")}
                </p>
                <Badge variant={l.status as "pago" | "pendente" | "atrasado"}>
                  {statusLancamentoLabel[l.status] ?? l.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Zona de perigo */}
      <div className="pt-2 border-t border-[var(--line)]">
        <DesativarPacienteForm
          profissionalId={profissionalId}
          pacienteId={pacienteId}
          pacienteNome={paciente.nome}
        />
      </div>
    </div>
  );
}
