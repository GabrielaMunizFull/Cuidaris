Gera migration SQL completa para o Supabase a partir de uma descrição.

## Como usar

Descreva a mudança: "adicionar campo telefone_secundario em pacientes" ou "criar tabela de notificações".

## O que gera

1. Arquivo de migration com nome sequencial (`NNN_descricao.sql`)
2. `CREATE TABLE` ou `ALTER TABLE` com tipos corretos
3. RLS habilitado + policy padrão (`assistente_id = auth.uid()`)
4. Índices nos campos mais filtrados
5. Soft delete (`ativo boolean default true`) quando aplicável

## Template gerado

```sql
-- migrations/NNN_descricao.sql
-- Descrição: [o que faz e por quê]

begin;

-- sua migration aqui

-- RLS
alter table nome enable row level security;

create policy "assistente gerencia seus dados"
  on nome for all
  using (assistente_id = auth.uid())
  with check (assistente_id = auth.uid());

commit;
```

## Regras obrigatórias

- Sempre dentro de `begin; ... commit;`
- Nunca `DELETE` direto — usar `ativo = false`
- UUIDs via `gen_random_uuid()`
- `created_at timestamptz not null default now()` em toda tabela nova
- Nunca hardcodar `assistente_id` — sempre `auth.uid()`
