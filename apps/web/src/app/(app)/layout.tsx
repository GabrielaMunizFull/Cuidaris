import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { differenceInDays } from "date-fns";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "./_components/sidebar";
import { Header } from "./_components/header";
import { TrialBanner } from "./_components/trial-banner";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const pathname = (await headers()).get("x-pathname") ?? "";

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const getLayoutData = unstable_cache(
    async (userId: string) => {
      const [{ data: assistente }, { data: profissionais }] = await Promise.all([
        supabase
          .from("assistentes")
          .select("nome, status_assinatura, trial_termina_em, plano, tipo_conta")
          .eq("id", userId)
          .single(),
        supabase
          .from("profissionais")
          .select("id, nome, especialidade, foto_url")
          .eq("ativo", true)
          .order("nome"),
      ]);
      return { assistente, profissionais };
    },
    ["layout-data"],
    { revalidate: 60, tags: [`user-${user.id}`] }
  );

  const { assistente, profissionais } = await getLayoutData(user.id);

  const status = assistente?.status_assinatura ?? "trial";
  const trialTermina = assistente?.trial_termina_em
    ? new Date(assistente.trial_termina_em)
    : null;
  const diasRestantes = trialTermina ? differenceInDays(trialTermina, new Date()) : 0;
  const trialExpirado = status === "trial" && diasRestantes < 0;
  const mostrarBanner = status === "trial" && diasRestantes <= 7;

  const SEMPRE_ACESSIVEIS_LAYOUT = ["/planos", "/configuracoes"];
  const rotaSempreAcessivel = SEMPRE_ACESSIVEIS_LAYOUT.some((p) => pathname.startsWith(p));

  // Bloqueia acesso se trial expirado ou cancelado/inadimplente sem plano ativo
  // /planos e /configuracoes sempre acessíveis para poder assinar
  const bloqueado =
    !rotaSempreAcessivel &&
    (trialExpirado || status === "cancelado" || status === "inadimplente");

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Sidebar
        profissionais={profissionais ?? []}
        assistenteNome={assistente?.nome ?? user.email ?? ""}
        tipoConta={assistente?.tipo_conta ?? "assistente"}
      />
      <div className="lg:ml-60 flex flex-col min-h-screen">
        <Header
          assistenteNome={assistente?.nome ?? user.email ?? ""}
          profissionais={profissionais ?? []}
          tipoConta={assistente?.tipo_conta ?? "assistente"}
        />
        {mostrarBanner && (
          <div className="pt-14">
            <TrialBanner diasRestantes={diasRestantes} />
          </div>
        )}
        <main className={mostrarBanner ? "" : "pt-14"}>
          <div className="p-6">
            {bloqueado ? (
              <TrialExpiradoGuard />
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function TrialExpiradoGuard() {
  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-8">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-2">Acesso bloqueado</h2>
        <p className="text-sm text-[var(--ink-2)] mb-6">
          Seu período de trial expirou. Escolha um plano para continuar usando o Cuidaris.
        </p>
        <a
          href="/planos"
          className="inline-flex items-center justify-center h-10 px-6 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
        >
          Ver planos e assinar
        </a>
      </div>
    </div>
  );
}
