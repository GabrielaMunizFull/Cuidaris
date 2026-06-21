import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const FORMAS: Record<string, string> = {
  dinheiro: "Dinheiro",
  pix: "PIX",
  cartao_credito: "Cartão de Crédito",
  cartao_debito: "Cartão de Débito",
  transferencia: "Transferência",
  convenio: "Convênio",
};

const STATUS: Record<string, string> = {
  pago: "Pago",
  pendente: "Pendente",
  atrasado: "Atrasado",
};

function escapeCsv(value: string | number | null | undefined): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function row(cols: (string | number | null | undefined)[]) {
  return cols.map(escapeCsv).join(",");
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const hoje = new Date();
  const mes = Number(searchParams.get("mes") ?? hoje.getMonth() + 1);
  const ano = Number(searchParams.get("ano") ?? hoje.getFullYear());

  const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
  const fimDate = new Date(ano, mes, 0);
  const fim = `${ano}-${String(mes).padStart(2, "0")}-${String(fimDate.getDate()).padStart(2, "0")}`;

  const { data: lancamentos, error } = await supabase
    .from("lancamentos")
    .select("data, descricao, valor, forma_pagamento, status, numero_recibo, paciente:pacientes(nome), profissional:profissionais(nome)")
    .gte("data", inicio)
    .lte("data", fim)
    .order("data", { ascending: true });

  if (error) return NextResponse.json({ error: "Erro ao buscar dados." }, { status: 500 });

  const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const nomeArquivo = `relatorio-cuidaris-${MESES[mes - 1]?.toLowerCase()}-${ano}.csv`;

  const cabecalho = row(["Data", "Descrição", "Paciente", "Profissional", "Forma de Pagamento", "Status", "Valor (R$)", "Nº Recibo"]);

  const linhas = (lancamentos ?? []).map((l) =>
    row([
      l.data,
      l.descricao,
      (l.paciente as unknown as { nome: string } | null)?.nome ?? "",
      (l.profissional as unknown as { nome: string } | null)?.nome ?? "",
      FORMAS[l.forma_pagamento] ?? l.forma_pagamento,
      STATUS[l.status] ?? l.status,
      l.valor.toFixed(2).replace(".", ","),
      l.numero_recibo ?? "",
    ])
  );

  // BOM UTF-8 para Excel abrir corretamente
  const csv = "﻿" + [cabecalho, ...linhas].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${nomeArquivo}"`,
    },
  });
}
