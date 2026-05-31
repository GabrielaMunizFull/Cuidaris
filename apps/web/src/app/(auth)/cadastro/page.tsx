import type { Metadata } from "next";
import { SignupForm } from "./_components/signup-form";

export const metadata: Metadata = {
  title: "Criar conta — Cuidaris",
};

export default function CadastroPage() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--ink)]">Crie sua conta</h1>
        <p className="mt-1 text-sm text-[var(--ink-2)]">
          14 dias grátis, sem cartão de crédito
        </p>
      </div>
      <SignupForm />
    </div>
  );
}
