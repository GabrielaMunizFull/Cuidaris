import { z } from "zod";

export const anotacaoSchema = z.object({
  conteudo: z
    .string()
    .min(1, "A anotação não pode estar vazia.")
    .max(5000, "Anotação muito longa (máx. 5000 caracteres)."),
});

export type AnotacaoInput = z.infer<typeof anotacaoSchema>;
