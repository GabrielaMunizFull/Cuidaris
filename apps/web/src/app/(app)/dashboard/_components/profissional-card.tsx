import Link from "next/link";
import { Avatar } from "@cuidaris/ui";

interface ProfissionalCardProps {
  id: string;
  nome: string;
  especialidade: string;
  registro?: string | null;
  fotoUrl?: string | null;
  consultasHoje: number;
  totalPacientes: number;
  inadimplentes: number;
}

export function ProfissionalCard({
  id,
  nome,
  especialidade,
  registro,
  fotoUrl,
  consultasHoje,
  totalPacientes,
  inadimplentes,
}: ProfissionalCardProps) {
  return (
    <Link
      href={`/profissionais/${id}/agenda`}
      className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-5 flex flex-col gap-4 shadow-[var(--shadow-sm)] hover:border-emerald-300 hover:shadow-[var(--shadow)] transition-all"
    >
      <div className="flex items-center gap-3">
        <Avatar name={nome} src={fotoUrl} size="lg" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--ink)] truncate">{nome}</p>
          <p className="text-xs text-[var(--ink-3)] truncate mt-0.5">
            {especialidade}
            {registro ? ` · ${registro}` : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[var(--line)]">
        <div className="text-center">
          <p className="text-lg font-bold tabular-nums text-[var(--ink)]">{consultasHoje}</p>
          <p className="text-xs text-[var(--ink-3)] mt-0.5">hoje</p>
        </div>
        <div className="text-center border-x border-[var(--line)]">
          <p className="text-lg font-bold tabular-nums text-[var(--ink)]">{totalPacientes}</p>
          <p className="text-xs text-[var(--ink-3)] mt-0.5">pacientes</p>
        </div>
        <div className="text-center">
          <p className={`text-lg font-bold tabular-nums ${inadimplentes > 0 ? "text-red-600" : "text-[var(--ink)]"}`}>
            {inadimplentes}
          </p>
          <p className="text-xs text-[var(--ink-3)] mt-0.5">inadimpl.</p>
        </div>
      </div>
    </Link>
  );
}
