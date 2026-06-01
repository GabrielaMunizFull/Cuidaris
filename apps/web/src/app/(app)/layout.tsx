import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "./_components/sidebar";
import { Header } from "./_components/header";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Cache de 60s — assistente e lista de profissionais mudam raramente
  const getLayoutData = unstable_cache(
    async (userId: string) => {
      const [{ data: assistente }, { data: profissionais }] = await Promise.all([
        supabase.from("assistentes").select("nome").eq("id", userId).single(),
        supabase.from("profissionais").select("id, nome, especialidade, foto_url").eq("ativo", true).order("nome"),
      ]);
      return { assistente, profissionais };
    },
    ["layout-data"],
    { revalidate: 60, tags: [`user-${user.id}`] }
  );

  const { assistente, profissionais } = await getLayoutData(user.id);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Sidebar
        profissionais={profissionais ?? []}
        assistenteNome={assistente?.nome ?? user.email ?? ""}
      />
      <Header assistenteNome={assistente?.nome ?? user.email ?? ""} />
      <main className="ml-60 pt-14">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
