import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PacientesLista, type PacienteEnriquecido } from "./_components/pacientes-lista";

export const metadata: Metadata = { title: "Pacientes — Cuidaris" };

export default async function PacientesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: prof } = await supabase.from("profissionais").select("id, nome").eq("id", id).single();
  if (!prof) notFound();

  const { data: pacientes } = await supabase
    .from("pacientes")
    .select("id, nome, telefone, data_nascimento, convenio_id")
    .eq("profissional_id", id)
    .eq("ativo", true)
    .order("nome");

  if (!pacientes || pacientes.length === 0) {
    return <PacientesLista pacientes={[]} profissionalId={id} profissionalNome={prof.nome} />;
  }

  const pacienteIds = pacientes.map((p) => p.id);

  const [{ data: consultas }, { data: lancamentos }, { data: convenios }] = await Promise.all([
    supabase
      .from("agenda")
      .select("paciente_id, data_hora")
      .eq("profissional_id", id)
      .in("paciente_id", pacienteIds)
      .order("data_hora", { ascending: false }),
    supabase
      .from("lancamentos")
      .select("paciente_id, status")
      .eq("profissional_id", id)
      .in("paciente_id", pacienteIds),
    supabase
      .from("convenios")
      .select("id, nome")
      .eq("profissional_id", id)
      .eq("ativo", true),
  ]);

  const convenioMap = new Map((convenios ?? []).map((c) => [c.id, c.nome]));

  const ultimaVisitaMap = new Map<string, string>();
  for (const c of consultas ?? []) {
    if (!ultimaVisitaMap.has(c.paciente_id)) ultimaVisitaMap.set(c.paciente_id, c.data_hora);
  }

  const statusMap = new Map<string, "ativo" | "pendente" | "inadimplente">();
  for (const l of lancamentos ?? []) {
    const atual = statusMap.get(l.paciente_id);
    if (l.status === "atrasado") statusMap.set(l.paciente_id, "inadimplente");
    else if (l.status === "pendente" && atual !== "inadimplente") statusMap.set(l.paciente_id, "pendente");
    else if (!atual) statusMap.set(l.paciente_id, "ativo");
  }

  const pacientesEnriquecidos: PacienteEnriquecido[] = pacientes.map((p) => ({
    id: p.id,
    nome: p.nome,
    telefone: p.telefone,
    data_nascimento: p.data_nascimento,
    ultima_visita: ultimaVisitaMap.get(p.id) ?? null,
    status: statusMap.get(p.id) ?? "ativo",
    convenio_nome: p.convenio_id ? (convenioMap.get(p.convenio_id) ?? null) : null,
  }));

  return <PacientesLista pacientes={pacientesEnriquecidos} profissionalId={id} profissionalNome={prof.nome} />;
}
