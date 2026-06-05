# Cuidaris — Setup Técnico

SaaS para assistentes virtuais de profissionais de saúde.
Monorepo com Next.js 14, Supabase e Stripe.

---

## Pré-requisitos

- Node.js 20+
- pnpm 9+
- Conta Supabase
- Conta Stripe (opcional para desenvolvimento local)

---

## Instalação

```bash
git clone https://github.com/GabrielaMunizFull/cuidaris.git
cd cuidaris
pnpm install
```

---

## Variáveis de ambiente

Crie `apps/web/.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ESSENCIAL=price_...
STRIPE_PRICE_PROFISSIONAL=price_...
STRIPE_PRICE_CLINICA=price_...

# Resend
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Banco de dados

```bash
# Aplicar migrations no Supabase
supabase db push

# Ou rodar o seed de desenvolvimento
supabase db reset
```

As migrations ficam em `supabase/migrations/`. O RLS está ativo em todas as tabelas — nunca desativar.

---

## Rodando local

```bash
# App principal (porta 3000)
pnpm --filter web dev

# Ou rodar tudo pelo Turborepo
pnpm dev
```

---

## Estrutura do monorepo

```
cuidaris/
├── apps/
│   ├── web/          # App principal (Next.js 14 App Router)
│   └── landing/      # Landing page
├── packages/
│   ├── ui/           # Componentes compartilhados
│   ├── db/           # Schema Supabase + queries
│   ├── emails/       # Templates Resend
│   └── pdf/          # Templates React PDF
└── supabase/
    ├── migrations/
    └── seed.sql
```

### Estrutura interna do app (`apps/web/src/`)

```
app/
├── (auth)/           # Rotas públicas: /login, /cadastro
├── (app)/            # Rotas protegidas (requer sessão)
│   ├── layout.tsx    # Sidebar + header
│   ├── dashboard/
│   ├── agenda/
│   ├── financeiro/
│   ├── relatorios/
│   ├── planos/
│   ├── configuracoes/
│   └── profissionais/
│       └── [id]/
│           ├── pacientes/
│           ├── agenda/
│           ├── financeiro/
│           └── convenios/
└── api/
    └── stripe/       # checkout, portal, webhook
```

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Estilização | Tailwind CSS |
| Banco + Auth | Supabase (PostgreSQL + RLS) |
| Pagamentos | Stripe |
| E-mails | Resend |
| PDF | React PDF |
| Hospedagem | Vercel |
| Monorepo | Turborepo |

---

## Testes E2E

```bash
# Instalar browsers do Playwright
pnpm --filter web exec playwright install

# Criar usuárias de teste no Supabase antes de rodar:
# testes_a@cuidaris.dev / TesteCuidaris@123
# testes_b@cuidaris.dev / TesteCuidaris@123

# Rodar com servidor já rodando (recomendado)
pnpm --filter web dev  # em outro terminal
pnpm --filter web exec playwright test

# Ver relatório
pnpm --filter web exec playwright show-report
```

### Suítes disponíveis

| Arquivo | Cobertura |
|---|---|
| `auth.spec.ts` | Redirect sem sessão, login inválido, redirect de usuária logada |
| `profissionais.spec.ts` | Listar, criar, validações, abas de navegação |
| `pacientes.spec.ts` | XSS, campo opcional, campo obrigatório |
| `agenda.spec.ts` | Criar consulta, validações, aviso sem pacientes |
| `financeiro.spec.ts` | Criar lançamento, validações |
| `convenios.spec.ts` | Criar, editar, validações |
| `planos.spec.ts` | Cards dos planos, trial banner |
| `multi-tenant.spec.ts` | Isolamento entre usuárias |
| `mobile.spec.ts` | Layout sem overflow em 375px |

---

## Deploy

O app faz deploy automático na Vercel a cada push na branch `main`.

Webhooks do Stripe devem apontar para:
```
https://app.cuidaris.com.br/api/stripe/webhook
```
