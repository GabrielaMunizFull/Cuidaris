# Agente — Autenticação e Multi-tenant

## Quando usar este agente
Implementar login, signup, proteção de rotas, middleware e
qualquer lógica relacionada a isolamento de dados por assistente.

## Supabase Auth

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => cookieStore.set(name, value, options),
        remove: (name, options) => cookieStore.delete({ name, ...options }),
      },
    }
  );
}
```

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

## Middleware de proteção de rotas

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* ... */ } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Redirecionar não autenticados para login
  if (!user && request.nextUrl.pathname.startsWith('/(app)')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirecionar autenticados para fora do login
  if (user && ['/login', '/cadastro'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## Signup com criação de assistente

```typescript
// app/(auth)/cadastro/actions.ts
'use server';

export async function cadastrar(formData: FormData) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('senha') as string,
    options: {
      data: { nome: formData.get('nome') as string }
    }
  });

  if (error) return { error: error.message };

  // Criar registro na tabela assistentes
  // (também pode ser feito via trigger no Supabase)
  await supabase.from('assistentes').insert({
    id: data.user!.id,
    nome: formData.get('nome') as string,
    email: data.user!.email!,
  });

  redirect('/');
}
```

## Verificar plano e trial

```typescript
// lib/plano.ts
export async function getAssistente() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('assistentes')
    .select('*')
    .eq('id', user.id)
    .single();

  return data;
}

export function isTrialAtivo(assistente: Assistente): boolean {
  return new Date(assistente.trial_ends_at) > new Date();
}

export function isAssinaturaAtiva(assistente: Assistente): boolean {
  return assistente.stripe_subscription_id !== null || isTrialAtivo(assistente);
}
```

## Isolamento multi-tenant (regra de ouro)

```
✓ RLS no Supabase garante isolamento no banco
✓ Middleware garante autenticação nas rotas
✓ Verificar plano antes de criar profissional (limite por plano)
✗ NUNCA usar service role key no client-side
✗ NUNCA bypassar RLS em produção
✗ NUNCA confiar só no frontend para limitar acesso
```
