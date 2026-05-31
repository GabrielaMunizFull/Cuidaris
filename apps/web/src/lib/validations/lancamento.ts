import { z } from "zod";

export const lancamentoSchema = z.object({
  descricao: z.string().min(2, "Descrição obrigatória").max(200),
  valor: z.coerce.number().positive("Valor deve ser maior que zero"),
  data: z.string().min(1, "Data obrigatória"),
  forma_pagamento: z.enum([
    "dinheiro",
    "pix",
    "cartao_credito",
    "cartao_debito",
    "transferencia",
    "convenio",
  ]),
  status: z.enum(["pago", "pendente", "atrasado"]).default("pendente"),
  paciente_id: z.string().uuid().optional().or(z.literal("")),
  consulta_id: z.string().uuid().optional().or(z.literal("")),
});

export type LancamentoInput = z.infer<typeof lancamentoSchema>;
