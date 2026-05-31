"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/lib/validations/auth";

export type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function loginAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "E-mail ou senha incorretos." };
    }
    return { error: "Erro ao fazer login. Tente novamente." };
  }

  redirect("/dashboard");
}

export async function signupAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    nome: formData.get("nome") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { nome: parsed.data.nome },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Este e-mail já está cadastrado." };
    }
    return { error: "Erro ao criar conta. Tente novamente." };
  }

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function esqueceuSenhaAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult & { success?: boolean }> {
  const email = (formData.get("email") as string)?.trim();

  if (!email || !email.includes("@")) {
    return { fieldErrors: { email: ["E-mail inválido"] } };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/redefinir-senha`,
  });

  if (error) return { error: "Erro ao enviar e-mail. Tente novamente." };

  return { success: true };
}

export async function redefinirSenhaAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || password.length < 8) {
    return { fieldErrors: { password: ["Senha deve ter pelo menos 8 caracteres"] } };
  }
  if (password !== confirmPassword) {
    return { fieldErrors: { confirmPassword: ["As senhas não coincidem"] } };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: "Erro ao redefinir senha. O link pode ter expirado." };

  redirect("/dashboard");
}
