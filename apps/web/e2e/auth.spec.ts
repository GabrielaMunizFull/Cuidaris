import { test, expect } from "@playwright/test";

test.describe("Autenticação", () => {
  test("rota protegida redireciona para login sem sessão", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("rota /planos redireciona para login sem sessão", async ({ page }) => {
    await page.goto("/planos");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login com credenciais inválidas exibe erro", async ({ page }) => {
    await page.goto("/login");
    await page.locator("#email").fill("nao-existe@cuidaris.dev");
    await page.locator("#password").fill("senhaerrada");
    await page.getByRole("button", { name: /entrar no painel/i }).click();
    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("usuária logada acessando /login é redirecionada para /dashboard", async ({ browser }) => {
    const ctx = await browser.newContext({
      storageState: require("path").join(__dirname, ".auth/user-a.json"),
    });
    const page = await ctx.newPage();
    await page.goto("/login");
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
    await ctx.close();
  });
});
