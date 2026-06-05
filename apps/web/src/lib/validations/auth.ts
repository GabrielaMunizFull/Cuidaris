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

// Campos base — sem .refine() para poder usar com discriminatedUnion
const signupBaseFields = z.object({
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
});

// Schema original mantido para compatibilidade com o fluxo sem tipo_conta
export const signupSchema = signupBaseFields.refine(
  (d) => d.password === d.confirmPassword,
  { message: "As senhas não coincidem. Verifique e tente novamente.", path: ["confirmPassword"] }
);

// discriminatedUnion exige ZodObject puro (sem .refine())
// A validação de senha iguais fica por conta da action
export const signupAssistenteSchema = signupBaseFields.extend({
  tipo_conta: z.literal("assistente"),
});

export const signupAutonomoSchema = signupBaseFields.extend({
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
