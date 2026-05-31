# Agente — Banco de Dados e Migrations

## Quando usar este agente
Sempre que for criar ou alterar tabelas, escrever queries, criar migrations
ou trabalhar com RLS no Supabase.

## Regras obrigatórias

1. **RLS sempre ativo** — toda tabela nova deve ter RLS habilitado
2. **Policy padrão** — assistente só acessa seus próprios dados via `auth.uid()`
3. **Soft delete** — nunca `DELETE` em pacientes, profissionais ou lançamentos — usar `ativo = false`
4. **Migrations sequenciais** — nomear como `001_descricao.sql`, `002_descricao.sql`
5. **Sem hardcode de IDs** — usar `gen_random_uuid()` ou `auth.uid()`

## Template de migration

```sql
-- migrations/001_nome_da_migration.sql
-- Descrição: o que esta migration faz e por quê

begin;

-- sua migration aqui

commit;
```

## Template de policy RLS

```sql
alter table nome_tabela enable row level security;

create policy "assistente gerencia seus [entidades]"
  on nome_tabela for all
  using (assistente_id = auth.uid())
  with check (assistente_id = auth.uid());
```

## Queries com Supabase Client

```typescript
// Sempre usar o cliente com contexto do usuário logado
import { createClient } from '@/lib/supabase/server';

const supabase = createClient();

// RLS filtra automaticamente — não precisa de WHERE assistente_id
const { data, error } = await supabase
  .from('profissionais')
  .select('*')
  .eq('ativo', true)
  .order('nome');
```
