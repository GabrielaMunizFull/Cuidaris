import { z } from "zod";

export const profissionalSchema = z.object({
  nome: z.string().min(2, "Preencha o nome do profissional").max(100),
  especialidade: z.string().min(2, "Preencha a especialidade").max(80),
  registro: z.string().max(30).optional().or(z.literal("")),
  email: z.string().email("Digite um e-mail válido, como nome@exemplo.com").optional().or(z.literal("")),
  telefone: z.string().max(20).optional().or(z.literal("")),
});

export type ProfissionalInput = z.infer<typeof profissionalSchema>;
