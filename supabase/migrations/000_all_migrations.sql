-- =============================================
-- CUIDARIS — Todas as migrations (executar uma vez)
-- =============================================

-- 001: Assistentes (usuárias do sistema)
create table if not exists public.assistentes (
  id                    uuid primary key references auth.users(id) on delete cascade,
  nome                  text not null,
  email                 text not null unique,
  trial_termina_em      timestamptz not null default (now() + interval '14 days'),
  stripe_customer_id    text unique,
  stripe_subscription_id text unique,
  plano                 text check (plano in ('essencial', 'profissional', 'clinica')),
  status_assinatura     text not null check (status_assinatura in ('trial', 'ativo', 'cancelado', 'inadimplente')) default 'trial',
  created_at            timestamptz not null default now()
);

alter table public.assistentes enable row level security;

create policy "assistente_select_propria"
  on public.assistentes for select
  using (id = auth.uid());

create policy "assistente_update_propria"
  on public.assistentes for update
  using (id = auth.uid())
  with check (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.assistentes (id, nome, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 002: Profissionais
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
  on public.profissionais for all
  using (assistente_id = auth.uid())
  with check (assistente_id = auth.uid());

create index profissionais_assistente_idx on public.profissionais(assistente_id) where ativo = true;

-- 003: Pacientes
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
  on public.pacientes for all
  using (assistente_id = auth.uid())
  with check (assistente_id = auth.uid());

create index pacientes_profissional_idx on public.pacientes(profissional_id) where ativo = true;
create index pacientes_assistente_idx on public.pacientes(assistente_id) where ativo = true;

-- 004: Agenda
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
  on public.agenda for all
  using (assistente_id = auth.uid())
  with check (assistente_id = auth.uid());

create index agenda_profissional_data_idx on public.agenda(profissional_id, data_hora);
create index agenda_assistente_data_idx on public.agenda(assistente_id, data_hora);

create or replace function public.check_horario_disponivel(
  p_profissional_id uuid,
  p_data_hora timestamptz,
  p_duracao_minutos integer,
  p_excluir_id uuid default null
) returns boolean language sql stable
as $$
  select not exists (
    select 1 from public.agenda
    where
      profissional_id = p_profissional_id
      and status not in ('cancelado', 'remarcado')
      and id is distinct from p_excluir_id
      and tstzrange(data_hora, data_hora + (duracao_minutos * interval '1 minute'), '[)')
          && tstzrange(p_data_hora, p_data_hora + (p_duracao_minutos * interval '1 minute'), '[)')
  )
$$;

-- 005: Financeiro
create table if not exists public.lancamentos (
  id               uuid primary key default gen_random_uuid(),
  profissional_id  uuid not null references public.profissionais(id) on delete cascade,
  assistente_id    uuid not null references public.assistentes(id) on delete cascade,
  paciente_id      uuid references public.pacientes(id),
  consulta_id      uuid references public.agenda(id),
  descricao        text not null,
  valor            numeric(10, 2) not null check (valor > 0),
  data             date not null default current_date,
  forma_pagamento  text not null check (forma_pagamento in ('dinheiro', 'pix', 'cartao_credito', 'cartao_debito', 'transferencia', 'convenio')),
  status           text not null check (status in ('pago', 'pendente', 'atrasado')) default 'pendente',
  numero_recibo    text unique,
  created_at       timestamptz not null default now()
);

alter table public.lancamentos enable row level security;

create policy "lancamento_acesso_proprio"
  on public.lancamentos for all
  using (assistente_id = auth.uid())
  with check (assistente_id = auth.uid());

create index lancamentos_profissional_data_idx on public.lancamentos(profissional_id, data desc);
create index lancamentos_assistente_idx on public.lancamentos(assistente_id);

create or replace function public.gerar_numero_recibo(p_assistente_id uuid)
returns text language plpgsql
as $$
declare
  v_ano text;
  v_seq integer;
begin
  v_ano := extract(year from now())::text;
  select coalesce(max(
    case
      when numero_recibo like v_ano || '/%'
      then (split_part(numero_recibo, '/', 2))::integer
      else 0
    end
  ), 0) + 1
  into v_seq
  from public.lancamentos
  where assistente_id = p_assistente_id and numero_recibo is not null;
  return v_ano || '/' || lpad(v_seq::text, 4, '0');
end;
$$;

create or replace function public.handle_lancamento_pago()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if new.status = 'pago' and old.status != 'pago' and new.numero_recibo is null then
    new.numero_recibo := public.gerar_numero_recibo(new.assistente_id);
  end if;
  return new;
end;
$$;

create or replace trigger on_lancamento_pago
  before update of status on public.lancamentos
  for each row execute function public.handle_lancamento_pago();
