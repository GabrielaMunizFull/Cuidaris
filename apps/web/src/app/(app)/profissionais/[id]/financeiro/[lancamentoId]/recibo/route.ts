import { NextResponse } from "next/server";
import { createElement } from "react";
import { createClient } from "@/lib/supabase/server";
import { Recibo, renderToBuffer } from "@cuidaris/pdf";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; lancamentoId: string }> }
) {
  const { id: profissionalId, lancamentoId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Não autorizado", { status: 401 });

  const { data: assistente } = await supabase
    .from("assistentes")
    .select("nome")
    .eq("id", user.id)
    .single();

  const { data: lanc } = await supabase
    .from("lancamentos")
    .select("id, descricao, valor, data, forma_pagamento, numero_recibo, paciente:pacientes(nome), profissional:profissionais(nome, especialidade, registro)")
    .eq("id", lancamentoId)
    .eq("profissional_id", profissionalId)
    .eq("assistente_id", user.id)
    .eq("status", "pago")
    .single();

  if (!lanc || !lanc.numero_recibo) {
    return new NextResponse("Recibo não disponível", { status: 404 });
  }

  const profissional = lanc.profissional as unknown as { nome: string; especialidade: string; registro: string | null } | null;
  const paciente = lanc.paciente as unknown as { nome: string } | null;

  const element = createElement(Recibo, {
    numero: lanc.numero_recibo,
    data: lanc.data,
    pacienteNome: paciente?.nome ?? "—",
    profissionalNome: profissional?.nome ?? "—",
    profissionalRegistro: profissional?.registro,
    profissionalEspecialidade: profissional?.especialidade ?? "—",
    descricao: lanc.descricao,
    valor: lanc.valor,
    formaPagamento: lanc.forma_pagamento,
    assistenteNome: assistente?.nome ?? "—",
  }) as unknown as Parameters<typeof renderToBuffer>[0];

  const buffer = await renderToBuffer(element);

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="recibo-${lanc.numero_recibo.replace("/", "-")}.pdf"`,
    },
  });
}
