# Cuidaris — Referência do Banco de Dados

Supabase (PostgreSQL) com Row Level Security ativo em todas as tabelas.

---

## Diagrama de relações

```
assistentes (auth.users)
└── profissionais
    ├── pacientes
    │   └── convenio_id → convenios
    ├── agenda
    │   ├── paciente_id → pacientes
    │   └── convenio_id → convenios
    ├── lancamentos
    │   ├── paciente_id → pacientes
    │   ├── agenda_id  → agenda
    │   └── convenio_id → convenios
    ├── convenios
    └── documentos
```

---

## Tabelas

### `assistentes`

Usuária logada. Criada automaticamente no signup via Supabase Auth trigger.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid PK | Referência a `auth.users(id)` |
| `nome` | text | Nome da assistente |
| `email` | text | E-mail de login |
| `plano` | text | `essencial` \| `profissional` \| `clinica` |
| `stripe_customer_id` | text | ID do cliente no Stripe |
| `stripe_subscription_id` | text | ID da assinatura ativa |
| `trial_ends_at` | timestamptz | Expira 14 dias após o signup |
| `created_at` | timestamptz | — |

---

### `profissionais`

Cada profissional de saúde gerenciado pela assistente.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid PK | — |
| `assistente_id` | uuid FK | Referência a `assistentes(id)` |
| `nome` | text NOT NULL | Nome completo |
| `especialidade` | text NOT NULL | Psicóloga, Nutricionista, etc. |
| `registro_tipo` | text NOT NULL | CRP \| CRN \| CREFITO \| CRM \| outro |
| `registro_numero` | text NOT NULL | Ex: `06/12345` |
| `email` | text | E-mail profissional |
| `telefone` | text | — |
| `cor` | text | Cor do avatar (hex), default `#10B981` |
| `ativo` | boolean | Soft delete, default `true` |
| `created_at` | timestamptz | — |

**RLS:** assistente só vê seus próprios profissionais (`assistente_id = auth.uid()`).

---

### `pacientes`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid PK | — |
| `profissional_id` | uuid FK | Referência a `profissionais(id)` |
| `assistente_id` | uuid FK | Referência a `assistentes(id)` |
| `nome` | text NOT NULL | — |
| `email` | text | Opcional |
| `telefone` | text | — |
| `data_nascimento` | date | — |
| `convenio_id` | uuid FK | Referência a `convenios(id)` |
| `numero_carteirinha` | text | — |
| `observacoes` | text | — |
| `ativo` | boolean | Soft delete, default `true` |
| `created_at` | timestamptz | — |

**RLS:** `assistente_id = auth.uid()`.

---

### `agenda`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid PK | — |
| `profissional_id` | uuid FK | — |
| `assistente_id` | uuid FK | — |
| `paciente_id` | uuid FK | Opcional |
| `titulo` | text | Opcional, gerado automaticamente se vazio |
| `data_hora` | timestamptz NOT NULL | — |
| `duracao_minutos` | int | Default `50` |
| `status` | text | `confirmado` \| `pendente` \| `cancelado` \| `remarcado` |
| `valor` | decimal(10,2) | Valor cobrado nesta sessão |
| `convenio_id` | uuid FK | — |
| `observacoes` | text | — |
| `created_at` | timestamptz | — |

**RLS:** `assistente_id = auth.uid()`.

---

### `lancamentos`

Financeiro — cada recebimento registrado.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid PK | — |
| `profissional_id` | uuid FK | — |
| `assistente_id` | uuid FK | — |
| `paciente_id` | uuid FK | Opcional |
| `agenda_id` | uuid FK | Consulta vinculada, opcional |
| `data` | date NOT NULL | Data do recebimento |
| `descricao` | text NOT NULL | Ex: "Consulta", "Sessão" |
| `valor` | decimal(10,2) NOT NULL | — |
| `forma_pagamento` | text | `pix` \| `dinheiro` \| `cartao_credito` \| `cartao_debito` \| `transferencia` \| `convenio` |
| `convenio_id` | uuid FK | — |
| `status` | text | `pago` \| `pendente` \| `atrasado` |
| `recibo_numero` | text UNIQUE | Formato `ANO/SEQUENCIAL`, ex: `2026/0001` |
| `recibo_gerado_em` | timestamptz | Preenchido ao gerar o PDF |
| `observacoes` | text | — |
| `created_at` | timestamptz | — |

**RLS:** `assistente_id = auth.uid()`.

**Regra de negócio:** recibo gerado automaticamente ao marcar `status = 'pago'`.

---

### `convenios`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid PK | — |
| `profissional_id` | uuid FK | — |
| `assistente_id` | uuid FK | — |
| `nome` | text NOT NULL | Ex: Unimed, Bradesco Saúde, Particular |
| `valor_padrao` | decimal(10,2) | Valor padrão da sessão, opcional |
| `ativo` | boolean | Soft delete, default `true` |
| `created_at` | timestamptz | — |

**RLS:** `assistente_id = auth.uid()`.

---

### `documentos`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid PK | — |
| `profissional_id` | uuid FK | — |
| `assistente_id` | uuid FK | — |
| `nome` | text NOT NULL | Nome do arquivo |
| `tipo` | text | `recibo` \| `contrato` \| `declaracao` \| `outro` |
| `storage_path` | text NOT NULL | Caminho no Supabase Storage |
| `created_at` | timestamptz | — |

**RLS:** `assistente_id = auth.uid()`.

---

## Regras gerais

- **Nunca desativar RLS** em nenhuma tabela
- **`assistente_id` sempre preenchido** no insert via `auth.uid()` — nunca receber do frontend
- **Soft delete** via campo `ativo` em profissionais, pacientes e convênios — nunca `DELETE`
- **Sem `SELECT *`** em listas — sempre listar colunas explicitamente
- Números de recibo são únicos globalmente (constraint `UNIQUE`)

---

## Migrations

Ficam em `supabase/migrations/`. Ordem de aplicação:

```
001_initial_schema.sql
002_profissionais.sql
003_pacientes.sql
004_agenda.sql
005_financeiro.sql
006_convenios.sql
```
