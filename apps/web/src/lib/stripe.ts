import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

// Cliente admin (service role) — bypass RLS, usado apenas em webhooks server-side
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const PLANOS = {
  solo: {
    nome: "Solo",
    preco: "R$ 49/mês",
    precoNum: 49,
    descricao: "Para profissionais autônomos que gerenciam a própria agenda",
    limite: "1 profissional (você)",
    priceId: process.env.STRIPE_PRICE_SOLO!,
    features: [
      "Você como profissional",
      "Pacientes ilimitados",
      "Agenda semanal",
      "Financeiro + recibos PDF",
    ],
  },
  essencial: {
    nome: "Essencial",
    preco: "R$ 79/mês",
    precoNum: 79,
    descricao: "Para assistentes que gerenciam 1 profissional",
    limite: "1 profissional",
    priceId: process.env.STRIPE_PRICE_ESSENCIAL!,
    features: [
      "1 profissional",
      "Pacientes ilimitados",
      "Agenda semanal",
      "Financeiro + recibos PDF",
    ],
  },
  profissional: {
    nome: "Profissional",
    preco: "R$ 189/mês",
    precoNum: 189,
    descricao: "Para clínicas e consultórios com múltiplos profissionais",
    limite: "até 5 profissionais",
    priceId: process.env.STRIPE_PRICE_PROFISSIONAL!,
    destaque: true,
    features: [
      "Até 5 profissionais",
      "Pacientes ilimitados",
      "Agenda semanal",
      "Financeiro + recibos PDF",
      "Relatórios",
    ],
  },
  clinica: {
    nome: "Clínica",
    preco: "R$ 449/mês",
    precoNum: 449,
    descricao: "Para grandes clínicas com equipe completa",
    limite: "profissionais ilimitados",
    priceId: process.env.STRIPE_PRICE_CLINICA!,
    features: [
      "Profissionais ilimitados",
      "Pacientes ilimitados",
      "Agenda semanal",
      "Financeiro + recibos PDF",
      "Relatórios",
      "Suporte prioritário",
    ],
  },
} as const;
