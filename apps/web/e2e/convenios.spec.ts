import { test, expect } from "@playwright/test";
import path from "path";

test.use({ storageState: path.join(__dirname, ".auth/user-a.json") });

async function getProfissionalId(page: import("@playwright/test").Page): Promise<string | null> {
  await page.goto("/profissionais");
  const link = page.locator("a[href^='/profissionais/']").first();
  const href = await link.getAttribute("href").catch(() => null);
  if (!href) return null;
  const match = href.match(/\/profissionais\/([^/]+)/);
  return match?.[1] ?? null;
}

test.describe("Convênios — visualização", () => {
  test("página de convênios do profissional carrega sem erro", async ({ page }) => {
    const id = await getProfissionalId(page);
    if (!id) {
      test.skip(true, "Nenhum profissional cadastrado");
      return;
    }

    await page.goto(`/profissionais/${id}/convenios`);
    await expect(page.getByRole("heading", { name: /convênios/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /novo convênio/i })).toBeVisible();
  });
});

test.describe("Convênios — criação", () => {
  test("criar convênio apenas com nome redireciona para lista", async ({ page }) => {
    const id = await getProfissionalId(page);
    if (!id) {
      test.skip(true, "Nenhum profissional cadastrado");
      return;
    }

    await page.goto(`/profissionais/${id}/convenios/novo`);
    await expect(page.getByLabel(/nome do convênio/i)).toBeVisible();

    const nome = `Unimed E2E ${Date.now()}`;
    await page.locator("#nome").fill(nome);
    // Sem valor padrão (opcional)
    await page.getByRole("button", { name: /salvar convênio/i }).click();

    await page.waitForURL(/\/profissionais\/.+\/convenios/, { timeout: 15_000 });
    await expect(page.getByText(new RegExp(nome, "i"))).toBeVisible({ timeout: 10_000 });
  });

  test("criar convênio com valor padrão salva corretamente", async ({ page }) => {
    const id = await getProfissionalId(page);
    if (!id) {
      test.skip(true, "Nenhum profissional cadastrado");
      return;
    }

    await page.goto(`/profissionais/${id}/convenios/novo`);

    const nome = `Bradesco E2E ${Date.now()}`;
    await page.locator("#nome").fill(nome);
    await page.locator("#valor_padrao").fill("180,00");

    await page.getByRole("button", { name: /salvar convênio/i }).click();

    await page.waitForURL(/\/profissionais\/.+\/convenios/, { timeout: 15_000 });
    await expect(page.getByText(new RegExp(nome, "i"))).toBeVisible({ timeout: 10_000 });
  });

  test("criar convênio sem nome exibe validação nativa", async ({ page }) => {
    const id = await getProfissionalId(page);
    if (!id) {
      test.skip(true, "Nenhum profissional cadastrado");
      return;
    }

    await page.goto(`/profissionais/${id}/convenios/novo`);
    await page.getByRole("button", { name: /salvar convênio/i }).click();

    const nomeInput = page.locator("#nome");
    const validationMessage = await nomeInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage.length).toBeGreaterThan(0);
  });
});

test.describe("Convênios — edição", () => {
  test("editar convênio existente — campos populados corretamente", async ({ page }) => {
    const id = await getProfissionalId(page);
    if (!id) {
      test.skip(true, "Nenhum profissional cadastrado");
      return;
    }

    await page.goto(`/profissionais/${id}/convenios`);

    const editarLink = page.getByRole("link", { name: /editar/i }).first();
    const href = await editarLink.getAttribute("href").catch(() => null);
    if (!href) {
      test.skip(true, "Nenhum convênio cadastrado para editar");
      return;
    }

    await editarLink.click();
    await page.waitForURL(/\/convenios\/.+\/editar/);

    const nomeValue = await page.locator("#nome").inputValue();
    expect(nomeValue.length).toBeGreaterThan(0);
  });
});
