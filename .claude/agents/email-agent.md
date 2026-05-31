# Agente — E-mails (Resend)

## Quando usar este agente
Criar templates de e-mail, configurar envios automáticos e
implementar notificações do Cuidaris.

## Setup

```bash
pnpm add resend @react-email/components
```

```typescript
// lib/email.ts
import { Resend } from 'resend';
export const resend = new Resend(process.env.RESEND_API_KEY);
```

## E-mails a implementar

| Trigger | Assunto |
|---|---|
| Signup | Bem-vinda ao Cuidaris 🎉 |
| Trial expirando (3 dias antes) | Seu período grátis termina em breve |
| Trial expirado | Escolha seu plano para continuar |
| Pagamento aprovado | Assinatura ativada com sucesso |
| Pagamento falhou | Problema com seu pagamento |
| Recibo gerado | Recibo disponível — [Paciente] |

## Template base

```tsx
// packages/emails/src/components/Layout.tsx
import {
  Html, Head, Body, Container, Img,
  Text, Hr, Link
} from '@react-email/components';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F6F8FA', fontFamily: 'Inter, sans-serif' }}>
        <Container style={{
          maxWidth: 560,
          margin: '40px auto',
          backgroundColor: '#FFFFFF',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,.08)',
        }}>
          {/* Header verde */}
          <div style={{ backgroundColor: '#10B981', padding: '24px 32px' }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>
              Cuidaris
            </Text>
          </div>

          {/* Conteúdo */}
          <div style={{ padding: '32px' }}>
            {children}
          </div>

          {/* Footer */}
          <Hr style={{ borderColor: '#E8ECF1' }} />
          <div style={{ padding: '16px 32px', textAlign: 'center' }}>
            <Text style={{ fontSize: 12, color: '#94A3B8' }}>
              Cuidaris · contato@cuidaris.com.br ·{' '}
              <Link href="https://cuidaris.com.br">cuidaris.com.br</Link>
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
}
```

## Enviar e-mail

```typescript
// Exemplo: e-mail de boas-vindas
await resend.emails.send({
  from: 'Cuidaris <oi@cuidaris.com.br>',
  to: assistente.email,
  subject: 'Bem-vinda ao Cuidaris 🎉',
  react: <BemVindaEmail nome={assistente.nome} />,
});
```

## Regras

- Sempre enviar de `@cuidaris.com.br` — configurar domínio no Resend
- Sempre incluir link de descadastro no footer
- Textos em português brasileiro
- Máximo 1 e-mail de marketing por semana por usuária
- E-mails transacionais (recibo, pagamento) não têm limite
