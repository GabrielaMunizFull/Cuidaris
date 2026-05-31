import type { Metadata } from "next";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Entrar — Cuidaris",
};

export default function LoginPage() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--ink)]">Bem-vinda de volta</h1>
        <p className="mt-1 text-sm text-[var(--ink-2)]">
          Entre na sua conta para continuar
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
