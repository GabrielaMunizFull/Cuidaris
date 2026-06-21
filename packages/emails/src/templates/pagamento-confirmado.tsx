import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
  Hr,
  Preview,
} from "@react-email/components";
import React from "react";

interface PagamentoConfirmadoProps {
  nome: string;
  plano: string;
  appUrl: string;
}

const planoNome: Record<string, string> = {
  solo: "Solo",
  essencial: "Essencial",
  profissional: "Profissional",
  clinica: "Clínica",
};

const planoPreco: Record<string, string> = {
  solo: "R$49/mês",
  essencial: "R$79/mês",
  profissional: "R$189/mês",
  clinica: "R$449/mês",
};

export function PagamentoConfirmado({ nome, plano, appUrl }: PagamentoConfirmadoProps) {
  const nomePlano = planoNome[plano] ?? plano;
  const preco = planoPreco[plano] ?? "";

  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>Assinatura ativada! Bem-vinda ao plano {nomePlano}.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={logo}>Cuidaris</Text>

          <div style={successBadge}>✓ Pagamento confirmado</div>

          <Text style={heading}>Tudo certo, {nome}!</Text>
          <Text style={paragraph}>
            Sua assinatura do plano <strong>{nomePlano}</strong> está ativa. A cobrança
            de <strong>{preco}</strong> se repete automaticamente todo mês. Você pode
            gerenciar ou cancelar a qualquer momento.
          </Text>

          <div style={planCard}>
            <Text style={planLabel}>Plano ativo</Text>
            <Text style={planName}>{nomePlano}</Text>
            {preco && <Text style={planPrice}>{preco}</Text>}
          </div>

          <Button href={`${appUrl}/dashboard`} style={button}>
            Ir para o painel
          </Button>

          <Hr style={hr} />
          <Text style={footer}>
            Para gerenciar sua assinatura, acesse{" "}
            <a href={`${appUrl}/configuracoes`} style={link}>
              Configurações → Assinatura
            </a>
            . Dúvidas? Responda este e-mail.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#F6F8FA",
  fontFamily: "Inter, -apple-system, system-ui, sans-serif",
  margin: "0",
  padding: "0",
};

const container = {
  maxWidth: "520px",
  margin: "40px auto",
  backgroundColor: "#FFFFFF",
  borderRadius: "14px",
  border: "1px solid #E8ECF1",
  padding: "40px",
};

const logo = {
  fontSize: "20px",
  fontWeight: "700" as const,
  color: "#10B981",
  margin: "0 0 24px",
};

const successBadge = {
  display: "inline-block" as const,
  backgroundColor: "#ECFDF5",
  color: "#065F46",
  borderRadius: "8px",
  padding: "6px 12px",
  fontSize: "13px",
  fontWeight: "600" as const,
  marginBottom: "20px",
};

const heading = {
  fontSize: "22px",
  fontWeight: "700" as const,
  color: "#0F172A",
  margin: "0 0 12px",
};

const paragraph = {
  fontSize: "15px",
  color: "#475569",
  margin: "0 0 24px",
  lineHeight: "1.6",
};

const planCard = {
  backgroundColor: "#F6F8FA",
  borderRadius: "10px",
  border: "1px solid #E8ECF1",
  padding: "16px 20px",
  marginBottom: "4px",
};

const planLabel = {
  fontSize: "12px",
  color: "#94A3B8",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

const planName = {
  fontSize: "18px",
  fontWeight: "700" as const,
  color: "#0F172A",
  margin: "0 0 2px",
};

const planPrice = {
  fontSize: "14px",
  color: "#475569",
  margin: "0",
};

const button = {
  display: "inline-block" as const,
  marginTop: "28px",
  backgroundColor: "#10B981",
  color: "#FFFFFF",
  borderRadius: "10px",
  padding: "12px 24px",
  fontSize: "14px",
  fontWeight: "600" as const,
  textDecoration: "none",
};

const hr = {
  borderColor: "#E8ECF1",
  margin: "32px 0 24px",
};

const footer = {
  fontSize: "12px",
  color: "#94A3B8",
  margin: "0",
  lineHeight: "1.5",
};

const link = {
  color: "#10B981",
  textDecoration: "underline",
};
