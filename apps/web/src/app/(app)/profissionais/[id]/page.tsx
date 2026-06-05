import { redirect } from "next/navigation";

export default async function ProfissionalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/profissionais/${id}/pacientes`);
}
