import type { Metadata } from "next";
import { CuidarisLogo } from "@/components/cuidaris-logo";
import { SignupForm } from "./_components/signup-form";

export const metadata: Metadata = {
  title: "Criar conta — Cuidaris",
};

export default function CadastroPage() {
  return (
    <div className="space-y-8">
      <div className="hidden lg:block">
        <CuidarisLogo size="md" variant="dark" />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">
          Crie sua conta
        </h1>
        <p className="mt-1.5 text-sm text-[var(--ink-2)]">
          14 dias grátis, sem cartão de crédito.
        </p>
      </div>

      <SignupForm />
    </div>
  );
}
