# Cuidaris

SaaS para assistentes virtuais de profissionais de saúde. A assistente gerencia vários profissionais (psicólogos, nutricionistas, fisioterapeutas, médicos) em um único painel — cada profissional com seu espaço isolado via RLS no Supabase.

**Desenvolvido por:** Gabriela Muniz — [Muniz.dev](https://muniz.dev)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15 (App Router) |
| Estilização | Tailwind CSS |
| Banco + Auth | Supabase (PostgreSQL + RLS) |
| Pagamentos | Stripe |
| PDF | @react-pdf/renderer |
| Monorepo | Turborepo + pnpm |
| Hospedagem | Vercel |

---

## Estrutura do projeto

```
cuidaris/
├── apps/
│   └── web/                  # App principal (Next.js 15)
│       └── src/
│           ├── app/
│           │   ├── (auth)/   # Login e cadastro
│           │   │   ├── login/
│           │   │   └── cadastro/
│           │   └── (app)/    # App autenticado
│           │       ├── dashboard/
│           │       ├── profissionais/
│           │       │   └── [id]/
│           │       │       ├── agenda/
│           │       │       ├── pacientes/
│           │       │       └── financeiro/
│           │       └── _components/  # Sidebar + Header
│           ├── lib/
│           │   ├── supabase/ # Clientes server/client/middleware
│           │   └── validations/ # Schemas Zod
│           └── middleware.ts
├── packages/
│   ├── ui/    # Button, Badge, Input, Card, Avatar
│   ├── db/    # Tipos TypeScript compartilhados
│   └── pdf/   # Template de recibo (@react-pdf/renderer)
└── supabase/
    └── migrations/
        ├── 001_auth_assistentes.sql
        ├── 002_profissionais.sql
        ├── 003_pacientes.sql
        ├── 004_agenda.sql
        └── 005_financeiro.sql
```

---

## Features do MVP

### Autenticação
- Signup com nome, e-mail e senha
- Trial de 14 dias automático (sem cartão)
- Trigger no Supabase cria o registro de `assistentes` automaticamente
- Middleware protege todas as rotas autenticadas
- RLS garante isolamento total entre contas

### Profissionais
- Cadastrar, editar e desativar profissionais (soft delete)
- Campos: nome, especialidade, CRM/CRP/registro, e-mail, telefone
- Limite por plano (Essencial: 1, Profissional: 5, Clínica: ilimitado)
- Estado vazio com CTA para adicionar

### Pacientes
- Cadastrar, editar e desativar pacientes por profissional
- Campos: nome, e-mail, telefone, data de nascimento
- Estado vazio com CTA

### Agenda Semanal
- Visualização semanal navegável (semana anterior / próxima)
- Criar consulta: selecionar paciente, data/hora, duração, status
- Atualizar status inline (confirmado, pendente, cancelado, remarcado)
- Validação de sobreposição de horários via função SQL
- Estado vazio por dia

### Financeiro
- Registrar lançamentos: descrição, valor, data, forma de pagamento, status
- Resumo mensal: total recebido e a receber
- Atualizar status inline (pago, pendente, atrasado)
- Número de recibo gerado automaticamente (`ANO/0001`) ao marcar como pago

### Recibo PDF
- Gerado via `@react-pdf/renderer`
- Download em `/profissionais/[id]/financeiro/[lancamentoId]/recibo`
- Layout com dados do profissional, paciente, serviço e valor

### AppLayout
- Sidebar fixa (240px) com navegação por profissional
- Header com breadcrumb dinâmico
- Design system com tokens CSS (verde #10B981, tipografia Inter)

---

## Como rodar localmente

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Configurar variáveis de ambiente

Crie `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Rodar migrations no Supabase

Cole o conteúdo de `supabase/migrations/000_all_migrations.sql` no SQL Editor do seu projeto Supabase e execute.

### 4. Habilitar Email provider

No painel Supabase: **Authentication → Providers → Email → Enable**

### 5. Iniciar o servidor

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## Planos e preços

| Plano | Preço | Limite de profissionais |
|---|---|---|
| Essencial | R$79/mês | 1 |
| Profissional | R$189/mês | até 5 |
| Clínica | R$449/mês | ilimitado |

Trial: 14 dias grátis, sem cartão.

---

## Próximas features (Roadmap)

- [ ] Stripe: checkout, webhook, portal do cliente
- [ ] E-mails automáticos (Resend): boas-vindas, trial expirando, pagamento
- [ ] Convênios por profissional
- [ ] Upload de documentos
- [ ] Relatórios mensais
- [ ] Integração Google Agenda
- [ ] PWA mobile
