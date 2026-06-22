"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupComTipoSchema } from "@/lib/validations/auth";
import { sendBoasVindas } from "@cuidaris/emails";

export type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  emailDuplicado?: boolean;
};

async function getAppUrl(path: string): Promise<string> {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
  }
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}${path}`;
}

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
      return { error: "E-mail ou senha incorretos. Verifique os dados e tente novamente." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada." };
    }
    return { error: "Algo deu errado da nossa parte. Tente novamente em alguns instantes." };
  }

  redirect("/dashboard");
}

export async function signupAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const tipoConta = formData.get("tipo_conta") as string;

  const raw = {
    tipo_conta: tipoConta || "assistente",
    nome: formData.get("nome") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    ...(tipoConta === "autonomo" && {
      especialidade: formData.get("especialidade") as string,
      registro: (formData.get("registro") as string) || undefined,
      telefone: (formData.get("telefone") as string) || undefined,
    }),
  };

  const parsed = signupComTipoSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  if (parsed.data.password !== parsed.data.confirmPassword) {
    return { fieldErrors: { confirmPassword: ["As senhas não coincidem. Verifique e tente novamente."] } };
  }

  const supabase = await createClient();

  const metaData: Record<string, string> = {
    nome: parsed.data.nome,
    tipo_conta: parsed.data.tipo_conta,
  };

  if (parsed.data.tipo_conta === "autonomo") {
    metaData.especialidade = parsed.data.especialidade;
    if (parsed.data.registro) metaData.registro = parsed.data.registro;
    if (parsed.data.telefone) metaData.telefone = parsed.data.telefone;
  }

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: metaData },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { emailDuplicado: true };
    }
    return { error: "Não conseguimos criar sua conta agora. Verifique sua conexão e tente novamente." };
  }

  sendBoasVindas(parsed.data.email, parsed.data.nome).catch(() => {});

  redirect("/dashboard?novo=1");
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
    return { fieldErrors: { email: ["Digite um e-mail válido, como nome@exemplo.com"] } };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: await getAppUrl("/redefinir-senha"),
  });

  if (error) return { error: "Não conseguimos enviar o e-mail agora. Verifique o endereço e tente novamente." };

  return { success: true };
}

export async function redefinirSenhaAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || password.length < 8) {
    return { fieldErrors: { password: ["A senha deve ter pelo menos 8 caracteres"] } };
  }
  if (password !== confirmPassword) {
    return { fieldErrors: { confirmPassword: ["As senhas não coincidem. Verifique e tente novamente."] } };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: "Não conseguimos redefinir sua senha. O link pode ter expirado — solicite um novo." };

  redirect("/dashboard");
}
