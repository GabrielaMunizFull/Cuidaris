# Documentation

## Quando usar
Escrever docs técnicos, guias de onboarding para código, changelogs internos, comentários de decisão de arquitetura, READMEs.

---

## O que documentar (e o que não documentar)

**Documentar:**
- Decisões não óbvias e o porquê delas
- Fluxos com múltiplos sistemas (Stripe + Supabase + Resend)
- Configurações de ambiente e variáveis obrigatórias
- Migrações de banco e ordem de execução
- Limitações conhecidas e workarounds

**Não documentar:**
- O que o código já diz pelo nome das funções
- Fluxos triviais (CRUD básico)
- Comentários que repetem o código

---

## Comentários no código

Escrever apenas quando o **porquê** não é óbvio:

```typescript
// RLS não filtra por profissional_id aqui — o join já garante o isolamento
const { data } = await supabase
  .from('agenda')
  .select('*, profissionais!inner(assistente_id)')
  .eq('profissionais.assistente_id', user.id);

// cache() memoiza por request — evita N queries em Server Components paralelos
export const getProfissionais = cache(async () => { ... });
```

---

## README de pacote/feature

```markdown
## [Nome do módulo]

O que faz em uma frase.

### Dependências
- [lib]: [por quê esta lib]

### Variáveis de ambiente
- `VAR_NAME`: descrição e onde obter

### Como usar
[exemplo mínimo funcional]

### Limitações conhecidas
- [limitação + workaround se houver]
```

---

## Changelog interno (entre commits)

```markdown
## [data] — [tipo: feat|fix|refactor]

**O que:** [o que mudou]
**Por quê:** [motivação — bug, pedido de usuária, débito técnico]
**Impacto:** [o que pode ter mudado de comportamento]
**Migrations:** [se houver, listar arquivos em ordem]
```

---

## Documentação de variáveis de ambiente

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=         # Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Dashboard > Settings > API
SUPABASE_SERVICE_ROLE_KEY=        # Apenas no servidor — nunca expor

# Stripe
STRIPE_SECRET_KEY=                # Dashboard > Developers > API keys
STRIPE_WEBHOOK_SECRET=            # Dashboard > Webhooks > signing secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Resend
RESEND_API_KEY=                   # resend.com > API Keys

# App
NEXT_PUBLIC_APP_URL=              # https://app.cuidaris.com.br em prod
```

---

## Checklist de documentação antes de merge

- [ ] Decisões não óbvias têm comentário com o porquê?
- [ ] Variáveis de ambiente novas documentadas no `.env.example`?
- [ ] Migration tem descrição no cabeçalho do arquivo?
- [ ] Comportamento de erro documentado se não for óbvio?
