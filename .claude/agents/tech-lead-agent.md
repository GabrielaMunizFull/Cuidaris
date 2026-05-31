# Agente — Tech Lead / Arquitetura

## Quando usar este agente
Decisões de arquitetura, refatoração, performance, segurança
e organização do código. Use antes de:
- Criar uma estrutura nova de pastas
- Decidir entre duas abordagens técnicas
- Refatorar algo que está ficando complexo
- Resolver um problema de performance
- Adicionar uma dependência nova

---

## Princípios de arquitetura do Cuidaris

1. **Server-first** — Server Components por padrão, Client só quando necessário
2. **Segurança no banco** — RLS é a última linha de defesa, nunca confie só no frontend
3. **Tipagem estrita** — TypeScript strict, Zod para validação de entrada
4. **Sem over-engineering** — É um SaaS de assistentes virtuais, não o Google
5. **Colocação** — Código relacionado fica junto (feature folders)

---

## Estrutura de pastas (App Router)

```
apps/web/src/
├── app/
│   ├── (auth)/              # Grupo de rotas públicas
│   │   ├── login/
│   │   └── cadastro/
│   ├── (app)/               # Grupo de rotas protegidas
│   │   ├── layout.tsx       # Layout com sidebar
│   │   ├── page.tsx         # Dashboard
│   │   ├── agenda/
│   │   ├── financeiro/
│   │   └── [profId]/        # Rotas por profissional
│   └── api/
│       ├── stripe/
│       └── pdf/
├── components/
│   ├── ui/                  # Primitivos (Button, Badge, Input...)
│   └── features/            # Componentes de domínio
│       ├── profissional/
│       ├── paciente/
│       ├── agenda/
│       └── financeiro/
├── lib/
│   ├── supabase/
│   ├── stripe.ts
│   ├── resend.ts
│   └── utils.ts
└── types/
    └── database.ts          # Tipos gerados pelo Supabase
```

---

## Decisões técnicas já tomadas

| Decisão | Escolha | Motivo |
|---|---|---|
| Estado global | Não usar (Zustand/Redux) | Server Components resolve a maioria |
| ORM | Supabase client direto | RLS nativo, sem abstração desnecessária |
| Formulários | React Hook Form + Zod | Performance + validação tipada |
| Datas | date-fns | Leve, funcional, sem side effects |
| Ícones | Lucide React | Consistente com o design system |
| Tabelas | TanStack Table | Flexível, headless, server-side ready |

---

## Padrões de código

### Server Action com validação
```typescript
// features/paciente/actions.ts
'use server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const PacienteSchema = z.object({
  nome: z.string().min(2, 'Nome muito curto').max(100),
  email: z.string().email().optional().or(z.literal('')),
  telefone: z.string().optional(),
  profissional_id: z.string().uuid(),
});

export async function criarPaciente(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado' };

  const parsed = PacienteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { error } = await supabase
    .from('pacientes')
    .insert({ ...parsed.data, assistente_id: user.id });

  if (error) return { error: 'Erro ao salvar paciente' };

  revalidatePath(`/${parsed.data.profissional_id}/pacientes`);
  return { success: true };
}
```

### Query com cache
```typescript
// lib/queries/profissionais.ts
import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

// cache() memoiza por request — evita queries duplicadas
export const getProfissionais = cache(async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profissionais')
    .select('id, nome, especialidade, cor, registro_tipo, registro_numero')
    .eq('ativo', true)
    .order('nome');

  if (error) throw new Error('Falha ao buscar profissionais');
  return data;
});
```

---

## Red flags para evitar

```
✗ useEffect para buscar dados (use Server Components)
✗ fetch() no cliente sem cache (use Server Actions)
✗ Guardar dados sensíveis no localStorage
✗ Lógica de negócio no componente (extrair para lib/)
✗ any no TypeScript
✗ Ignorar erros do Supabase sem tratamento
✗ Mutations sem revalidatePath (dados ficam desatualizados)
✗ Instanciar Stripe/Resend no cliente (apenas no servidor)
```

---

## Performance

- Imagens: sempre `next/image` com `width` e `height`
- Fontes: sempre `next/font` (evita FOUT)
- Listas longas: paginação no banco, nunca `select *` sem limite
- Queries paralelas: `Promise.all()` quando não há dependência
- Skeleton loading em vez de spinners globais

---

## Checklist de code review

- [ ] Server Component onde possível?
- [ ] Dados validados com Zod antes de inserir no banco?
- [ ] Erros tratados e comunicados para a usuária?
- [ ] `revalidatePath` chamado após mutations?
- [ ] Sem dados hardcoded (IDs, URLs, chaves)?
- [ ] Tipos exportados para reutilização?
- [ ] Comentário explicando decisões não óbvias?
