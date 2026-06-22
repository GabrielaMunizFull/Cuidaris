import { Resend } from "resend";
import { render } from "@react-email/render";
import { createElement } from "react";
import { BoasVindas } from "./templates/boas-vindas";
import { TrialExpirando } from "./templates/trial-expirando";
import { TrialExpirado } from "./templates/trial-expirado";
import { PagamentoConfirmado } from "./templates/pagamento-confirmado";
import { LembreteConsulta } from "./templates/lembrete-consulta";
import { Cancelamento } from "./templates/cancelamento";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = () => process.env.EMAIL_FROM ?? "noreply@cuidaris.com.br";
const APP_URL = () => process.env.NEXT_PUBLIC_APP_URL ?? "https://app.cuidaris.com.br";

async function sendEmail(to: string, subject: string, html: string) {
  const resend = getResend();
  await resend.emails.send({ from: FROM(), to, subject, html });
}

export async function sendBoasVindas(to: string, nome: string) {
  const html = await render(createElement(BoasVindas, { nome, appUrl: APP_URL() }));
  await sendEmail(to, `Bem-vinda ao Cuidaris, ${nome}!`, html);
}

export async function sendTrialExpirando(
  to: string,
  nome: string,
  diasRestantes: number
) {
  const html = await render(
    createElement(TrialExpirando, { nome, diasRestantes, appUrl: APP_URL() })
  );
  const plural = diasRestantes === 1 ? "dia" : "dias";
  await sendEmail(to, `Seu período gratuito termina em ${diasRestantes} ${plural}`, html);
}

export async function sendLembreteConsulta(
  to: string,
  nomePaciente: string,
  nomeProfissional: string,
  especialidade: string,
  dataHora: string
) {
  const html = await render(
    createElement(LembreteConsulta, { nomePaciente, nomeProfissional, especialidade, dataHora })
  );
  await sendEmail(to, `Lembrete: consulta hoje com ${nomeProfissional}`, html);
}

export async function sendTrialExpirado(to: string, nome: string) {
  const html = await render(createElement(TrialExpirado, { nome, appUrl: APP_URL() }));
  await sendEmail(to, "Seu acesso ao Cuidaris foi suspenso", html);
}

export async function sendPagamentoConfirmado(to: string, nome: string, plano: string) {
  const html = await render(
    createElement(PagamentoConfirmado, { nome, plano, appUrl: APP_URL() })
  );
  await sendEmail(to, "Pagamento confirmado — Cuidaris", html);
}

export async function sendCancelamento(to: string, nome: string) {
  const html = await render(createElement(Cancelamento, { nome, appUrl: APP_URL() }));
  await sendEmail(to, "Assinatura do Cuidaris cancelada", html);
}
