-- Documentos de pacientes (prontuários, exames, receitas, etc.)
create table if not exists public.documentos_pacientes (
  id               uuid primary key default gen_random_uuid(),
  profissional_id  uuid not null references public.profissionais(id) on delete cascade,
  assistente_id    uuid not null references public.assistentes(id) on delete cascade,
  paciente_id      uuid not null references public.pacientes(id) on delete cascade,
  titulo           text not null,
  tipo             text not null default 'outro',
  storage_path     text not null,
  nome_arquivo     text not null,
  tamanho_bytes    integer,
  mime_type        text,
  created_at       timestamptz not null default now()
);

alter table public.documentos_pacientes enable row level security;

create policy "documento_acesso_proprio"
  on public.documentos_pacientes
  for all
  using (assistente_id = auth.uid())
  with check (assistente_id = auth.uid());

create index documentos_paciente_idx on public.documentos_pacientes(paciente_id);
create index documentos_profissional_idx on public.documentos_pacientes(profissional_id);
create index documentos_assistente_idx on public.documentos_pacientes(assistente_id);

-- Bucket de storage privado para documentos
-- Executar no dashboard do Supabase se não criado via migration:
-- insert into storage.buckets (id, name, public) values ('documentos', 'documentos', false) on conflict do nothing;
