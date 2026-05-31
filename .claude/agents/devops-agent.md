# Agente — DevOps / Deploy

## Quando usar este agente
Configurar ambientes, CI/CD, variáveis de ambiente, deploy
e monitoramento do Cuidaris.

---

## Ambientes

| Ambiente | URL | Branch |
|---|---|---|
| Local | localhost:3000 | qualquer |
| Preview | gerado pelo Vercel | PRs |
| Produção | app.cuidaris.com.br | main |

---

## Variáveis de ambiente por ambiente

```env
# .env.local (desenvolvimento)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

STRIPE_SECRET_KEY=sk_test_...          # chave de TEST
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

STRIPE_PRICE_ESSENCIAL=price_test_...
STRIPE_PRICE_PROFISSIONAL=price_test_...
STRIPE_PRICE_CLINICA=price_test_...

RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# .env.production (Vercel — nunca commitar)
# Mesmas chaves com valores de PRODUÇÃO
# STRIPE_SECRET_KEY=sk_live_...
```

---

## Setup inicial do projeto

```bash
# 1. Criar projeto Turborepo
npx create-turbo@latest cuidaris
cd cuidaris

# 2. Instalar dependências principais
pnpm add @supabase/ssr @supabase/supabase-js
pnpm add stripe @stripe/stripe-js
pnpm add resend @react-email/components
pnpm add @react-pdf/renderer
pnpm add zod react-hook-form @hookform/resolvers
pnpm add date-fns lucide-react
pnpm add @tanstack/react-table

# 3. Dev dependencies
pnpm add -D typescript @types/node @types/react
pnpm add -D vitest @testing-library/react
pnpm add -D prettier eslint

# 4. Supabase CLI
pnpm add -D supabase
npx supabase init
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
```

---

## Supabase Migrations

```bash
# Criar migration
npx supabase migration new nome_da_migration

# Rodar localmente
npx supabase db reset

# Push para produção
npx supabase db push

# Gerar tipos TypeScript
npx supabase gen types typescript --linked > src/types/database.ts
```

---

## Deploy na Vercel

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel --prod

# Configurar domínio
# Painel Vercel → Settings → Domains → app.cuidaris.com.br
```

**Variáveis no Vercel:**
Painel → Settings → Environment Variables → adicionar todas do `.env.production`

---

## Stripe Webhook em produção

```bash
# Criar webhook no Stripe Dashboard:
# Endpoint: https://app.cuidaris.com.br/api/stripe/webhook
# Eventos:
# - checkout.session.completed
# - customer.subscription.updated
# - customer.subscription.deleted
# - invoice.payment_failed

# Copiar o signing secret e adicionar como:
# STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## CI/CD (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with: { node-version: 20 }

      - run: pnpm install
      - run: pnpm typecheck     # tsc --noEmit
      - run: pnpm lint          # eslint
      - run: pnpm test          # vitest
```

---

## Monitoramento (configurar no MVP)

| Ferramenta | O que monitora | Plano gratuito |
|---|---|---|
| Vercel Analytics | Pageviews, performance | Sim |
| Supabase Dashboard | Queries, RLS, storage | Sim |
| Stripe Dashboard | Pagamentos, churn | Sim |
| Sentry (fase 2) | Erros em produção | 5k erros/mês |

---

## Checklist de go-live

- [ ] Domínio configurado (app.cuidaris.com.br)
- [ ] SSL ativo (automático na Vercel)
- [ ] Todas variáveis de produção no Vercel
- [ ] Stripe em modo live (não test)
- [ ] Webhook Stripe apontando para produção
- [ ] RLS testado em produção
- [ ] Backup automático do Supabase ativo
- [ ] E-mail de suporte configurado (contato@cuidaris.com.br)
- [ ] Política de privacidade e termos no rodapé (LGPD)
