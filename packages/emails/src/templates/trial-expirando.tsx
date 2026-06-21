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

interface TrialExpirandoProps {
  nome: string;
  diasRestantes: number;
  appUrl: string;
}

export function TrialExpirando({ nome, diasRestantes, appUrl }: TrialExpirandoProps) {
  const plural = diasRestantes === 1 ? "dia" : "dias";

  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>
        {`Seu período gratuito termina em ${diasRestantes} ${plural}. Escolha um plano para continuar.`}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={logo}>Cuidaris</Text>

          <div style={alertBadge}>
            ⏳ {diasRestantes} {plural} restante{diasRestantes === 1 ? "" : "s"}
          </div>

          <Text style={heading}>Seu trial está acabando, {nome}.</Text>
          <Text style={paragraph}>
            Você tem <strong>{diasRestantes} {plural}</strong> até o fim do seu período gratuito.
            Para continuar usando o Cuidaris sem interrupções, escolha o plano certo para o seu trabalho.
          </Text>

          <Text style={subheading}>Escolha o plano ideal:</Text>
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
            Ver planos e assinar
          </Button>

          <Hr style={hr} />
          <Text style={footer}>
            Após o término do trial, o acesso ao painel será suspenso até a ativação de um plano.
            Seus dados ficam salvos por 30 dias.
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
  backgroundColor: "#FEF3C7",
  color: "#92400E",
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
