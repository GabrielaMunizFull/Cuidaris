import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { createClient } from "@/lib/supabase/server";
import { Recibo } from "@cuidaris/pdf";

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
    .eq("status", "pago")
    .single();

  if (!lanc || !lanc.numero_recibo) {
    return new NextResponse("Recibo não disponível", { status: 404 });
  }

  const profissional = lanc.profissional as { nome: string; especialidade: string; registro: string | null } | null;
  const paciente = lanc.paciente as { nome: string } | null;

  const buffer = await renderToBuffer(
    createElement(Recibo, {
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
    })
  );

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="recibo-${lanc.numero_recibo.replace("/", "-")}.pdf"`,
    },
  });
}
