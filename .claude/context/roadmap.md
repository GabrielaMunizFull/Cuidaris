# Cuidaris — Roadmap do MVP

## Objetivo do MVP
Validar o produto com betas reais antes de investir em features avançadas.
Entregar o mínimo que resolve o problema central da assistente virtual.

---

## Fase 1 — MVP (semanas 1–4)

### Must have (sem isso não lança)
- [ ] Auth: signup, login, logout
- [ ] Onboarding: cadastrar primeiro profissional
- [ ] Cadastro de pacientes por profissional
- [ ] Agenda semanal básica (criar, editar, status)
- [ ] Dashboard com resumo (consultas hoje, pendências)
- [ ] Financeiro: lançamentos + status pago/pendente
- [ ] Geração de recibo em PDF
- [ ] Stripe: trial 14 dias + checkout dos 3 planos

### Should have (importante mas não bloqueia)
- [ ] Sidebar com navegação por profissional
- [ ] Busca global (paciente, recibo)
- [ ] Notificações de pendências
- [ ] Responsivo mobile

---

## Fase 2 — Pós-validação (semanas 5–8)

- [ ] Convênios por profissional
- [ ] Documentos (upload e listagem)
- [ ] Relatórios financeiros (por mês, por profissional)
- [ ] E-mails automáticos (trial expirando, pagamento)
- [ ] Portal do cliente Stripe
- [ ] Integração Google Agenda

---

## Fase 3 — Escala (semanas 9–12)

- [ ] Integração WhatsApp Business (lembretes)
- [ ] App mobile (PWA primeiro, depois nativo)
- [ ] Multi-assistente por clínica (plano Clínica)
- [ ] API pública para integrações

---

## Ordem de desenvolvimento recomendada

```
1. Setup do monorepo (Turborepo + Next.js + Supabase)
2. Auth completo (login, signup, middleware)
3. Schema do banco + migrations + RLS
4. Layout do app (sidebar, header, navegação)
5. CRUD de profissionais
6. CRUD de pacientes
7. Agenda (visualização semanal + criar sessão)
8. Financeiro (lançamentos + status)
9. Geração de recibo PDF
10. Stripe (trial + planos + webhook)
11. Dashboard (cards de resumo)
12. Polish + testes + deploy
```

---

## Definição de pronto (DoD)

Uma feature está pronta quando:
- [ ] Funciona no desktop e no mobile
- [ ] RLS testado (usuária A não vê dados de usuária B)
- [ ] Erros tratados com feedback visual para a usuária
- [ ] TypeScript sem erros
- [ ] Dados fictícios realistas nos testes

---

## Stack de testes

```bash
# Unitários e integração
pnpm add -D vitest @testing-library/react

# E2E (fase 2)
pnpm add -D playwright
```
