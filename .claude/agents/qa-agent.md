# Agente — QA (Quality Assurance)

## Quando usar este agente
Antes de marcar qualquer feature como pronta. Use para:
- Criar checklist de testes para uma feature
- Identificar casos de borda
- Testar segurança e isolamento multi-tenant
- Validar fluxos de erro
- Garantir que nada quebrou com uma mudança

---

## Definição de pronto (DoD)

Uma feature só está pronta quando:
- [ ] Funciona no desktop (Chrome, Safari, Firefox)
- [ ] Funciona no mobile (iOS Safari, Android Chrome)
- [ ] RLS testado: usuária A não vê dados de usuária B
- [ ] Erros tratados com feedback visual claro
- [ ] Estado vazio definido e implementado
- [ ] Loading state implementado (sem tela em branco)
- [ ] TypeScript sem erros (`tsc --noEmit`)
- [ ] Sem `console.log` esquecido no código

---

## Checklist de segurança (rodar em toda feature)

```
AUTENTICAÇÃO
- [ ] Rota protegida por middleware
- [ ] Sessão expirada redireciona para login
- [ ] Dados não vazam para usuário não autenticado

MULTI-TENANT (crítico)
- [ ] Criar usuária A e usuária B no Supabase
- [ ] Criar profissional/paciente com usuária A
- [ ] Logar como usuária B
- [ ] Tentar acessar dados da usuária A diretamente pela URL
- [ ] Confirmar que retorna vazio ou 404, nunca dados reais

INPUTS
- [ ] Campos obrigatórios validados no frontend
- [ ] Validação com Zod no backend também
- [ ] XSS: testar com <script>alert('xss')</script> em campos de texto
- [ ] Valores extremos: nome com 1000 caracteres, valor R$0, data no passado

STRIPE
- [ ] Webhook valida assinatura antes de processar
- [ ] Trial expirado bloqueia criação de novos profissionais
- [ ] Limite do plano é respeitado no backend (não só frontend)
```

---

## Casos de borda por módulo

### Agenda
- [ ] Criar sessão no horário exato de outra sessão
- [ ] Sessão às 23:59 (virada de dia)
- [ ] Profissional sem nenhuma sessão (estado vazio)
- [ ] Semana sem sessões confirmadas
- [ ] Cancelar sessão já paga (o lançamento some?)

### Financeiro
- [ ] Lançamento com valor R$0
- [ ] Dois lançamentos para o mesmo paciente no mesmo dia
- [ ] Gerar recibo de lançamento pendente (deve bloquear)
- [ ] Recibo com nome de paciente muito longo

### Pacientes
- [ ] Cadastrar paciente sem e-mail (campo opcional)
- [ ] Dois pacientes com o mesmo nome no mesmo profissional
- [ ] Paciente inativo aparece na agenda? (não deve)
- [ ] Deletar paciente com sessões futuras

### Planos e limites
- [ ] Adicionar 2º profissional no plano Essencial (deve bloquear)
- [ ] Upgrade de plano libera criação imediata
- [ ] Downgrade de plano com mais profissionais que o limite (o que acontece?)

---

## Template de teste manual

```
FEATURE: [nome da feature]
DATA: [data do teste]

AMBIENTE: local | staging | produção
NAVEGADOR: Chrome 125 / Safari 17 / Firefox 126
DISPOSITIVO: desktop / iPhone 15 / Android

CASOS TESTADOS:
✓ Caminho feliz: [descrever]
✓ Caminho de erro: [descrever]
✓ Estado vazio: [descrever]
✓ Multi-tenant: usuária B não vê dados de A
✓ Mobile: layout funciona em tela pequena

BUGS ENCONTRADOS:
- [bug 1]
- [bug 2]

STATUS: aprovado | reprovado | aprovado com ressalvas
```

---

## Testes automatizados (Vitest)

```typescript
// __tests__/recibo.test.ts
import { describe, it, expect } from 'vitest';
import { gerarNumeroRecibo } from '@/lib/recibo';

describe('gerarNumeroRecibo', () => {
  it('formata corretamente no padrão ANO/SEQUENCIAL', () => {
    expect(gerarNumeroRecibo(2026, 1)).toBe('2026/0001');
    expect(gerarNumeroRecibo(2026, 42)).toBe('2026/0042');
    expect(gerarNumeroRecibo(2026, 1000)).toBe('2026/1000');
  });
});
```

---

## Testes E2E (Playwright — fase 2)

```typescript
// e2e/multi-tenant.spec.ts
test('usuária B não vê pacientes de A', async ({ browser }) => {
  const contextA = await browser.newContext();
  const contextB = await browser.newContext();

  // Logar A, criar paciente
  const pageA = await contextA.newPage();
  await loginAs(pageA, 'a@teste.com');
  await criarPaciente(pageA, 'Paciente Secreto');

  // Logar B, confirmar que não vê
  const pageB = await contextB.newPage();
  await loginAs(pageB, 'b@teste.com');
  await pageB.goto('/pacientes');
  await expect(pageB.getByText('Paciente Secreto')).not.toBeVisible();
});
```
