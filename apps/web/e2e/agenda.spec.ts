import { test, expect } from "@playwright/test";
import path from "path";

test.use({ storageState: path.join(__dirname, ".auth/user-a.json") });

async function getProfissionalId(page: import("@playwright/test").Page): Promise<string | null> {
  await page.goto("/profissionais");
  const link = page.locator("a[href^='/profissionais/']").first();
  const href = await link.getAttribute("href").catch(() => null);
  if (!href) return null;
  // Extrai o ID do path /profissionais/<id>/...
  const match = href.match(/\/profissionais\/([^/]+)/);
  return match?.[1] ?? null;
}

test.describe("Agenda — visualização", () => {
  test("página de agenda do profissional carrega sem erro", async ({ page }) => {
    const id = await getProfissionalId(page);
    if (!id) {
      test.skip(true, "Nenhum profissional cadastrado");
      return;
    }

    await page.goto(`/profissionais/${id}/agenda`);
    await expect(page.getByRole("heading", { name: /agenda/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /nova consulta/i })).toBeVisible();
  });

  test("página /agenda global carrega sem erro", async ({ page }) => {
    await page.goto("/agenda");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });
});

test.describe("Agenda — criação de consulta", () => {
  test("formulário de nova consulta renderiza campos obrigatórios", async ({ page }) => {
    const id = await getProfissionalId(page);
    if (!id) {
      test.skip(true, "Nenhum profissional cadastrado");
      return;
    }

    await page.goto(`/profissionais/${id}/agenda/nova`);
    await expect(page.getByLabel(/paciente/i)).toBeVisible();
    await expect(page.getByLabel(/data e horário/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /agendar consulta/i })).toBeVisible();
  });

  test("aviso exibido quando profissional não tem pacientes", async ({ page }) => {
    const id = await getProfissionalId(page);
    if (!id) {
      test.skip(true, "Nenhum profissional cadastrado");
      return;
    }

    await page.goto(`/profissionais/${id}/agenda/nova`);

    const select = page.locator("#paciente_id");
    const options = await select.locator("option").count();

    if (options <= 1) {
      // Apenas a option vazia — deve exibir aviso
      await expect(page.getByText(/nenhum paciente cadastrado/i)).toBeVisible();
      // Botão deve estar desabilitado
      await expect(page.getByRole("button", { name: /agendar consulta/i })).toBeDisabled();
    }
  });

  test("criar consulta com dados válidos redireciona para agenda", async ({ page }) => {
    const id = await getProfissionalId(page);
    if (!id) {
      test.skip(true, "Nenhum profissional cadastrado");
      return;
    }

    await page.goto(`/profissionais/${id}/agenda/nova`);

    const select = page.locator("#paciente_id");
    const options = await select.locator("option").count();

    if (options <= 1) {
      test.skip(true, "Profissional sem pacientes — não é possível criar consulta");
      return;
    }

    // Seleciona o primeiro paciente disponível
    await select.selectOption({ index: 1 });

    // Data amanhã às 10h
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    amanha.setHours(10, 0, 0, 0);
    const dataHoraLocal = amanha.toISOString().slice(0, 16);
    await page.locator("#data_hora").fill(dataHoraLocal);

    await page.locator("#status").selectOption("confirmado");
    await page.locator("#observacoes").fill("Consulta criada via E2E");

    await page.getByRole("button", { name: /agendar consulta/i }).click();

    await page.waitForURL(/\/profissionais\/.+\/agenda/, { timeout: 15_000 });
  });

  test("tentar agendar sem data exibe validação nativa", async ({ page }) => {
    const id = await getProfissionalId(page);
    if (!id) {
      test.skip(true, "Nenhum profissional cadastrado");
      return;
    }

    await page.goto(`/profissionais/${id}/agenda/nova`);

    const select = page.locator("#paciente_id");
    const options = await select.locator("option").count();
    if (options > 1) await select.selectOption({ index: 1 });

    await page.getByRole("button", { name: /agendar consulta/i }).click();

    const dataInput = page.locator("#data_hora");
    const validationMessage = await dataInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage.length).toBeGreaterThan(0);
  });
});
