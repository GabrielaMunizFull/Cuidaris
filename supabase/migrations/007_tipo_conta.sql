-- Migration: 007_tipo_conta
-- Adiciona suporte a profissional autônomo: usuário que é o próprio profissional.
-- tipo_conta = 'assistente' → fluxo atual sem mudanças (default para usuários existentes)
-- tipo_conta = 'autonomo'   → profissional auto-criado no signup, navegação simplificada

-- 1. Campo tipo_conta na tabela assistentes (retrocompatível: default 'assistente')
alter table public.assistentes
  add column if not exists tipo_conta text
    not null
    default 'assistente'
    check (tipo_conta in ('assistente', 'autonomo'));

-- 2. Expandir check constraint do campo plano para incluir 'solo'
alter table public.assistentes
  drop constraint if exists assistentes_plano_check;

alter table public.assistentes
  add constraint assistentes_plano_check
    check (plano in ('solo', 'essencial', 'profissional', 'clinica'));

-- 3. Reescrever trigger handle_new_user para suportar conta autônoma.
--    Para tipo_conta = 'autonomo': auto-cria o registro de profissional
--    no mesmo transaction usando os dados do raw_user_meta_data.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_tipo text;
begin
  v_tipo := coalesce(new.raw_user_meta_data->>'tipo_conta', 'assistente');

  insert into public.assistentes (id, nome, email, tipo_conta)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    new.email,
    v_tipo
  );

  -- Auto-criar o profissional vinculado ao autônomo no mesmo transaction
  if v_tipo = 'autonomo' then
    insert into public.profissionais (
      id,
      assistente_id,
      nome,
      especialidade,
      registro,
      email,
      telefone
    ) values (
      gen_random_uuid(),
      new.id,
      coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
      coalesce(nullif(new.raw_user_meta_data->>'especialidade', ''), 'Profissional de Saúde'),
      nullif(new.raw_user_meta_data->>'registro', ''),
      new.email,
      nullif(new.raw_user_meta_data->>'telefone', '')
    );
  end if;

  return new;
end;
$$;
