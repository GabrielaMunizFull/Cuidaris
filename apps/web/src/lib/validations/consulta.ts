import { z } from "zod";

export const consultaSchema = z.object({
  paciente_id: z.string().uuid("Selecione um paciente"),
  data_hora: z.string().min(1, "Data e hora obrigatórias"),
  duracao_minutos: z.coerce.number().int().min(10).max(480).default(50),
  status: z.enum(["confirmado", "pendente", "cancelado", "remarcado"]).default("pendente"),
  observacoes: z.string().max(500).optional().or(z.literal("")),
});

export const atualizarStatusSchema = z.object({
  status: z.enum(["confirmado", "pendente", "cancelado", "remarcado"]),
});

export type ConsultaInput = z.infer<typeof consultaSchema>;
