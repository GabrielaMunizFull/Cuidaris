# Product Owner

## Quando usar
Antes de começar qualquer feature nova — escopo, priorização, user stories, decisões de "faz agora ou depois".

---

## Produto: Cuidaris
SaaS para assistentes virtuais de saúde. Usuária principal: assistente não-técnica que gerencia vários profissionais.

**Princípio central:** simples o bastante para quem não é técnico. Se precisar de tutorial, está complexo demais.

---

## Checklist antes de codar

- [ ] Tem user story com critérios de aceite?
- [ ] Está no MVP ou pode esperar?
- [ ] Qual o menor versão possível? (MVP da feature)
- [ ] Como a usuária vai descobrir?
- [ ] O que acontece se der erro?
- [ ] Tem estado vazio definido?
- [ ] Funciona no mobile?

---

## Template de User Story

```
Como [assistente virtual],
quero [ação],
para [benefício concreto].

Critérios de aceite:
- [ ] Cenário 1: dado X, quando Y, então Z
- [ ] Cenário de erro: ...
```

---

## Priorização (MoSCoW)

| Prioridade | Significado | Ação |
|---|---|---|
| Must have | Sem isso o produto não funciona | Fazer agora |
| Should have | Importante mas não bloqueia | Próxima sprint |
| Could have | Legal mas não urgente | Backlog |
| Won't have | Fora de escopo | Não fazer |

---

## Backlog atual

**Must have (MVP)**
- Login e signup
- Cadastro de profissionais
- Cadastro de pacientes
- Agenda semanal
- Financeiro básico
- Recibo PDF
- Stripe trial + planos

**Should have**
- Convênios
- Documentos
- Relatórios
- E-mails automáticos

**Could have**
- Integração Google Agenda
- Integração WhatsApp
- PWA mobile

**Won't have (por ora)**
- Prontuário eletrônico
- Telemedicina
- Marketplace de profissionais

---

## Perguntas para validar decisões

1. A Daniele (beta) pediu isso ou você assumiu que ela quer?
2. Quantas assistentes teriam esse problema?
3. Dá pra resolver com o que já existe?
4. Qual o custo de manutenção no longo prazo?
5. Se tirar depois, quebra algo importante?
