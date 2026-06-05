# Cuidaris — Guia de Contribuição

---

## Convenções de código

### Linguagem e tipagem

- TypeScript estrito (`strict: true`) — sem `any`
- Zod para validação em toda entrada externa (formulários, APIs)
- Tipos do banco gerados pelo Supabase em `src/types/database.ts`

### Nomenclatura

| Tipo | Convenção | Exemplo |
|---|---|---|
| Componentes | PascalCase | `PacienteForm` |
| Funções/variáveis | camelCase | `criarPaciente` |
| Arquivos | kebab-case | `paciente-form.tsx` |
| Rotas | kebab-case | `/profissionais/novo` |

### Server vs Client Components

- **Padrão: Server Component** — busca de dados, renderização estática
- **`"use client"` apenas quando necessário:** interatividade, hooks de estado, eventos do browser
- Nunca buscar dados com `useEffect` — usar Server Components

### Queries

```typescript
// Sempre usar o cliente Supabase com RLS — nunca bypassar
const supabase = await createClient(); // server
const supabase = createBrowserClient(); // client

// Memoizar queries por request com cache()
export const getProfissionais = cache(async () => { ... });

// Queries paralelas quando não há dependência
const [profissional, pacientes] = await Promise.all([
  getProfissional(id),
  getPacientes(id),
]);
```

### Server Actions

```typescript
'use server';

export async function criarPacienteAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();

  // 1. Verificar autenticação
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado' };

  // 2. Validar com Zod
  const parsed = PacienteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // 3. Inserir (RLS garante o isolamento)
  const { error } = await supabase.from('pacientes').insert({
    ...parsed.data,
    assistente_id: user.id,
  });

  if (error) return { error: 'Erro ao salvar' };

  // 4. Revalidar cache
  revalidatePath(`/profissionais/${parsed.data.profissional_id}/pacientes`);
  redirect(`/profissionais/${parsed.data.profissional_id}/pacientes`);
}
```

### Comentários

Comentários em português. Explicar o **porquê**, não o **o quê**:

```typescript
// Memoiza por request — evita N queries para o mesmo profissional
export const getProfissional = cache(async (id: string) => { ... });

// Soft delete: preserva histórico de consultas
await supabase.from('pacientes').update({ ativo: false }).eq('id', id);
```

---

## Design System

Nunca usar hex avulso no código. Sempre variáveis CSS ou classes Tailwind mapeadas:

```tsx
// ✓ Correto
<div className="text-[var(--ink)] bg-[var(--surface)]">

// ✗ Errado
<div className="text-[#0F172A] bg-white">
```

Tokens disponíveis: `--accent`, `--ink`, `--ink-2`, `--ink-3`, `--bg`, `--surface`, `--line`, `--radius`.

Ver referência completa em `.claude/context/design-system.md`.

---

## Segurança — obrigatório

- **RLS ativo em todas as tabelas** — `assistente_id` sempre preenchido via `auth.uid()` no servidor, nunca recebido do frontend
- **Nunca expor `SUPABASE_SERVICE_ROLE_KEY`** no cliente
- **Nunca instanciar Stripe ou Resend no cliente** — apenas em Server Actions e Route Handlers
- **Sempre validar assinatura** de webhooks do Stripe
- **Validação com Zod** em todos os inputs antes de tocar no banco

---

## Agentes do `.claude/`

O projeto tem agentes especializados para consultar antes de tarefas específicas:

| Agente | Quando usar |
|---|---|
| `product-owner-agent.md` | Antes de qualquer feature nova — escopo, user stories, priorização |
| `tech-lead-agent.md` | Decisões de arquitetura, refatoração, dependências novas |
| `database-agent.md` | Migrations, queries, RLS, schema |
| `frontend-agent.md` | Componentes, design system, acessibilidade |
| `auth-agent.md` | Autenticação, sessões, middleware |
| `pdf-agent.md` | Geração de recibos em PDF |
| `email-agent.md` | Templates e envio de e-mails com Resend |
| `devops-agent.md` | Deploy, variáveis de ambiente, Vercel |
| `qa-agent.md` | Testes E2E, critérios de aceite |
| `ux-writer-agent.md` | Textos da interface, mensagens de erro |

---

## Checklist antes de abrir PR

- [ ] TypeScript sem erros (`pnpm tsc --noEmit`)
- [ ] Server Component onde possível (sem `useEffect` para dados)
- [ ] Dados validados com Zod antes de inserir no banco
- [ ] `revalidatePath` chamado após mutations
- [ ] Erros tratados e comunicados visualmente para a usuária
- [ ] RLS testado: usuária A não vê dados de usuária B
- [ ] Funciona no mobile (375px sem overflow horizontal)
- [ ] Sem hex avulso, sem `any`, sem chaves hardcoded
- [ ] Testes E2E para o fluxo novo (quando aplicável)

---

## Definição de pronto

Uma feature está pronta quando:

1. Funciona no desktop e no mobile
2. RLS testado manualmente ou via `multi-tenant.spec.ts`
3. Erros tratados com feedback visual
4. TypeScript sem erros
5. Testes E2E cobrindo o happy path e ao menos um caso de erro
