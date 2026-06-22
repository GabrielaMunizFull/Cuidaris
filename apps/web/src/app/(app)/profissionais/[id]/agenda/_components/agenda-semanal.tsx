"use client";

import { useState } from "react";
import Link from "next/link";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { Badge } from "@cuidaris/ui";
import type { Consulta, StatusConsulta } from "@cuidaris/db";
import { atualizarStatusConsultaAction } from "../actions";
import { ExcluirConsultaForm } from "./excluir-consulta-form";

interface AgendaSemanalProps {
  consultas: (Consulta & { paciente: { id: string; nome: string } | null })[];
  profissionalId: string;
}

const statusLabels: Record<StatusConsulta, string> = {
  confirmado: "Confirmado",
  pendente: "Pendente",
  cancelado: "Cancelado",
  remarcado: "Remarcado",
};

export function AgendaSemanal({ consultas, profissionalId }: AgendaSemanalProps) {
  const [semanaBase, setSemanaBase] = useState(new Date());
  const [atualizando, setAtualizando] = useState<string | null>(null);

  const inicioSemana = startOfWeek(semanaBase, { weekStartsOn: 1 });
  const diasSemana = Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i));

  const consultasDoDia = (dia: Date) =>
    consultas
      .filter((c) => isSameDay(new Date(c.data_hora), dia))
      .sort((a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime());

  async function mudarStatus(consultaId: string, novoStatus: StatusConsulta) {
    setAtualizando(consultaId);
    await atualizarStatusConsultaAction(profissionalId, consultaId, novoStatus);
    setAtualizando(null);
  }

  return (
    <div>
      {/* Controles de semana */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setSemanaBase((d) => addDays(d, -7))}
          className="p-1.5 rounded-[10px] hover:bg-[var(--line)] transition-colors"
          aria-label="Semana anterior"
        >
          <ChevronLeft size={18} className="text-[var(--ink-2)]" />
        </button>
        <span className="text-sm font-medium text-[var(--ink)] capitalize">
          {format(inicioSemana, "d 'de' MMMM", { locale: ptBR })} -{" "}
          {format(addDays(inicioSemana, 6), "d 'de' MMMM yyyy", { locale: ptBR })}
        </span>
        <button
          onClick={() => setSemanaBase((d) => addDays(d, 7))}
          className="p-1.5 rounded-[10px] hover:bg-[var(--line)] transition-colors"
          aria-label="Próxima semana"
        >
          <ChevronRight size={18} className="text-[var(--ink-2)]" />
        </button>
        <button
          onClick={() => setSemanaBase(new Date())}
          className="ml-auto text-xs text-[var(--accent)] hover:underline"
        >
          Hoje
        </button>
      </div>

      {/* Grade semanal */}
      <div className="grid grid-cols-7 gap-2">
        {diasSemana.map((dia) => {
          const isHoje = isSameDay(dia, new Date());
          const consultasDia = consultasDoDia(dia);

          return (
            <div key={dia.toISOString()} className="flex flex-col gap-1.5">
              {/* Cabeçalho do dia */}
              <div className="text-center">
                <p className="text-xs text-[var(--ink-3)] uppercase tracking-wide">
                  {format(dia, "EEE", { locale: ptBR })}
                </p>
                <p
                  className={[
                    "text-sm font-semibold mt-0.5 w-7 h-7 rounded-full flex items-center justify-center mx-auto",
                    isHoje
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--ink)]",
                  ].join(" ")}
                >
                  {format(dia, "d")}
                </p>
              </div>

              {/* Consultas */}
              <div className="flex flex-col gap-1.5 min-h-[120px]">
                {consultasDia.length === 0 ? (
                  <div className="rounded-[10px] border border-dashed border-[var(--line)] h-20 flex flex-col items-center justify-center gap-0.5">
                    <span className="text-xs font-medium text-[var(--ink-3)]">Dia livre</span>
                    <span className="text-[10px] text-[var(--ink-3)]">Nenhuma sessão agendada</span>
                  </div>
                ) : (
                  consultasDia.map((consulta) => (
                    <div
                      key={consulta.id}
                      className="bg-[var(--surface)] border border-[var(--line)] rounded-[10px] p-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--ink)] tabular-nums">
                            {format(new Date(consulta.data_hora), "HH:mm")}
                          </p>
                          <p className="text-[var(--ink-2)] truncate mt-0.5">
                            {consulta.paciente?.nome ?? "—"}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <Link
                            href={`/profissionais/${profissionalId}/agenda/${consulta.id}/editar`}
                            title="Editar consulta"
                            className="p-1 rounded-[6px] text-[var(--ink-3)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors"
                          >
                            <Pencil size={12} />
                          </Link>
                          <ExcluirConsultaForm
                            profissionalId={profissionalId}
                            consultaId={consulta.id}
                          />
                        </div>
                      </div>
                      <div className="mt-1.5">
                        <select
                          value={consulta.status}
                          disabled={atualizando === consulta.id}
                          onChange={(e) =>
                            mudarStatus(consulta.id, e.target.value as StatusConsulta)
                          }
                          className="w-full text-xs rounded-[6px] border border-[var(--line)] bg-[var(--bg)] px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-50"
                        >
                          {Object.entries(statusLabels).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
