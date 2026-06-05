# Cuidaris — Guia de Produto

## O que é

Cuidaris é um SaaS para **assistentes virtuais de profissionais de saúde**.

A usuária principal é a assistente — não o profissional. Ela gerencia múltiplos profissionais (psicólogos, nutricionistas, fisioterapeutas, médicos) em um único painel, sem precisar alternar entre sistemas ou planilhas.

**Princípio central:** simples o bastante para quem não é técnico. Se uma feature precisar de tutorial, está complexa demais.

---

## Persona

**Assistente virtual autônoma** que presta serviços para 1 a 10+ profissionais de saúde.

Dores que o Cuidaris resolve:
- Agenda espalhada em WhatsApp e papel
- Controle financeiro em planilha desatualizada
- Recibos emitidos manualmente um a um
- Sem visão consolidada de todos os profissionais

---

## Módulos

### Dashboard

Visão consolidada de todos os profissionais.

- Cards de estatística: consultas hoje, recebido no mês, pacientes ativos, pendências
- Grid de profissionais com status rápido
- Lista de pendências (consultas não confirmadas, pagamentos em atraso)

---

### Profissionais

Cada profissional tem um espaço isolado com suas próprias abas.

**Dados cadastrados:** nome, especialidade, registro (CRP/CRN/CRM/CREFITO), e-mail, telefone.

**Abas por profissional:**
- Pacientes
- Agenda
- Financeiro
- Convênios

---

### Pacientes

Cadastro de pacientes vinculados a um profissional.

**Dados:** nome, e-mail, telefone, data de nascimento, convênio, número de carteirinha, observações.

- Soft delete: pacientes desativados não aparecem na lista, mas os dados são preservados
- Campo e-mail é opcional

---

### Agenda

Agendamento de consultas por profissional.

**Campos:** paciente, data/horário, duração (30/50/60/90/120 min), status, observações.

**Status possíveis:**

| Status | Cor |
|---|---|
| Confirmado | Verde |
| Pendente | Amarelo |
| Cancelado | Vermelho |
| Remarcado | Azul |

---

### Financeiro

Controle de lançamentos financeiros por profissional e visão global consolidada.

**Campos:** descrição, valor, data, forma de pagamento, status, paciente (opcional).

**Formas de pagamento:** PIX, Dinheiro, Cartão de Crédito, Cartão de Débito, Transferência, Convênio.

**Status:** Pago, Pendente, Atrasado.

Ao marcar um lançamento como pago, o recibo é gerado automaticamente em PDF com número sequencial no formato `ANO/SEQUENCIAL` (ex: `2026/0001`).

---

### Convênios

Convênios aceitos por profissional, com valor padrão de sessão opcional.

- Vinculado a pacientes e lançamentos
- Soft delete: desativar sem perder histórico

---

### Relatórios

Visão financeira por mês com seletor de período. Consolidado por profissional.

---

### Planos

Trial de 14 dias grátis, sem cartão. Ao expirar, banner de upgrade é exibido.

| Plano | Preço | Profissionais |
|---|---|---|
| Essencial | R$79/mês | 1 |
| Profissional | R$189/mês | até 5 |
| Clínica | R$449/mês | ilimitado |

Gerenciamento da assinatura (trocar plano, cancelar, atualizar cartão) via portal do Stripe em `/configuracoes`.

---

## Segurança e isolamento

Cada assistente vê apenas os dados que ela criou. O isolamento é garantido por **Row Level Security (RLS)** no Supabase — não é possível acessar dados de outra assistente nem mesmo por URL direta.

---

## Roadmap resumido

**Fase 1 — MVP (entregue)**
Auth, profissionais, pacientes, agenda, financeiro, PDF, Stripe.

**Fase 2 — Pós-validação**
Convênios ✓, relatórios ✓, documentos, e-mails automáticos, integração Google Agenda.

**Fase 3 — Escala**
WhatsApp Business, PWA mobile, API pública.
