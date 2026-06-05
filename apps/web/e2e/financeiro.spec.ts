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

test.describe("Financeiro — visualização", () => {
  test("página financeiro do profissional carrega sem erro", async ({ page }) => {
    const id = await getProfissionalId(page);
    if (!id) {
      test.skip(true, "Nenhum profissional cadastrado");
      return;
    }

    await page.goto(`/profissionais/${id}/financeiro`);
    await expect(page.getByRole("heading", { name: /financeiro/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /novo lançamento/i })).toBeVisible();
  });

  test("página /financeiro global carrega sem erro", async ({ page }) => {
    await page.goto("/financeiro");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });
});

test.describe("Financeiro — criação de lançamento", () => {
  test("formulário de novo lançamento renderiza campos obrigatórios", async ({ page }) => {
    const id = await getProfissionalId(page);
    if (!id) {
      test.skip(true, "Nenhum profissional cadastrado");
      return;
    }

    await page.goto(`/profissionais/${id}/financeiro/novo`);
    await expect(page.getByLabel(/descrição/i)).toBeVisible();
    await expect(page.getByLabel(/valor/i)).toBeVisible();
    await expect(page.getByLabel(/data/i)).toBeVisible();
    await expect(page.getByLabel(/forma de pagamento/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /salvar lançamento/i })).toBeVisible();
  });

  test("criar lançamento pago com PIX redireciona para financeiro", async ({ page }) => {
    const id = await getProfissionalId(page);
    if (!id) {
      test.skip(true, "Nenhum profissional cadastrado");
      return;
    }

    await page.goto(`/profissionais/${id}/financeiro/novo`);

    await page.locator("#descricao").fill("Consulta E2E teste");
    await page.locator("#valor").fill("150");
    // Data já vem preenchida com hoje
    await page.locator("#forma_pagamento").selectOption("pix");
    await page.locator("#status").selectOption("pago");

    await page.getByRole("button", { name: /salvar lançamento/i }).click();

    await page.waitForURL(/\/profissionais\/.+\/financeiro/, { timeout: 15_000 });
    await expect(page.getByText(/consulta e2e teste/i)).toBeVisible({ timeout: 10_000 });
  });

  test("criar lançamento com status pendente aparece na lista", async ({ page }) => {
    const id = await getProfissionalId(page);
    if (!id) {
      test.skip(true, "Nenhum profissional cadastrado");
      return;
    }

    await page.goto(`/profissionais/${id}/financeiro/novo`);

    const descricao = `Sessão pendente ${Date.now()}`;
    await page.locator("#descricao").fill(descricao);
    await page.locator("#valor").fill("200");
    await page.locator("#forma_pagamento").selectOption("dinheiro");
    await page.locator("#status").selectOption("pendente");

    await page.getByRole("button", { name: /salvar lançamento/i }).click();

    await page.waitForURL(/\/profissionais\/.+\/financeiro/, { timeout: 15_000 });
    await expect(page.getByText(new RegExp(descricao, "i"))).toBeVisible({ timeout: 10_000 });
  });

  test("criar lançamento sem descrição exibe validação", async ({ page }) => {
    const id = await getProfissionalId(page);
    if (!id) {
      test.skip(true, "Nenhum profissional cadastrado");
      return;
    }

    await page.goto(`/profissionais/${id}/financeiro/novo`);
    await page.locator("#valor").fill("100");
    await page.getByRole("button", { name: /salvar lançamento/i }).click();

    const descricaoInput = page.locator("#descricao");
    const validationMessage = await descricaoInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage.length).toBeGreaterThan(0);
  });

  test("criar lançamento sem valor exibe validação", async ({ page }) => {
    const id = await getProfissionalId(page);
    if (!id) {
      test.skip(true, "Nenhum profissional cadastrado");
      return;
    }

    await page.goto(`/profissionais/${id}/financeiro/novo`);
    await page.locator("#descricao").fill("Consulta sem valor");
    await page.getByRole("button", { name: /salvar lançamento/i }).click();

    const valorInput = page.locator("#valor");
    const validationMessage = await valorInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage.length).toBeGreaterThan(0);
  });
});
