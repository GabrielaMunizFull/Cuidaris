import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Preencha o e-mail para continuar")
    .email("Digite um e-mail válido, como nome@exemplo.com"),
  password: z
    .string()
    .min(1, "Preencha a senha para continuar"),
});

export const signupSchema = z.object({
  nome: z
    .string()
    .min(2, "Preencha seu nome completo")
    .max(80, "Nome muito longo"),
  email: z
    .string()
    .min(1, "Preencha o e-mail para continuar")
    .email("Digite um e-mail válido, como nome@exemplo.com"),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string().min(1, "Confirme a senha para continuar"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem. Verifique e tente novamente.",
  path: ["confirmPassword"],
});

const baseSignupSchema = signupSchema;

export const signupAssistenteSchema = baseSignupSchema.extend({
  tipo_conta: z.literal("assistente"),
});

export const signupAutonomoSchema = baseSignupSchema.extend({
  tipo_conta: z.literal("autonomo"),
  especialidade: z.string().min(2, "Informe sua especialidade").max(80),
  registro: z.string().max(30).optional(),
  telefone: z.string().max(20).optional(),
});

export const signupComTipoSchema = z.discriminatedUnion("tipo_conta", [
  signupAssistenteSchema,
  signupAutonomoSchema,
]);

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type SignupComTipoInput = z.infer<typeof signupComTipoSchema>;
