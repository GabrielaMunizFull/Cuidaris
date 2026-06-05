import { test, expect } from "@playwright/test";
import path from "path";

test.use({ storageState: path.join(__dirname, ".auth/user-a.json") });

test.describe("Profissionais — CRUD", () => {
  test("página /profissionais carrega e exibe botão de novo profissional", async ({ page }) => {
    await page.goto("/profissionais");
    await expect(page.getByRole("heading", { name: /profissionais/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /novo profissional/i })).toBeVisible();
  });

  test("criar profissional com dados válidos redireciona para lista", async ({ page }) => {
    await page.goto("/profissionais/novo");
    await expect(page.getByRole("heading", { name: /novo profissional/i })).toBeVisible();

    const nome = `Dr. Teste E2E ${Date.now()}`;
    await page.locator("#nome").fill(nome);
    await page.locator("#especialidade").fill("Psicóloga");
    await page.locator("#registro").fill("CRP 06/99999");
    await page.locator("#telefone").fill("(11) 91234-5678");

    await page.getByRole("button", { name: /adicionar profissional/i }).click();

    // Redireciona para o perfil do profissional criado ou para a lista
    await page.waitForURL(/\/profissionais/, { timeout: 15_000 });
    await expect(page.getByText(nome)).toBeVisible({ timeout: 10_000 });
  });

  test("criar profissional sem nome exibe erro de validação", async ({ page }) => {
    await page.goto("/profissionais/novo");
    await page.locator("#especialidade").fill("Nutricionista");
    await page.getByRole("button", { name: /adicionar profissional/i }).click();

    // Browser validation ou erro server-side
    const nomeInput = page.locator("#nome");
    const validationMessage = await nomeInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage.length).toBeGreaterThan(0);
  });

  test("criar profissional sem especialidade exibe erro de validação", async ({ page }) => {
    await page.goto("/profissionais/novo");
    await page.locator("#nome").fill("Dr. Sem Especialidade");
    await page.getByRole("button", { name: /adicionar profissional/i }).click();

    const especialidadeInput = page.locator("#especialidade");
    const validationMessage = await especialidadeInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage.length).toBeGreaterThan(0);
  });

  test("editar profissional — campos populados com valores atuais", async ({ page }) => {
    await page.goto("/profissionais");
    const linkProfissional = page.locator("a[href^='/profissionais/']").first();
    await linkProfissional.click();
    await page.waitForURL(/\/profissionais\/.+/);

    // Navega para edição — tenta link de editar
    const editarLink = page.getByRole("link", { name: /editar/i }).first();
    const editarHref = await editarLink.getAttribute("href").catch(() => null);
    if (!editarHref) {
      test.skip(true, "Link de editar não encontrado neste profissional");
      return;
    }

    await editarLink.click();
    await page.waitForURL(/\/editar/);

    // Campos devem estar preenchidos
    const nomeValue = await page.locator("#nome").inputValue();
    expect(nomeValue.length).toBeGreaterThan(0);

    const especialidadeValue = await page.locator("#especialidade").inputValue();
    expect(especialidadeValue.length).toBeGreaterThan(0);
  });

  test("página de profissional exibe as 4 abas de navegação", async ({ page }) => {
    await page.goto("/profissionais");
    const link = page.locator("a[href^='/profissionais/']").first();
    const href = await link.getAttribute("href");
    if (!href) {
      test.skip(true, "Nenhum profissional cadastrado");
      return;
    }

    await page.goto(href);

    await expect(page.getByRole("link", { name: /pacientes/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /agenda/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /financeiro/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /convênios/i })).toBeVisible();
  });
});
