export const metadata = {
  title: "Política de Privacidade — Cuidaris",
};

export default function PrivacidadePage() {
  return (
    <article className="prose prose-slate max-w-none">
      <h1 className="text-2xl font-bold text-[var(--ink)] mb-2">Política de Privacidade</h1>
      <p className="text-sm text-[var(--ink-3)] mb-10">Última atualização: junho de 2026</p>

      <Section titulo="1. Quem somos">
        <p>
          O Cuidaris é um software de gestão para assistentes virtuais e profissionais de saúde,
          desenvolvido por <strong>Gabriela Muniz — Muniz.dev</strong> (CNPJ a ser inserido).
          Dúvidas sobre privacidade: <a href="mailto:gabrielasmunizf@gmail.com" className="text-[var(--accent)]">gabrielasmunizf@gmail.com</a>.
        </p>
      </Section>

      <Section titulo="2. Quais dados coletamos">
        <ul>
          <li><strong>Dados de conta:</strong> nome, e-mail e senha (armazenada com hash seguro pelo Supabase Auth).</li>
          <li><strong>Dados de uso:</strong> profissionais, pacientes, sessões, lançamentos financeiros e documentos que você cadastra na plataforma.</li>
          <li><strong>Dados de pagamento:</strong> gerenciados pelo Stripe — não armazenamos dados de cartão.</li>
          <li><strong>Dados técnicos:</strong> logs de acesso e erros de sistema para fins de diagnóstico.</li>
        </ul>
      </Section>

      <Section titulo="3. Como usamos seus dados">
        <ul>
          <li>Prestar e melhorar o serviço contratado.</li>
          <li>Enviar e-mails transacionais (confirmação de cadastro, lembretes de consulta, avisos de cobrança).</li>
          <li>Cumprir obrigações legais e regulatórias.</li>
        </ul>
        <p>Não vendemos nem compartilhamos seus dados com terceiros para fins publicitários.</p>
      </Section>

      <Section titulo="4. Base legal (LGPD)">
        <p>Tratamos seus dados com base em:</p>
        <ul>
          <li><strong>Execução de contrato</strong> (art. 7º, V): para prestar o serviço que você contratou.</li>
          <li><strong>Legítimo interesse</strong> (art. 7º, IX): para segurança, prevenção de fraudes e melhoria do produto.</li>
          <li><strong>Consentimento</strong> (art. 7º, I): para comunicações opcionais.</li>
        </ul>
      </Section>

      <Section titulo="5. Compartilhamento">
        <p>Seus dados são processados pelos seguintes fornecedores, todos com políticas de privacidade adequadas:</p>
        <ul>
          <li><strong>Supabase</strong> — banco de dados e autenticação (EUA / infraestrutura AWS)</li>
          <li><strong>Stripe</strong> — processamento de pagamentos (EUA)</li>
          <li><strong>Resend</strong> — envio de e-mails transacionais (EUA)</li>
          <li><strong>Vercel</strong> — hospedagem da aplicação (EUA)</li>
          <li><strong>Sentry</strong> — monitoramento de erros (EUA)</li>
        </ul>
        <p>
          Todas as transferências internacionais são realizadas com garantias adequadas conforme a
          LGPD e cláusulas contratuais padrão.
        </p>
      </Section>

      <Section titulo="6. Retenção de dados">
        <ul>
          <li>Durante a vigência da assinatura: dados mantidos e acessíveis.</li>
          <li>Após cancelamento ou expiração do trial: dados preservados por <strong>30 dias</strong> para eventual reativação.</li>
          <li>Após 30 dias: dados removidos permanentemente dos sistemas ativos. Backups excluídos no ciclo regular (até 90 dias).</li>
        </ul>
      </Section>

      <Section titulo="7. Seus direitos">
        <p>Conforme a LGPD, você pode a qualquer momento:</p>
        <ul>
          <li>Confirmar a existência de tratamento dos seus dados.</li>
          <li>Acessar, corrigir ou excluir seus dados.</li>
          <li>Solicitar a portabilidade dos dados.</li>
          <li>Revogar consentimento (quando aplicável).</li>
        </ul>
        <p>
          Para exercer esses direitos, entre em contato: <a href="mailto:gabrielasmunizf@gmail.com" className="text-[var(--accent)]">gabrielasmunizf@gmail.com</a>.
          Respondemos em até 15 dias úteis.
        </p>
      </Section>

      <Section titulo="8. Segurança">
        <p>
          Adotamos medidas técnicas e organizacionais para proteger seus dados: criptografia em
          trânsito (HTTPS/TLS), isolamento de dados por tenant via Row Level Security no banco de
          dados, e controle de acesso por função.
        </p>
      </Section>

      <Section titulo="9. Alterações nesta política">
        <p>
          Podemos atualizar esta política periodicamente. Mudanças relevantes serão comunicadas
          por e-mail com antecedência mínima de 15 dias. O uso continuado após a notificação
          implica aceite das alterações.
        </p>
      </Section>

      <Section titulo="10. Contato e Encarregado (DPO)">
        <p>
          Responsável pelo tratamento de dados:<br />
          <strong>Gabriela Muniz</strong><br />
          <a href="mailto:gabrielasmunizf@gmail.com" className="text-[var(--accent)]">gabrielasmunizf@gmail.com</a>
        </p>
      </Section>
    </article>
  );
}

function Section({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-base font-semibold text-[var(--ink)] mb-3">{titulo}</h2>
      <div className="text-sm text-[var(--ink-2)] leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
