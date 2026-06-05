/**
 * Testes de layout mobile — garante que as telas principais
 * não quebram em telas pequenas (375px).
 */
import { test, expect, devices } from "@playwright/test";
import path from "path";

// Sobrescreve o device para mobile neste arquivo
test.use({
  storageState: path.join(__dirname, ".auth/user-a.json"),
  ...devices["iPhone 15"],
});

const telas = [
  { nome: "Dashboard", url: "/dashboard" },
  { nome: "Planos", url: "/planos" },
  { nome: "Relatórios", url: "/relatorios" },
  { nome: "Configurações", url: "/configuracoes" },
];

for (const { nome, url } of telas) {
  test(`${nome} — renderiza sem overflow horizontal no mobile`, async ({ page }) => {
    await page.goto(url);

    // Verifica que não há scroll horizontal (conteúdo não quebra)
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // 5px de tolerância

    // Tira screenshot para revisão visual
    await page.screenshot({ path: `e2e/screenshots/${nome.toLowerCase().replace(" ", "-")}-mobile.png` });
  });
}

test("Dashboard mobile — sidebar não bloqueia conteúdo", async ({ page }) => {
  await page.goto("/dashboard");
  // Em mobile, o conteúdo principal deve ser visível
  await expect(page.locator("main")).toBeVisible();
});
