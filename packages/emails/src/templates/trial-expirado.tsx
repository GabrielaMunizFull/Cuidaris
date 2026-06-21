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

interface TrialExpiradoProps {
  nome: string;
  appUrl: string;
}

export function TrialExpirado({ nome, appUrl }: TrialExpiradoProps) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>Seu acesso ao Cuidaris foi suspenso. Assine um plano para reativar.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={logo}>Cuidaris</Text>

          <div style={alertBadge}>🔒 Trial encerrado</div>

          <Text style={heading}>Seu período gratuito acabou, {nome}.</Text>
          <Text style={paragraph}>
            O acesso ao seu painel foi suspenso temporariamente. Seus dados estão salvos e
            ficam disponíveis por <strong>30 dias</strong> — basta assinar um plano para
            reativar tudo imediatamente, sem perder nada.
          </Text>

          <Text style={subheading}>Escolha o plano certo para você:</Text>
          <Text style={listItem}>
            <strong>Essencial — R$79/mês</strong> · Para quem gerencia 1 profissional
          </Text>
          <Text style={listItem}>
            <strong>Profissional — R$189/mês</strong> · Até 5 profissionais
          </Text>
          <Text style={listItem}>
            <strong>Clínica — R$449/mês</strong> · Profissionais ilimitados
          </Text>

          <Button href={`${appUrl}/planos`} style={button}>
            Reativar minha conta
          </Button>

          <Hr style={hr} />
          <Text style={footer}>
            Se quiser conversar antes de assinar, responda este e-mail — estamos aqui.
            Seus dados ficam guardados por 30 dias a partir de hoje.
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

const alertBadge = {
  display: "inline-block" as const,
  backgroundColor: "#FEE2E2",
  color: "#991B1B",
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

const subheading = {
  fontSize: "14px",
  fontWeight: "600" as const,
  color: "#0F172A",
  margin: "0 0 10px",
};

const listItem = {
  fontSize: "14px",
  color: "#475569",
  margin: "0 0 8px",
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
  lineHeight: "1.5",
};
