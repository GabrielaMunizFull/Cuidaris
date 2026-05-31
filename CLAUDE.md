# Cuidaris — Contexto Principal para Claude Code

## O que é o Cuidaris
SaaS web para assistentes virtuais de profissionais de saúde.
A assistente gerencia vários profissionais (psicólogos, nutricionistas,
fisioterapeutas, médicos) em um único painel — cada profissional com
seu espaço isolado (multi-tenant via RLS no Supabase).

## Desenvolvido por
Gabriela Muniz — Muniz.dev
gabrielasmunizf@gmail.com

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Estilização | Tailwind CSS |
| Banco + Auth | Supabase (PostgreSQL + RLS) |
| Pagamentos | Stripe (assinaturas recorrentes) |
| E-mails | Resend |
| PDF | React PDF |
| Hospedagem | Vercel |
| Monorepo | Turborepo |

---

## Estrutura do Monorepo

```
cuidaris/
├── apps/
│   ├── web/          # App principal (Next.js)
│   └── landing/      # Landing page (Next.js)
├── packages/
│   ├── ui/           # Componentes compartilhados
│   ├── db/           # Schema Supabase + queries
│   ├── emails/       # Templates Resend
│   └── pdf/          # Templates React PDF
├── .claude/
│   ├── CLAUDE.md     # Este arquivo
│   ├── agents/       # Agentes especializados
│   └── context/      # Contextos por domínio
└── supabase/
    ├── migrations/
    └── seed.sql
```

---

## Design System (tokens obrigatórios)

```css
:root {
  --accent: #10B981;        /* verde — ação principal */
  --accent-hover: #059669;
  --accent-soft: #ecfdf5;
  --blue: #3B82F6;          /* azul — links e secundário */
  --blue-hover: #2563EB;
  --ink: #0F172A;           /* texto principal */
  --ink-2: #475569;         /* texto secundário */
  --ink-3: #94A3B8;         /* texto terciário */
  --bg: #F6F8FA;            /* fundo do app */
  --surface: #FFFFFF;
  --line: #E8ECF1;          /* bordas */
  --radius: 14px;
  --font: "Inter", system-ui, sans-serif;
}
```

**Regras de uso:**
- NUNCA usar hex avulso no código — sempre variáveis CSS ou classes Tailwind mapeadas
- Um botão verde primário por tela
- Badges de status: verde=confirmado, amarelo=pendente, vermelho=cancelado, azul=remarcado
- Tipografia: Inter variable, títulos -0.02em letter-spacing
- Grid base: 8px
- Cantos: radius-sm=10px, radius=14px, radius-lg=20px

---

## Modelo de dados principal

```
assistente (usuária logada)
└── profissionais[] (multi-tenant, isolado por RLS)
    ├── pacientes[]
    │   └── convenio_id?
    ├── agenda[]
    │   └── status: confirmado | pendente | cancelado | remarcado
    ├── lancamentos[] (financeiro)
    │   └── recibo gerado automaticamente
    ├── convenios[]
    └── documentos[]
```

---

## Planos e preços (Stripe)

| Plano | Preço | Limite |
|---|---|---|
| Essencial | R$79/mês | 1 profissional |
| Profissional | R$189/mês | até 5 profissionais |
| Clínica | R$449/mês | ilimitado |

Trial: 14 dias grátis, sem cartão.

---

## Convenções de código

- **Linguagem:** TypeScript estrito (strict: true)
- **Componentes:** sempre funcionais com hooks
- **Nomes:** PascalCase componentes, camelCase funções, kebab-case arquivos
- **Server vs Client:** preferir Server Components; Client apenas quando necessário (interatividade)
- **Queries:** sempre usar o cliente Supabase com RLS — nunca bypassar segurança
- **Erros:** tratar sempre — nunca swallow errors silenciosamente
- **Comentários:** em português, explicar o "por quê" não o "o quê"

---

## Segurança (obrigatório)

- RLS ativo em TODAS as tabelas — assistente só vê seus próprios profissionais
- Validação com Zod em todos os inputs
- Nunca expor dados de outros tenants
- Webhooks Stripe validados com assinatura
- Variáveis de ambiente: nunca hardcodar chaves

---

## Referências visuais
Linear, Notion, Cal.com — clean, espaçado, profissional.
Ver design system completo em: `.claude/context/design-system.md`
