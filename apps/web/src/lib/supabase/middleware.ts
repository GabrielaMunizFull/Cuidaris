import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rotas do app que exigem autenticação
const APP_PREFIXES = [
  "/dashboard",
  "/profissionais",
  "/pacientes",
  "/agenda",
  "/financeiro",
  "/relatorios",
  "/planos",
  "/configuracoes",
];

// Rotas acessíveis mesmo com assinatura vencida
const SEMPRE_ACESSIVEIS = [
  "/planos",
  "/configuracoes",
  "/acesso-suspenso",
];

// Prefixos de API que o middleware ignora (webhooks, portais, etc.)
const API_IGNORADAS = ["/api/stripe", "/api/emails", "/api/relatorios"];

function isAppRoute(pathname: string) {
  return APP_PREFIXES.some((p) => pathname.startsWith(p));
}

function isAuthRoute(pathname: string) {
  return pathname.startsWith("/login") || pathname.startsWith("/cadastro");
}

function isSempreAcessivel(pathname: string) {
  return SEMPRE_ACESSIVEIS.some((p) => pathname.startsWith(p));
}

function isApiIgnorada(pathname: string) {
  return API_IGNORADAS.some((p) => pathname.startsWith(p));
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: unknown }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<(typeof supabaseResponse.cookies)["set"]>[2])
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Deixa APIs passarem sem verificação adicional
  if (isApiIgnorada(pathname)) return supabaseResponse;

  // Usuário não autenticado tentando acessar app → login
  if (!user && isAppRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Usuário autenticado em rota de auth → dashboard
  if (user && isAuthRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Gate de assinatura — só verificado em rotas do app, exceto as sempre acessíveis
  if (user && isAppRoute(pathname) && !isSempreAcessivel(pathname)) {
    const { data: assistente } = await supabase
      .from("assistentes")
      .select("status_assinatura")
      .eq("id", user.id)
      .single();

    const status = assistente?.status_assinatura;
    const bloqueado = status === "inadimplente" || status === "cancelado";

    if (bloqueado) {
      const url = request.nextUrl.clone();
      url.pathname = "/acesso-suspenso";
      url.searchParams.set("motivo", status);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
