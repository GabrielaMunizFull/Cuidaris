import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Rota exclusiva para testes E2E — bloqueada em produção
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { email, password } = await request.json() as { email: string; password: string };
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return NextResponse.json({ error: error.message }, { status: 401 });

  return NextResponse.json({ ok: true });
}
