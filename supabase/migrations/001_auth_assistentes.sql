-- Migration: 001_auth_assistentes
-- Cria a tabela de assistentes (usuárias do sistema) com trial e integração Stripe.
-- Vinculada a auth.users do Supabase via foreign key.

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

-- RLS: cada assistente só acessa seus próprios dados
alter table public.assistentes enable row level security;

create policy "assistente_select_propria"
  on public.assistentes
  for select
  using (id = auth.uid());

create policy "assistente_update_propria"
  on public.assistentes
  for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Trigger: cria registro em assistentes automaticamente ao fazer signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
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
