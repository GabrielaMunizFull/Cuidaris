# Cuidaris — Pagamentos e Assinaturas (Stripe)

## Modelo de negócio
SaaS com assinatura mensal recorrente. Trial de 14 dias grátis sem cartão.

---

## Planos

| Plano | Price ID (produção) | Preço | Limite de profissionais |
|---|---|---|---|
| Essencial | `price_essencial_prod` | R$79/mês | 1 |
| Profissional | `price_profissional_prod` | R$189/mês | 5 |
| Clínica | `price_clinica_prod` | R$449/mês | ilimitado |

> Substituir Price IDs pelos reais ao criar no Stripe Dashboard.

---

## Variáveis de ambiente necessárias

```env
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Price IDs
STRIPE_PRICE_ESSENCIAL=price_...
STRIPE_PRICE_PROFISSIONAL=price_...
STRIPE_PRICE_CLINICA=price_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Resend
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=https://app.cuidaris.com.br
```

---

## Fluxo de assinatura

```
1. Signup → cria assistente com trial_ends_at = now() + 14 days
2. Trial expira → exibe banner de upgrade
3. Usuária escolhe plano → Stripe Checkout Session
4. Pagamento aprovado → webhook atualiza plano na tabela assistentes
5. Renovação mensal → automática via Stripe
6. Cancelamento → acesso até fim do período pago
```

---

## Webhooks a implementar

```typescript
// /api/stripe/webhook

switch (event.type) {
  case 'checkout.session.completed':
    // Ativa assinatura, atualiza plano
    break;

  case 'customer.subscription.updated':
    // Upgrade/downgrade de plano
    break;

  case 'customer.subscription.deleted':
    // Cancela acesso, mantém dados
    break;

  case 'invoice.payment_failed':
    // Envia email de cobrança falhou
    break;
}
```

**Importante:** sempre validar assinatura do webhook:
```typescript
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET!
);
```

---

## Limites por plano

```typescript
// packages/db/src/limits.ts
export const PLANO_LIMITES = {
  essencial: { profissionais: 1 },
  profissional: { profissionais: 5 },
  clinica: { profissionais: Infinity },
} as const;

// Verificar antes de criar profissional
export async function podeAdicionarProfissional(
  assistenteId: string
): Promise<boolean> {
  const { plano, count } = await getProfissionaisCount(assistenteId);
  return count < PLANO_LIMITES[plano].profissionais;
}
```

---

## Portal do cliente

```typescript
// Redireciona para portal Stripe (gerenciar assinatura, trocar cartão)
const session = await stripe.billingPortal.sessions.create({
  customer: assistente.stripe_customer_id,
  return_url: `${process.env.NEXT_PUBLIC_APP_URL}/configuracoes`,
});
redirect(session.url);
```
