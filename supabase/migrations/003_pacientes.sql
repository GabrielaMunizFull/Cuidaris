-- Migration: 003_pacientes
-- Tabela de pacientes vinculados a cada profissional.
-- Soft delete via campo ativo.

create table if not exists public.pacientes (
  id               uuid primary key default gen_random_uuid(),
  profissional_id  uuid not null references public.profissionais(id) on delete cascade,
  assistente_id    uuid not null references public.assistentes(id) on delete cascade,
  nome             text not null,
  email            text,
  telefone         text,
  data_nascimento  date,
  convenio_id      uuid,
  ativo            boolean not null default true,
  created_at       timestamptz not null default now()
);

alter table public.pacientes enable row level security;

create policy "paciente_acesso_proprio"
  on public.pacientes
  for all
  using (assistente_id = auth.uid())
  with check (assistente_id = auth.uid());

create index pacientes_profissional_idx on public.pacientes(profissional_id) where ativo = true;
create index pacientes_assistente_idx on public.pacientes(assistente_id) where ativo = true;
