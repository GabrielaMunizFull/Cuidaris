# Developer

## Quando usar
Implementar features, escrever código, criar componentes, queries, Server Actions, migrations.

---

## Regras obrigatórias

- Tokens CSS — nunca hex avulso, sempre variáveis CSS ou classes Tailwind mapeadas
- Server Components por padrão — `'use client'` só quando necessário
- RLS sempre ativo — toda tabela nova com policy `assistente_id = auth.uid()`
- Soft delete — nunca `DELETE` em pacientes, profissionais ou lançamentos — usar `ativo = false`
- Migrations sequenciais — `001_descricao.sql`, `002_descricao.sql`
- TypeScript estrito — sem `any`, sem `as unknown`

---

## Template: Server Action

```typescript
'use server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const Schema = z.object({
  nome: z.string().min(2).max(100),
  profissional_id: z.string().uuid(),
});

export async function criarPaciente(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado' };

  const parsed = Schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { error } = await supabase
    .from('pacientes')
    .insert({ ...parsed.data, assistente_id: user.id });

  if (error) return { error: 'Erro ao salvar' };

  revalidatePath(`/profissionais/${parsed.data.profissional_id}/pacientes`);
  return { success: true };
}
```

---

## Template: Query com cache

```typescript
import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

export const getProfissionais = cache(async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profissionais')
    .select('id, nome, especialidade, cor, ativo')
    .eq('ativo', true)
    .order('nome');

  if (error) throw new Error('Falha ao buscar profissionais');
  return data;
});
```

---

## Template: Migration RLS

```sql
-- migrations/001_nome.sql
begin;

create table nome_tabela (
  id uuid primary key default gen_random_uuid(),
  assistente_id uuid not null references auth.users(id),
  -- campos...
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table nome_tabela enable row level security;

create policy "assistente gerencia seus dados"
  on nome_tabela for all
  using (assistente_id = auth.uid())
  with check (assistente_id = auth.uid());

commit;
```

---

## Template: Componente com status badge

```typescript
import { cn } from '@/lib/utils';

type Status = 'confirmado' | 'pendente' | 'cancelado' | 'remarcado';

const STATUS_STYLES: Record<Status, string> = {
  confirmado: 'bg-accent-soft text-accent',
  pendente:   'bg-yellow-50 text-yellow-600',
  cancelado:  'bg-red-50 text-red-500',
  remarcado:  'bg-blue-50 text-blue-500',
};

export function Badge({ status }: { status: Status }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
      STATUS_STYLES[status]
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
```

---

## Checklist antes de abrir PR

- [ ] Server Component onde possível?
- [ ] Dados validados com Zod antes de inserir no banco?
- [ ] Erros tratados e comunicados para a usuária?
- [ ] `revalidatePath` chamado após mutations?
- [ ] Sem dados hardcoded (IDs, URLs, chaves)?
- [ ] TypeScript sem erros (`tsc --noEmit`)?
- [ ] Sem `console.log` esquecido?
