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

interface BoasVindasProps {
  nome: string;
  appUrl: string;
}

export function BoasVindas({ nome, appUrl }: BoasVindasProps) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>Bem-vinda ao Cuidaris! Seu trial de 14 dias começa agora.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={logo}>Cuidaris</Text>

          <Text style={heading}>Bem-vinda, {nome}!</Text>
          <Text style={paragraph}>
            Sua conta foi criada com sucesso. Você tem{" "}
            <strong>14 dias grátis</strong> para explorar tudo o que o Cuidaris
            oferece — sem cartão de crédito.
          </Text>

          <Text style={subheading}>O que você pode fazer agora:</Text>
          <Text style={listItem}>✓ Cadastrar os profissionais que você atende</Text>
          <Text style={listItem}>✓ Gerenciar pacientes e agenda semanal</Text>
          <Text style={listItem}>✓ Registrar lançamentos e gerar recibos em PDF</Text>
          <Text style={listItem}>✓ Acompanhar convênios e financeiro</Text>

          <Button href={`${appUrl}/dashboard`} style={button}>
            Acessar o Cuidaris
          </Button>

          <Hr style={hr} />
          <Text style={footer}>
            Você recebeu este e-mail porque criou uma conta no Cuidaris.
            Dúvidas? Responda este e-mail.
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
  margin: "0 0 32px",
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

const subheading = {
  fontSize: "14px",
  fontWeight: "600" as const,
  color: "#0F172A",
  margin: "0 0 10px",
};

const listItem = {
  fontSize: "14px",
  color: "#475569",
  margin: "0 0 6px",
  lineHeight: "1.6",
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
};
