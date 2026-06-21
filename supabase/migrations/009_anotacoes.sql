-- Anotações / prontuário simples por paciente
create table if not exists public.anotacoes_pacientes (
  id               uuid primary key default gen_random_uuid(),
  profissional_id  uuid not null references public.profissionais(id) on delete cascade,
  assistente_id    uuid not null references public.assistentes(id) on delete cascade,
  paciente_id      uuid not null references public.pacientes(id) on delete cascade,
  conteudo         text not null,
  created_at       timestamptz default now() not null,
  updated_at       timestamptz default now() not null
);

alter table public.anotacoes_pacientes enable row level security;

create policy "assistente vê suas anotações"
  on public.anotacoes_pacientes for all
  using (assistente_id = auth.uid());

create index idx_anotacoes_paciente on public.anotacoes_pacientes(paciente_id);
create index idx_anotacoes_profissional on public.anotacoes_pacientes(profissional_id);

-- Trigger para atualizar updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger anotacoes_updated_at
  before update on public.anotacoes_pacientes
  for each row execute function public.set_updated_at();
