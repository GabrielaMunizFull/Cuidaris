import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import { startOfWeek, addDays } from "date-fns";
import { AgendaSemanal } from "./_components/agenda-semanal";
import type { Consulta } from "@cuidaris/db";
import { FlashBanner } from "@/components/flash-banner";

export const metadata: Metadata = {
  title: "Agenda — Cuidaris",
};

export default async function AgendaPage({
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

  // Busca consultas das próximas 4 semanas e últimas 2 semanas
  const inicio = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), -14);
  const fim = addDays(inicio, 42);

  const { data: consultas } = await supabase
    .from("agenda")
    .select("id, data_hora, duracao_minutos, status, observacoes, profissional_id, assistente_id, paciente_id, paciente:pacientes(id, nome)")
    .eq("profissional_id", id)
    .gte("data_hora", inicio.toISOString())
    .lte("data_hora", fim.toISOString())
    .order("data_hora");

  return (
    <div>
      <Suspense fallback={null}><FlashBanner /></Suspense>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[var(--ink)]">Agenda</h1>
          <p className="text-sm text-[var(--ink-2)] mt-0.5">{prof.nome}</p>
        </div>
        <Link
          href={`/profissionais/${id}/agenda/nova`}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
        >
          <Plus size={16} />
          Nova consulta
        </Link>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-6">
        <AgendaSemanal
          consultas={(consultas ?? []) as unknown as (Consulta & { paciente: { id: string; nome: string } | null })[]}
          profissionalId={id}
        />
      </div>
    </div>
  );
}
