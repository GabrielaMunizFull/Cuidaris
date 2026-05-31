import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail obrigatório")
    .email("E-mail inválido"),
  password: z
    .string()
    .min(1, "Senha obrigatória"),
});

export const signupSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(80, "Nome muito longo"),
  email: z
    .string()
    .min(1, "E-mail obrigatório")
    .email("E-mail inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string().min(1, "Confirme a senha"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
