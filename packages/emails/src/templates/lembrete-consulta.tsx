import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Hr,
  Preview,
} from "@react-email/components";
import React from "react";

interface LembreteConsultaProps {
  nomePaciente: string;
  nomeProfissional: string;
  especialidade: string;
  dataHora: string;
}

export function LembreteConsulta({
  nomePaciente,
  nomeProfissional,
  especialidade,
  dataHora,
}: LembreteConsultaProps) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>Lembrete: você tem uma consulta hoje com {nomeProfissional}.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={logo}>Cuidaris</Text>

          <div style={badge}>📅 Lembrete de consulta</div>

          <Text style={heading}>Olá, {nomePaciente}!</Text>
          <Text style={paragraph}>
            Este é um lembrete da sua consulta agendada para <strong>hoje</strong>:
          </Text>

          <div style={card}>
            <Text style={cardRow}>
              <span style={label}>Profissional</span>
              <span style={value}>{nomeProfissional}</span>
            </Text>
            <Text style={cardRow}>
              <span style={label}>Especialidade</span>
              <span style={value}>{especialidade}</span>
            </Text>
            <Text style={cardRow}>
              <span style={label}>Horário</span>
              <span style={value}>{dataHora}</span>
            </Text>
          </div>

          <Text style={paragraph}>
            Caso precise reagendar ou cancelar, entre em contato com o consultório.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>
            Este e-mail foi enviado automaticamente pelo sistema de gestão do consultório.
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

const badge = {
  display: "inline-block" as const,
  backgroundColor: "#EFF6FF",
  color: "#1D4ED8",
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
  margin: "0 0 20px",
  lineHeight: "1.6",
};

const card = {
  backgroundColor: "#F6F8FA",
  borderRadius: "10px",
  padding: "20px 24px",
  marginBottom: "24px",
};

const cardRow = {
  fontSize: "14px",
  color: "#0F172A",
  margin: "0 0 10px",
  display: "flex" as const,
};

const label = {
  color: "#94A3B8",
  minWidth: "120px",
  display: "inline-block" as const,
};

const value = {
  color: "#0F172A",
  fontWeight: "500" as const,
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
