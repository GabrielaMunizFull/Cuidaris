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

interface CancelamentoProps {
  nome: string;
  appUrl: string;
}

export function Cancelamento({ nome, appUrl }: CancelamentoProps) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>Sua assinatura do Cuidaris foi cancelada. Seus dados ficam guardados por 30 dias.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={logo}>Cuidaris</Text>

          <div style={cancelBadge}>Assinatura cancelada</div>

          <Text style={heading}>Até logo, {nome}.</Text>
          <Text style={paragraph}>
            Sua assinatura foi cancelada com sucesso. Seus dados ficam preservados por{" "}
            <strong>30 dias</strong> — se mudar de ideia, é só reativar e tudo estará lá.
          </Text>

          <Text style={paragraph}>
            Caso tenha cancelado por algum problema ou dúvida, responda este e-mail.
            Estamos aqui para ajudar.
          </Text>

          <Button href={`${appUrl}/planos`} style={button}>
            Reativar quando quiser
          </Button>

          <Hr style={hr} />
          <Text style={footer}>
            Após 30 dias, os dados são removidos permanentemente conforme nossa{" "}
            <a href={`${appUrl.replace("/app.", "/")}/privacidade`} style={link}>
              Política de Privacidade
            </a>
            .
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

const cancelBadge = {
  display: "inline-block" as const,
  backgroundColor: "#F8FAFC",
  color: "#475569",
  border: "1px solid #E8ECF1",
  borderRadius: "8px",
  padding: "6px 12px",
  fontSize: "13px",
  fontWeight: "500" as const,
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
  margin: "0 0 16px",
  lineHeight: "1.6",
};

const button = {
  display: "inline-block" as const,
  marginTop: "12px",
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
