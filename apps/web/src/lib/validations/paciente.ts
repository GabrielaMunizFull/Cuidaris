import { z } from "zod";

export const pacienteSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório").max(100),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  telefone: z.string().max(20).optional().or(z.literal("")),
  data_nascimento: z.string().optional().or(z.literal("")),
  convenio_id: z.string().uuid().optional().or(z.literal("")),
});

export type PacienteInput = z.infer<typeof pacienteSchema>;
