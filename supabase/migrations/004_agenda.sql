-- Migration: 004_agenda
-- Agenda de consultas por profissional.
-- Sem sobreposição de horários garantida por constraint.

create table if not exists public.agenda (
  id               uuid primary key default gen_random_uuid(),
  profissional_id  uuid not null references public.profissionais(id) on delete cascade,
  assistente_id    uuid not null references public.assistentes(id) on delete cascade,
  paciente_id      uuid not null references public.pacientes(id),
  data_hora        timestamptz not null,
  duracao_minutos  integer not null default 50 check (duracao_minutos > 0),
  status           text not null check (status in ('confirmado', 'pendente', 'cancelado', 'remarcado')) default 'pendente',
  observacoes      text,
  created_at       timestamptz not null default now()
);

alter table public.agenda enable row level security;

create policy "agenda_acesso_proprio"
  on public.agenda
  for all
  using (assistente_id = auth.uid())
  with check (assistente_id = auth.uid());

create index agenda_profissional_data_idx on public.agenda(profissional_id, data_hora);
create index agenda_assistente_data_idx on public.agenda(assistente_id, data_hora);

-- Função para checar sobreposição de horários
create or replace function public.check_horario_disponivel(
  p_profissional_id uuid,
  p_data_hora timestamptz,
  p_duracao_minutos integer,
  p_excluir_id uuid default null
) returns boolean
language sql stable
as $$
  select not exists (
    select 1
    from public.agenda
    where
      profissional_id = p_profissional_id
      and status not in ('cancelado', 'remarcado')
      and id is distinct from p_excluir_id
      and tstzrange(data_hora, data_hora + (duracao_minutos * interval '1 minute'), '[)')
          &&
          tstzrange(p_data_hora, p_data_hora + (p_duracao_minutos * interval '1 minute'), '[)')
  )
$$;
