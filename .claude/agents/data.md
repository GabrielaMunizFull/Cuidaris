# Data

## Quando usar
Definir métricas, avaliar se o schema aguenta crescimento, pensar em relatórios, entender o comportamento das usuárias.

---

## Métricas que importam (norte estrela)

| Métrica | Por quê importa |
|---|---|
| Assistentes ativas (MAU) | Saúde do produto |
| Profissionais por assistente | Expansão de uso |
| Sessões agendadas/mês | Valor entregue |
| Taxa de trial → pago | Saúde do negócio |
| Churn mensal | Retenção |
| Tempo até 1ª sessão agendada | Onboarding eficaz |

---

## Eventos a rastrear (quando implementar analytics)

```
signup_completed
profissional_created
paciente_created
sessao_created
sessao_status_changed  { de, para }
lancamento_created
recibo_generated
trial_started
plan_upgraded          { de, para }
plan_downgraded        { de, para }
plan_cancelled
```

---

## Perguntas para avaliar o schema

- Essa tabela vai ter RLS? (sempre sim para dados do usuário)
- Soft delete necessário? (sim para pacientes, profissionais, lançamentos)
- Índice nos campos mais filtrados? (assistente_id, profissional_id, created_at)
- Vai precisar de paginação? (sim para agenda, lançamentos, pacientes)
- Esse dado cresce sem limite? (agenda e lançamentos — sempre paginar)

---

## Consultas úteis para entender uso

```sql
-- Assistentes com mais profissionais
select assistente_id, count(*) as total
from profissionais where ativo = true
group by assistente_id order by total desc;

-- Sessões por mês
select date_trunc('month', data) as mes, count(*) as total
from agenda
group by mes order by mes desc;

-- Taxa de conversão trial → pago
select
  count(*) filter (where trial_ends_at < now() and plano != 'trial') as convertidos,
  count(*) filter (where trial_ends_at < now()) as total_trials
from assistentes;
```

---

## Limites a monitorar

| Dado | Alerta |
|---|---|
| Profissionais por assistente | > 20 (incomum, checar) |
| Pacientes por profissional | > 500 (paginação crítica) |
| Lançamentos por mês | > 1000 (índice necessário) |
| Tamanho de PDF gerado | > 5MB (checar template) |
