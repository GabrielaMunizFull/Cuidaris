-- Migration: 002_profissionais
-- Tabela de profissionais de saúde gerenciados pela assistente.
-- Soft delete via campo ativo (histórico preservado).

create table if not exists public.profissionais (
  id             uuid primary key default gen_random_uuid(),
  assistente_id  uuid not null references public.assistentes(id) on delete cascade,
  nome           text not null,
  especialidade  text not null,
  registro       text,
  email          text,
  telefone       text,
  foto_url       text,
  ativo          boolean not null default true,
  created_at     timestamptz not null default now()
);

alter table public.profissionais enable row level security;

create policy "profissional_acesso_proprio"
  on public.profissionais
  for all
  using (assistente_id = auth.uid())
  with check (assistente_id = auth.uid());

create index profissionais_assistente_idx on public.profissionais(assistente_id) where ativo = true;
