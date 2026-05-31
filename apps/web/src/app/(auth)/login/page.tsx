import type { Metadata } from "next";
import { CuidarisLogo } from "@/components/cuidaris-logo";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Entrar — Cuidaris",
};

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="hidden lg:block">
        <CuidarisLogo size="md" variant="dark" />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">
          Entrar na sua conta
        </h1>
        <p className="mt-1.5 text-sm text-[var(--ink-2)]">
          Bem-vinda de volta! Acesse o painel da secretaria.
        </p>
      </div>

      <LoginForm />
    </div>
  );
}
