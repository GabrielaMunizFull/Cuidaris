Cria pull request com título e descrição gerados automaticamente do diff atual.

## Processo

1. Analisa `git diff main...HEAD` e `git log main...HEAD`
2. Gera título conciso (≤ 70 chars) e descrição estruturada
3. Faz push da branch se necessário
4. Cria PR via `gh pr create`

## Formato da descrição

```
## O que mudou
- [bullet com o que foi feito]

## Por que
[motivação — bug, feature, melhoria]

## Como testar
- [ ] [passo 1]
- [ ] [passo 2]
- [ ] Multi-tenant: usuária B não vê dados de A (se aplicável)
```

Não cria PR se houver uncommitted changes — avisa e para.
Não faz push para main diretamente — sempre cria branch + PR.
