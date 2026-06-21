export type PlanoAssinatura = "solo" | "essencial" | "profissional" | "clinica";
export type TipoConta = "assistente" | "autonomo";
export type StatusAssinatura = "trial" | "ativo" | "cancelado" | "inadimplente";
export type StatusConsulta = "confirmado" | "pendente" | "cancelado" | "remarcado";
export type StatusLancamento = "pago" | "pendente" | "atrasado";
export type FormaPagamento = "dinheiro" | "pix" | "cartao_credito" | "cartao_debito" | "transferencia" | "convenio";

export interface Assistente {
  id: string;
  nome: string;
  email: string;
  tipo_conta: TipoConta;
  trial_termina_em: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plano: PlanoAssinatura | null;
  status_assinatura: StatusAssinatura;
  created_at: string;
}

export interface Profissional {
  id: string;
  assistente_id: string;
  nome: string;
  especialidade: string;
  registro: string | null;
  email: string | null;
  telefone: string | null;
  foto_url: string | null;
  ativo: boolean;
  created_at: string;
}

export interface Paciente {
  id: string;
  profissional_id: string;
  assistente_id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  data_nascimento: string | null;
  convenio_id: string | null;
  ativo: boolean;
  created_at: string;
}

export interface Consulta {
  id: string;
  profissional_id: string;
  assistente_id: string;
  paciente_id: string;
  data_hora: string;
  duracao_minutos: number;
  status: StatusConsulta;
  observacoes: string | null;
  created_at: string;
  paciente?: Pick<Paciente, "id" | "nome">;
}

export interface Lancamento {
  id: string;
  profissional_id: string;
  assistente_id: string;
  paciente_id: string | null;
  consulta_id: string | null;
  descricao: string;
  valor: number;
  data: string;
  forma_pagamento: FormaPagamento;
  status: StatusLancamento;
  numero_recibo: string | null;
  created_at: string;
  paciente?: Pick<Paciente, "id" | "nome"> | null;
}

export interface Convenio {
  id: string;
  profissional_id: string;
  assistente_id: string;
  nome: string;
  valor_padrao: number | null;
  ativo: boolean;
  created_at: string;
}

export type TipoDocumento = "prontuario" | "exame" | "receita" | "atestado" | "outro";

export interface DocumentoPaciente {
  id: string;
  profissional_id: string;
  assistente_id: string;
  paciente_id: string;
  titulo: string;
  tipo: TipoDocumento;
  storage_path: string;
  nome_arquivo: string;
  tamanho_bytes: number | null;
  mime_type: string | null;
  created_at: string;
  paciente?: Pick<Paciente, "id" | "nome">;
}

export const LIMITE_PROFISSIONAIS: Record<PlanoAssinatura, number> = {
  solo: 1,
  essencial: 1,
  profissional: 5,
  clinica: Infinity,
};
