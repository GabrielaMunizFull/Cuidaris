# Agente — Frontend (Next.js + Tailwind)

## Quando usar este agente
Criar ou editar componentes, páginas, layouts e estilos do app Cuidaris.

## Regras obrigatórias

1. **Tokens CSS** — nunca usar hex avulso, sempre variáveis CSS ou classes mapeadas
2. **Server Components por padrão** — só usar `'use client'` quando necessário
3. **Um botão verde primário por tela** — regra do design system
4. **Inter variable** — fonte única, importada via `next/font`
5. **Responsivo** — mobile-first, alvos de toque ≥ 44px
6. **TypeScript estrito** — sem `any`, sem `as unknown`

## Estrutura de páginas (App Router)

```
apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── cadastro/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx          ← sidebar + header
│   │   ├── page.tsx            ← dashboard (visão geral)
│   │   ├── agenda/page.tsx
│   │   ├── financeiro/page.tsx
│   │   └── [profissionalId]/
│   │       ├── pacientes/
│   │       ├── agenda/
│   │       ├── financeiro/
│   │       ├── convenios/
│   │       └── documentos/
│   └── api/
│       ├── stripe/webhook/
│       └── pdf/recibo/
├── components/
│   ├── ui/                     ← componentes base (Button, Badge, Card...)
│   ├── profissional/           ← componentes de domínio
│   ├── paciente/
│   ├── agenda/
│   └── financeiro/
└── lib/
    ├── supabase/
    │   ├── client.ts           ← cliente browser
    │   └── server.ts           ← cliente server
    └── utils.ts
```

## Template de componente

```typescript
// components/ui/Badge.tsx
import { cn } from '@/lib/utils';

type Status = 'confirmado' | 'pendente' | 'cancelado' | 'remarcado';

const STATUS_STYLES: Record<Status, string> = {
  confirmado: 'bg-[#ECFDF5] text-[#10B981]',
  pendente:   'bg-[#FFFBEB] text-[#F59E0B]',
  cancelado:  'bg-[#FEF2F2] text-[#EF4444]',
  remarcado:  'bg-[#EFF6FF] text-[#3B82F6]',
};

const STATUS_LABELS: Record<Status, string> = {
  confirmado: 'Confirmado',
  pendente:   'Pendente',
  cancelado:  'Cancelado',
  remarcado:  'Remarcado',
};

export function Badge({ status }: { status: Status }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
      STATUS_STYLES[status]
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}
```

## Template de página (Server Component)

```typescript
// app/(app)/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profissionais } = await supabase
    .from('profissionais')
    .select('*, pacientes(count), agenda(count)')
    .eq('ativo', true)
    .order('nome');

  return (
    <main className="p-[var(--pad)]">
      {/* conteúdo */}
    </main>
  );
}
```

## Cores Tailwind mapeadas

```javascript
// tailwind.config.ts
colors: {
  accent: 'var(--accent)',
  'accent-hover': 'var(--accent-hover)',
  'accent-soft': 'var(--accent-soft)',
  ink: 'var(--ink)',
  'ink-2': 'var(--ink-2)',
  'ink-3': 'var(--ink-3)',
  bg: 'var(--bg)',
  surface: 'var(--surface)',
  line: 'var(--line)',
}
```
