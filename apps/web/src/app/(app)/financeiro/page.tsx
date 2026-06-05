import { redirect } from "next/navigation";

// Financeiro global = relatórios consolidados
export default function FinanceiroGlobalPage() {
  redirect("/relatorios");
}
