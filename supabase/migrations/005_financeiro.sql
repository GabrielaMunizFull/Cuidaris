-- Migration: 005_financeiro
-- Lançamentos financeiros por profissional.
-- Recibo gerado automaticamente quando status = 'pago'.

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
  on public.lancamentos
  for all
  using (assistente_id = auth.uid())
  with check (assistente_id = auth.uid());

create index lancamentos_profissional_data_idx on public.lancamentos(profissional_id, data desc);
create index lancamentos_assistente_idx on public.lancamentos(assistente_id);

-- Função para gerar número do recibo: ANO/SEQUENCIAL
create or replace function public.gerar_numero_recibo(p_assistente_id uuid)
returns text
language plpgsql
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
  where assistente_id = p_assistente_id
    and numero_recibo is not null;

  return v_ano || '/' || lpad(v_seq::text, 4, '0');
end;
$$;

-- Trigger: atribui número de recibo automaticamente ao marcar como 'pago'
create or replace function public.handle_lancamento_pago()
returns trigger
language plpgsql
security definer set search_path = public
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
