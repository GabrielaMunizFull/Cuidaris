import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "./_components/sidebar";
import { Header } from "./_components/header";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: assistente } = await supabase
    .from("assistentes")
    .select("nome")
    .eq("id", user.id)
    .single();

  const { data: profissionais } = await supabase
    .from("profissionais")
    .select("id, nome, especialidade, foto_url")
    .eq("ativo", true)
    .order("nome");

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
