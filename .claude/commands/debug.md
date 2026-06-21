Analisa um erro ou comportamento inesperado e sugere o fix.

## Como usar

Cole a mensagem de erro ou descreva o comportamento. O debug vai:

1. Identificar a origem do erro (stack trace, linha, arquivo)
2. Explicar a causa raiz em 1-2 frases
3. Propor o fix mínimo necessário
4. Apontar se há risco de regressão

## Formato de resposta

```
CAUSA: [o que está errado e por quê]
FIX: [o que mudar]
ARQUIVO: [caminho:linha]
RISCO: [nenhum | baixo | alto — e por quê]
```

## Prioridade de investigação

1. Erros de TypeScript → checar tipos e generics
2. Erros Supabase → checar RLS, policy, schema
3. Erros de hidratação Next.js → checar Server vs Client Component
4. Erros Stripe → checar webhook signature, event type
5. Erros de runtime → checar null/undefined, await faltando

Nunca sugere `as any` ou `// @ts-ignore` como fix permanente.
