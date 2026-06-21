# Tech Lead

## Quando usar
Decisões de arquitetura, escolha entre abordagens, refatoração, performance, adicionar dependência nova.

---

## Princípios do Cuidaris

1. **Server-first** — Server Components por padrão, Client só quando necessário
2. **Segurança no banco** — RLS é a última linha de defesa, nunca confiar só no frontend
3. **Tipagem estrita** — TypeScript strict, Zod para validação de entrada
4. **Sem over-engineering** — SaaS de assistentes virtuais, não o Google
5. **Colocação** — código relacionado fica junto (feature folders)

---

## Decisões técnicas já tomadas

| Decisão | Escolha | Motivo |
|---|---|---|
| Estado global | Não usar | Server Components resolve a maioria |
| ORM | Supabase client direto | RLS nativo, sem abstração desnecessária |
| Formulários | React Hook Form + Zod | Performance + validação tipada |
| Datas | date-fns | Leve, funcional, sem side effects |
| Ícones | Lucide React | Consistente com o design system |
| Tabelas | TanStack Table | Flexível, headless, server-side ready |

---

## Estrutura de pastas

```
apps/web/src/
├── app/
│   ├── (auth)/              # rotas públicas
│   ├── (app)/               # rotas protegidas
│   │   ├── layout.tsx       # sidebar + header
│   │   ├── page.tsx         # dashboard
│   │   └── profissionais/[id]/
│   └── api/
│       ├── stripe/
│       └── pdf/
├── components/
│   ├── ui/                  # primitivos (Button, Badge, Input...)
│   └── features/            # componentes de domínio
├── lib/
│   ├── supabase/
│   ├── stripe.ts
│   └── utils.ts
└── types/
    └── database.ts          # tipos gerados pelo Supabase
```

---

## Red flags

```
✗ useEffect para buscar dados (use Server Components)
✗ fetch() no cliente sem cache (use Server Actions)
✗ Guardar dados sensíveis no localStorage
✗ Lógica de negócio no componente (extrair para lib/)
✗ any no TypeScript
✗ Ignorar erros do Supabase
✗ Mutations sem revalidatePath
✗ Instanciar Stripe/Resend no cliente
```

---

## Performance

- Imagens: sempre `next/image` com `width` e `height`
- Fontes: sempre `next/font`
- Listas longas: paginação no banco, nunca `select *` sem limite
- Queries paralelas: `Promise.all()` quando não há dependência
- Skeleton loading em vez de spinners globais

---

## Checklist de decisão de arquitetura

- [ ] É a solução mais simples que resolve o problema?
- [ ] Cria débito técnico que vai doer em 6 meses?
- [ ] Adiciona dependência — qual o custo de manutenção?
- [ ] Afeta performance em dispositivos lentos?
- [ ] Quebra o isolamento multi-tenant?
