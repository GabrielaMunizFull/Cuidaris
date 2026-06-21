import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { addDays, format, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, AlertTriangle, DollarSign, Clock, Plus, TrendingUp } from "lucide-react";
import { StatCard } from "./_components/stat-card";
import { ProfissionalCard } from "./_components/profissional-card";
import { DashboardAutonomo } from "./_components/dashboard-autonomo";
import { OnboardingChecklist } from "./_components/onboarding-checklist";

export const metadata: Metadata = {
  title: "Dashboard — Cuidaris",
};

function saudacao(nome: string): string {
  const hora = new Date().getHours();
  const primeiroNome = nome.split(" ")[0] ?? nome;
  if (hora < 12) return `Bom dia, ${primeiroNome}! 👋`;
  if (hora < 18) return `Boa tarde, ${primeiroNome}! 👋`;
  return `Boa noite, ${primeiroNome}! 👋`;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ novo?: string }>;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: assistente } = await supabase
    .from("assistentes")
    .select("nome, tipo_conta")
    .eq("id", user?.id ?? "")
    .single();

  // Autônomo no primeiro acesso vai direto para a agenda
  if (assistente?.tipo_conta === "autonomo") {
    const params = await searchParams;
    if (params?.novo === "1") {
      const { data: profissionais } = await supabase
        .from("profissionais")
        .select("id")
        .eq("ativo", true)
        .limit(1);
      if (profissionais?.[0]) {
        redirect(`/profissionais/${profissionais[0].id}/agenda`);
      }
    }

    const { data: profissionais } = await supabase
      .from("profissionais")
      .select("id")
      .eq("ativo", true)
      .limit(1);

    if (profissionais?.[0]) {
      return (
        <DashboardAutonomo
          profissionalId={profissionais[0].id}
          saudacao={saudacao(assistente?.nome ?? "por aqui")}
        />
      );
    }
  }

  const agora = new Date();
  const inicioHoje = startOfDay(agora).toISOString();
  const fimHoje = endOfDay(agora).toISOString();
  const inicioOntem = startOfDay(addDays(agora, -1)).toISOString();
  const fimOntem = endOfDay(addDays(agora, -1)).toISOString();
  const fimSemana = endOfDay(addDays(agora, 7)).toISOString();
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1).toISOString().slice(0, 10);
  const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0).toISOString().slice(0, 10);

  const [
    { data: consultasHoje },
    { data: consultasOntem },
    { data: profissionais },
    { data: pacientesList },
    { data: inadimplentesDetail },
    { data: proximasConsultas },
    { data: pendencias },
    { data: lancamentosMes },
    { data: algumLancamento },
  ] = await Promise.all([
    supabase.from("agenda").select("id, data_hora, status, profissional_id, paciente:pacientes(nome), profissional:profissionais(nome)").gte("data_hora", inicioHoje).lte("data_hora", fimHoje).order("data_hora"),
    supabase.from("agenda").select("id").gte("data_hora", inicioOntem).lte("data_hora", fimOntem),
    supabase.from("profissionais").select("id, nome, especialidade, registro, foto_url").eq("ativo", true).order("nome"),
    supabase.from("pacientes").select("profissional_id").eq("ativo", true),
    supabase.from("lancamentos").select("profissional_id, valor, paciente:pacientes(nome), profissional:profissionais(id, nome)").eq("status", "atrasado").order("created_at", { ascending: false }).limit(8),
    supabase.from("agenda").select("id, data_hora, status, paciente:pacientes(nome), profissional:profissionais(nome)").gt("data_hora", fimHoje).lte("data_hora", fimSemana).order("data_hora").limit(5),
    supabase.from("agenda").select("id, data_hora, profissional_id, paciente:pacientes(nome), profissional:profissionais(nome)").gte("data_hora", inicioHoje).lte("data_hora", fimSemana).eq("status", "pendente").order("data_hora").limit(5),
    supabase.from("lancamentos").select("valor, status").gte("data", inicioMes).lte("data", fimMes),
    supabase.from("lancamentos").select("id").limit(1),
  ]);

  // Agrega por profissional_id em memória (evita N+1)
  const consultasHojeMap = new Map<string, number>();
  for (const c of consultasHoje ?? []) {
    consultasHojeMap.set(c.profissional_id, (consultasHojeMap.get(c.profissional_id) ?? 0) + 1);
  }
  const pacientesMap = new Map<string, number>();
  for (const p of pacientesList ?? []) {
    pacientesMap.set(p.profissional_id, (pacientesMap.get(p.profissional_id) ?? 0) + 1);
  }
  const inadimplentesMap = new Map<string, number>();
  for (const i of inadimplentesDetail ?? []) {
    inadimplentesMap.set(i.profissional_id, (inadimplentesMap.get(i.profissional_id) ?? 0) + 1);
  }

  const totalConsultasHoje = consultasHoje?.length ?? 0;
  const totalOntem = consultasOntem?.length ?? 0;
  const diffOntem = totalConsultasHoje - totalOntem;
  const trendHoje = diffOntem === 0 ? undefined : diffOntem > 0 ? `↗ +${diffOntem} vs ontem` : `↘ ${diffOntem} vs ontem`;

  const totalPendencias = pendencias?.length ?? 0;
  const totalInadimplentes = inadimplentesDetail?.length ?? 0;
  const totalProximos = proximasConsultas?.length ?? 0;
  const totalProfissionais = profissionais?.length ?? 0;
  const totalPacientes = pacientesList?.length ?? 0;

  const recebidoMes = (lancamentosMes ?? [])
    .filter((l) => l.status === "pago")
    .reduce((s, l) => s + l.valor, 0);
  const recebidoMesLabel = `R$ ${recebidoMes.toFixed(2).replace(".", ",")}`;
  const mesFaturamento = format(agora, "MMM", { locale: ptBR });

  const statusColors: Record<string, string> = {
    confirmado: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pendente: "bg-amber-50 text-amber-700 border-amber-200",
    cancelado: "bg-red-50 text-red-700 border-red-200",
    remarcado: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const statusLabels: Record<string, string> = {
    confirmado: "Confirmado",
    pendente: "Pendente",
    cancelado: "Cancelado",
    remarcado: "Remarcado",
  };

  return (
    <div className="max-w-6xl space-y-8 mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">
            {saudacao(assistente?.nome ?? "por aqui")}
          </h1>
          <p className="text-sm text-[var(--ink-2)] mt-1">
            Você gerencia{" "}
            <span className="font-medium text-[var(--ink)]">
              {totalProfissionais} profissional{totalProfissionais !== 1 ? "is" : ""}
            </span>
            {" · "}
            <span className="font-medium text-[var(--ink)]">
              {totalPacientes} paciente{totalPacientes !== 1 ? "s" : ""} ativo{totalPacientes !== 1 ? "s" : ""}
            </span>
          </p>
        </div>
        <Link
          href="/profissionais/novo"
          className="shrink-0 inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
        >
          <Plus size={15} />
          Novo profissional
        </Link>
      </div>

      {/* Onboarding checklist — some quando tudo estiver feito */}
      <OnboardingChecklist
        temProfissional={(profissionais?.length ?? 0) > 0}
        temPaciente={(pacientesList?.length ?? 0) > 0}
        temConsulta={(consultasHoje?.length ?? 0) > 0 || (proximasConsultas?.length ?? 0) > 0}
        temLancamento={(algumLancamento?.length ?? 0) > 0}
        primeiroProfissionalId={profissionais?.[0]?.id}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Calendar} label="Consultas hoje" value={totalConsultasHoje} trend={trendHoje} />
        <StatCard icon={Clock} label="Próximos 7 dias" value={totalProximos} />
        <StatCard icon={AlertTriangle} label="Pendências" value={totalPendencias} highlight={totalPendencias > 0 ? "amber" : undefined} />
        <StatCard icon={DollarSign} label="Inadimplentes" value={totalInadimplentes} highlight={totalInadimplentes > 0 ? "red" : undefined} />
        <StatCard icon={TrendingUp} label={`Recebido em ${mesFaturamento}`} value={recebidoMesLabel} highlight="green" />
      </div>

      {/* Grid de profissionais */}
      <section>
        <h2 className="text-base font-semibold text-[var(--ink)] mb-4">Profissionais</h2>
        {!profissionais || profissionais.length === 0 ? (
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-12 text-center">
            <p className="text-base font-semibold text-[var(--ink)] mb-1">Boas-vindas ao Cuidaris!</p>
            <p className="text-sm text-[var(--ink-2)] mb-5">
              Comece adicionando o primeiro profissional que você gerencia.
            </p>
            <Link
              href="/profissionais/novo"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
            >
              <Plus size={15} />
              Adicionar profissional
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profissionais.map((prof) => (
              <ProfissionalCard
                key={prof.id}
                id={prof.id}
                nome={prof.nome}
                especialidade={prof.especialidade}
                registro={prof.registro}
                fotoUrl={prof.foto_url}
                consultasHoje={consultasHojeMap.get(prof.id) ?? 0}
                totalPacientes={pacientesMap.get(prof.id) ?? 0}
                inadimplentes={inadimplentesMap.get(prof.id) ?? 0}
              />
            ))}
          </div>
        )}
      </section>

      {/* Linha inferior: consultas hoje + pendências + inadimplência */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consultas de hoje */}
        <section>
          <h2 className="text-base font-semibold text-[var(--ink)] mb-4">Consultas de hoje</h2>
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)]">
            {!consultasHoje || consultasHoje.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm font-medium text-[var(--ink-2)]">Dia livre hoje</p>
                <p className="text-xs text-[var(--ink-3)] mt-1">Nenhuma sessão agendada para hoje.</p>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--line)]">
                {consultasHoje.map((c) => (
                  <li key={c.id} className="px-5 py-3.5 flex items-center gap-3">
                    <span className="text-sm font-medium text-[var(--ink-2)] tabular-nums w-11 shrink-0">
                      {format(new Date(c.data_hora), "HH:mm")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--ink)] truncate">
                        {(c.paciente as unknown as { nome: string } | null)?.nome ?? "—"}
                      </p>
                      <p className="text-xs text-[var(--ink-3)] truncate">
                        {(c.profissional as unknown as { nome: string } | null)?.nome ?? "—"}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded border ${statusColors[c.status] ?? ""}`}>
                      {statusLabels[c.status] ?? c.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Pendências da semana */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[var(--ink)]">Pendências da semana</h2>
            {totalPendencias > 0 && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                {totalPendencias} {totalPendencias === 1 ? "aberta" : "abertas"}
              </span>
            )}
          </div>
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)]">
            {!pendencias || pendencias.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm font-medium text-[var(--ink-2)]">Nenhuma pendência</p>
                <p className="text-xs text-[var(--ink-3)] mt-1">
                  Todas as sessões desta semana estão confirmadas.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--line)]">
                {pendencias.map((p) => (
                  <li key={p.id} className="px-5 py-3.5 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--ink)] truncate">
                        {(p.paciente as unknown as { nome: string } | null)?.nome ?? "—"}
                      </p>
                      <p className="text-xs text-[var(--ink-3)] truncate">
                        {(p.profissional as unknown as { nome: string } | null)?.nome ?? "—"}
                        {" · "}
                        {format(new Date(p.data_hora), "EEE d/MM 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <Link
                      href={`/profissionais/${p.profissional_id}/agenda`}
                      className="shrink-0 text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                    >
                      Resolver
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        {/* Inadimplência */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[var(--ink)]">Inadimplência</h2>
            {totalInadimplentes > 0 && (
              <span className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                {totalInadimplentes} {totalInadimplentes === 1 ? "em atraso" : "em atraso"}
              </span>
            )}
          </div>
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)]">
            {!inadimplentesDetail || inadimplentesDetail.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm font-medium text-[var(--ink-2)]">Sem inadimplência</p>
                <p className="text-xs text-[var(--ink-3)] mt-1">
                  Nenhum lançamento em atraso no momento.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--line)]">
                {inadimplentesDetail.map((l, i) => {
                  const prof = l.profissional as unknown as { id: string; nome: string } | null;
                  const paciente = l.paciente as unknown as { nome: string } | null;
                  return (
                    <li key={i} className="px-5 py-3.5 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--ink)] truncate">
                          {paciente?.nome ?? "—"}
                        </p>
                        <p className="text-xs text-[var(--ink-3)] truncate">{prof?.nome ?? "—"}</p>
                      </div>
                      <span className="text-sm font-semibold text-red-600 tabular-nums shrink-0">
                        R$ {l.valor.toFixed(2).replace(".", ",")}
                      </span>
                      {prof?.id && (
                        <Link
                          href={`/profissionais/${prof.id}/financeiro`}
                          className="shrink-0 text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                        >
                          Ver
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
