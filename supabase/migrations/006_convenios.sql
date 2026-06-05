-- Migration: 006_convenios
-- Tabela de convênios vinculados a cada profissional.
-- Soft delete via campo ativo.

create table if not exists public.convenios (
  id              uuid primary key default gen_random_uuid(),
  profissional_id uuid not null references public.profissionais(id) on delete cascade,
  assistente_id   uuid not null references public.assistentes(id) on delete cascade,
  nome            text not null,
  valor_padrao    numeric(10,2),
  ativo           boolean not null default true,
  created_at      timestamptz not null default now()
);

alter table public.convenios enable row level security;

create policy "convenio_acesso_proprio"
  on public.convenios
  for all
  using (assistente_id = auth.uid())
  with check (assistente_id = auth.uid());

create index convenios_profissional_idx on public.convenios(profissional_id) where ativo = true;

-- FK de pacientes para convenios (set null ao deletar convênio)
alter table public.pacientes
  add constraint fk_paciente_convenio
  foreign key (convenio_id) references public.convenios(id) on delete set null;
