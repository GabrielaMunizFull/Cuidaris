export const metadata = {
  title: "Termos de Uso — Cuidaris",
};

export default function TermosPage() {
  return (
    <article className="prose prose-slate max-w-none">
      <h1 className="text-2xl font-bold text-[var(--ink)] mb-2">Termos de Uso</h1>
      <p className="text-sm text-[var(--ink-3)] mb-10">Última atualização: junho de 2026</p>

      <Section titulo="1. Aceitação">
        <p>
          Ao criar uma conta no Cuidaris, você concorda com estes Termos de Uso e com nossa{" "}
          <a href="/privacidade" className="text-[var(--accent)]">Política de Privacidade</a>.
          Se não concordar, não utilize o serviço.
        </p>
      </Section>

      <Section titulo="2. O serviço">
        <p>
          O Cuidaris é uma plataforma SaaS de gestão de agenda, pacientes e financeiro para
          assistentes virtuais de profissionais de saúde e profissionais autônomos da área da saúde.
        </p>
        <p>
          O serviço é prestado mediante assinatura mensal. Disponibilizamos um período de teste
          gratuito de <strong>14 dias</strong>, sem necessidade de cartão de crédito.
        </p>
      </Section>

      <Section titulo="3. Sua conta">
        <ul>
          <li>Você é responsável pela confidencialidade da sua senha e por todas as atividades realizadas na conta.</li>
          <li>Cada conta é pessoal e intransferível.</li>
          <li>Não é permitido criar contas falsas ou usar dados de terceiros sem autorização.</li>
          <li>Em caso de suspeita de acesso não autorizado, notifique-nos imediatamente.</li>
        </ul>
      </Section>

      <Section titulo="4. Uso aceitável">
        <p>É proibido:</p>
        <ul>
          <li>Usar o Cuidaris para finalidades ilegais ou que violem direitos de terceiros.</li>
          <li>Tentar acessar dados de outros usuários ou contornar mecanismos de segurança.</li>
          <li>Fazer engenharia reversa, copiar ou redistribuir qualquer parte do software.</li>
          <li>Usar automações não autorizadas (bots, scrapers) na plataforma.</li>
        </ul>
      </Section>

      <Section titulo="5. Dados dos pacientes">
        <p>
          Os dados de pacientes cadastrados no Cuidaris são de responsabilidade da assistente ou
          profissional que os inseriu. O Cuidaris atua como operador dos dados conforme a LGPD.
          Você declara ter as autorizações necessárias para tratar esses dados na plataforma.
        </p>
      </Section>

      <Section titulo="6. Pagamentos e cancelamento">
        <ul>
          <li>As cobranças são mensais e recorrentes via Stripe.</li>
          <li>Você pode cancelar a qualquer momento em Configurações → Assinatura. O acesso continua até o fim do período pago.</li>
          <li>Não realizamos reembolsos proporcionais de períodos não utilizados, exceto quando exigido por lei.</li>
          <li>Em caso de inadimplência, o acesso é suspenso e os dados preservados por 30 dias.</li>
        </ul>
      </Section>

      <Section titulo="7. Disponibilidade">
        <p>
          Nos comprometemos a manter o Cuidaris disponível, mas não garantimos disponibilidade
          ininterrupta. Manutenções programadas serão comunicadas com antecedência.
          Não nos responsabilizamos por prejuízos decorrentes de indisponibilidade temporária.
        </p>
      </Section>

      <Section titulo="8. Propriedade intelectual">
        <p>
          O Cuidaris e todos os seus elementos (código, design, marca) são propriedade de
          Gabriela Muniz — Muniz.dev. Os dados inseridos por você pertencem a você.
        </p>
      </Section>

      <Section titulo="9. Limitação de responsabilidade">
        <p>
          O Cuidaris é fornecido "como está". Não nos responsabilizamos por danos indiretos,
          lucros cessantes ou perda de dados decorrentes do uso ou impossibilidade de uso do serviço,
          exceto em casos de dolo ou culpa grave.
        </p>
      </Section>

      <Section titulo="10. Alterações nos termos">
        <p>
          Podemos atualizar estes termos. Mudanças relevantes serão comunicadas por e-mail com
          antecedência mínima de 15 dias. O uso continuado após a notificação implica aceite.
        </p>
      </Section>

      <Section titulo="11. Lei aplicável">
        <p>
          Estes termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de
          São Paulo/SP para dirimir eventuais conflitos, com renúncia a qualquer outro.
        </p>
      </Section>

      <Section titulo="12. Contato">
        <p>
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
