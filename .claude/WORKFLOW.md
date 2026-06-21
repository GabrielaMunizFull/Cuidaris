# Fluxos de Trabalho — Cuidaris

Guia rápido de qual agente usar e em que ordem para cada tipo de tarefa.

---

## Feature nova

```
1. product-owner  → escopo, user story, critérios de aceite
2. design         → fluxo de telas, copy, estados vazios
3. tech-lead      → decisão de arquitetura (se houver dúvida)
4. developer      → implementação
5. qa             → checklist de testes, casos de borda
6. documentation  → comentários, env vars, changelog interno
7. marketing      → changelog público (opcional)
```

## Bug fix

```
1. developer      → investigar e corrigir
2. qa             → confirmar correção + checar regressão
3. documentation  → comentário se a causa não for óbvia
```

## Mudança de banco (migration)

```
1. tech-lead      → validar abordagem
2. developer      → escrever migration com RLS
3. qa             → testar isolamento multi-tenant
```

## Módulo completo (ex: relatórios, WhatsApp)

```
1. product-owner  → escopo e backlog do módulo
2. data           → avaliar schema, métricas a capturar
3. design         → fluxo de telas
4. tech-lead      → estrutura de pastas, decisões técnicas
5. developer      → implementação iterativa por feature
6. qa             → testes por feature, multi-tenant
7. documentation  → docs técnicos
8. marketing      → comunicação
```

---

## Referência rápida

| Situação | Agente |
|---|---|
| "Devo fazer X ou Y?" | tech-lead |
| "Como implemento isso?" | developer |
| "Essa feature faz sentido agora?" | product-owner |
| "Como fica a tela / qual o texto?" | design |
| "O que pode quebrar?" | qa |
| "Como comunico essa feature?" | marketing |
| "Quais métricas acompanhar / schema aguenta?" | data |
| "O que documentar aqui?" | documentation |
