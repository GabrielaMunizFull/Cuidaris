# QA

## Quando usar
Antes de marcar qualquer feature como pronta — criar checklist, identificar casos de borda, validar segurança multi-tenant.

---

## Definição de pronto

- [ ] Funciona no desktop (Chrome, Safari, Firefox)
- [ ] Funciona no mobile (iOS Safari, Android Chrome)
- [ ] RLS testado: usuária A não vê dados de usuária B
- [ ] Erros tratados com feedback visual claro
- [ ] Estado vazio definido e implementado
- [ ] Loading state implementado
- [ ] TypeScript sem erros (`tsc --noEmit`)
- [ ] Sem `console.log` esquecido

---

## Checklist de segurança

```
AUTENTICAÇÃO
- [ ] Rota protegida por middleware
- [ ] Sessão expirada redireciona para login
- [ ] Dados não vazam para usuário não autenticado

MULTI-TENANT (crítico)
- [ ] Criar usuária A e usuária B no Supabase
- [ ] Criar dados com usuária A
- [ ] Logar como usuária B
- [ ] Tentar acessar dados de A pela URL — deve retornar vazio ou 404

INPUTS
- [ ] Campos obrigatórios validados no frontend e no backend (Zod)
- [ ] XSS: testar com <script>alert('xss')</script> em campos de texto
- [ ] Valores extremos: nome longo, valor R$0, data no passado

STRIPE
- [ ] Webhook valida assinatura antes de processar
- [ ] Trial expirado bloqueia criação de novos profissionais
- [ ] Limite do plano respeitado no backend
```

---

## Casos de borda por módulo

**Agenda**
- [ ] Sessão no mesmo horário de outra
- [ ] Profissional sem nenhuma sessão (estado vazio)
- [ ] Cancelar sessão já paga

**Financeiro**
- [ ] Lançamento com valor R$0
- [ ] Dois lançamentos para o mesmo paciente no mesmo dia
- [ ] Gerar recibo de lançamento pendente (deve bloquear)

**Pacientes**
- [ ] Cadastrar sem e-mail (campo opcional)
- [ ] Dois pacientes com o mesmo nome no mesmo profissional
- [ ] Deletar paciente com sessões futuras

**Planos**
- [ ] Adicionar 2º profissional no plano Essencial (deve bloquear)
- [ ] Upgrade de plano libera criação imediata
- [ ] Downgrade com mais profissionais que o limite

---

## Template de teste manual

```
FEATURE: [nome]
DATA: [data]
AMBIENTE: local | staging | produção
NAVEGADOR: Chrome / Safari / Firefox
DISPOSITIVO: desktop / mobile

CASOS TESTADOS:
✓ Caminho feliz: [descrever]
✓ Caminho de erro: [descrever]
✓ Estado vazio: [descrever]
✓ Multi-tenant: usuária B não vê dados de A
✓ Mobile: layout funciona

BUGS ENCONTRADOS:
- [bug]

STATUS: aprovado | reprovado | aprovado com ressalvas
```
