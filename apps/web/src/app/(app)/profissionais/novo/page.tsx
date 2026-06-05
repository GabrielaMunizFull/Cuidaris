import type { Metadata } from "next";
import { Card } from "@cuidaris/ui";
import { ProfissionalForm } from "../_components/profissional-form";
import { criarProfissionalAction } from "../actions";

export const metadata: Metadata = {
  title: "Novo profissional — Cuidaris",
};

export default function NovoProfissionalPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--ink)]">Novo profissional</h1>
        <p className="text-sm text-[var(--ink-2)] mt-0.5">
          Preencha os dados do profissional que você gerencia
        </p>
      </div>
      <Card>
        <ProfissionalForm action={criarProfissionalAction} submitLabel="Adicionar profissional" />
      </Card>
    </div>
  );
}
