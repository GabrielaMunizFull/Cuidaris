# Cuidaris — Schema do Banco de Dados

## Supabase / PostgreSQL com RLS

---

## Tabelas principais

### assistentes
Usuária logada — criada automaticamente no signup via Supabase Auth.

```sql
create table assistentes (
  id uuid primary key references auth.users(id),
  nome text not null,
  email text not null,
  plano text not null default 'essencial', -- essencial | profissional | clinica
  stripe_customer_id text,
  stripe_subscription_id text,
  trial_ends_at timestamptz default now() + interval '14 days',
  created_at timestamptz default now()
);
```

### profissionais
Cada profissional de saúde gerenciado pela assistente.

```sql
create table profissionais (
  id uuid primary key default gen_random_uuid(),
  assistente_id uuid not null references assistentes(id) on delete cascade,
  nome text not null,
  especialidade text not null, -- psicologa | nutricionista | fisioterapeuta | medico | outro
  registro_tipo text not null, -- CRP | CRN | CREFITO | CRM | outro
  registro_numero text not null,
  email text,
  telefone text,
  cor text default '#10B981', -- cor do avatar
  ativo boolean default true,
  created_at timestamptz default now()
);

-- RLS: assistente só vê seus profissionais
alter table profissionais enable row level security;
create policy "assistente vê seus profissionais"
  on profissionais for all
  using (assistente_id = auth.uid());
```

### pacientes

```sql
create table pacientes (
  id uuid primary key default gen_random_uuid(),
  profissional_id uuid not null references profissionais(id) on delete cascade,
  assistente_id uuid not null references assistentes(id),
  nome text not null,
  email text,
  telefone text,
  data_nascimento date,
  convenio_id uuid references convenios(id),
  numero_carteirinha text,
  observacoes text,
  ativo boolean default true,
  created_at timestamptz default now()
);

alter table pacientes enable row level security;
create policy "assistente vê seus pacientes"
  on pacientes for all
  using (assistente_id = auth.uid());
```

### agenda

```sql
create table agenda (
  id uuid primary key default gen_random_uuid(),
  profissional_id uuid not null references profissionais(id) on delete cascade,
  assistente_id uuid not null references assistentes(id),
  paciente_id uuid references pacientes(id),
  titulo text,
  data_hora timestamptz not null,
  duracao_minutos int default 50,
  status text not null default 'pendente', -- confirmado | pendente | cancelado | remarcado
  valor decimal(10,2),
  convenio_id uuid references convenios(id),
  observacoes text,
  created_at timestamptz default now()
);

alter table agenda enable row level security;
create policy "assistente vê sua agenda"
  on agenda for all
  using (assistente_id = auth.uid());
```

### lancamentos (financeiro)

```sql
create table lancamentos (
  id uuid primary key default gen_random_uuid(),
  profissional_id uuid not null references profissionais(id) on delete cascade,
  assistente_id uuid not null references assistentes(id),
  paciente_id uuid references pacientes(id),
  agenda_id uuid references agenda(id),
  data date not null,
  valor decimal(10,2) not null,
  forma_pagamento text, -- pix | cartao | dinheiro | transferencia | convenio
  convenio_id uuid references convenios(id),
  status text not null default 'pendente', -- pago | pendente | atrasado
  recibo_numero text unique,
  recibo_gerado_em timestamptz,
  observacoes text,
  created_at timestamptz default now()
);

alter table lancamentos enable row level security;
create policy "assistente vê seus lançamentos"
  on lancamentos for all
  using (assistente_id = auth.uid());
```

### convenios

```sql
create table convenios (
  id uuid primary key default gen_random_uuid(),
  profissional_id uuid not null references profissionais(id) on delete cascade,
  assistente_id uuid not null references assistentes(id),
  nome text not null, -- Unimed | Bradesco Saúde | SulAmérica | Amil | Particular
  valor_sessao decimal(10,2),
  ativo boolean default true,
  created_at timestamptz default now()
);

alter table convenios enable row level security;
create policy "assistente vê seus convênios"
  on convenios for all
  using (assistente_id = auth.uid());
```

### documentos

```sql
create table documentos (
  id uuid primary key default gen_random_uuid(),
  profissional_id uuid not null references profissionais(id) on delete cascade,
  assistente_id uuid not null references assistentes(id),
  nome text not null,
  tipo text, -- recibo | contrato | declaracao | outro
  storage_path text not null,
  created_at timestamptz default now()
);

alter table documentos enable row level security;
create policy "assistente vê seus documentos"
  on documentos for all
  using (assistente_id = auth.uid());
```

---

## Regras importantes

- RLS ativo em TODAS as tabelas — nunca desativar
- `assistente_id` sempre preenchido no insert via `auth.uid()`
- Soft delete via campo `ativo` — nunca deletar registros de pacientes/profissionais
- Recibo gerado automaticamente ao marcar lançamento como `pago`
- Número do recibo: formato `ANO/SEQUENCIAL` ex: `2026/0001`
