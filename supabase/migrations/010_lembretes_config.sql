-- Configuração de lembretes por assistente
alter table public.assistentes
  add column if not exists lembretes_ativos boolean not null default true;
