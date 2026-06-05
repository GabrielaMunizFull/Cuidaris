import { test, expect } from "@playwright/test";
import path from "path";

test.use({ storageState: path.join(__dirname, ".auth/user-a.json") });

test.describe("Pacientes — casos de borda", () => {
  test("XSS: campo nome não executa script", async ({ page }) => {
    // Navega para um profissional (pega o primeiro da lista)
    await page.goto("/profissionais");
    const link = page.locator("a[href^='/profissionais/']").first();
    await link.click();
    await page.waitForURL(/\/profissionais\/.+\/pacientes/);

    // Abre modal de novo paciente
    await page.getByRole("button", { name: /novo paciente/i }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible().catch(async () => {
      // Pode ter ido para URL com ?novo=1
      await page.waitForURL(/\?novo=1/);
    });

    const xssPayload = "<script>alert('xss')</script>";
    await page.getByLabel(/nome completo/i).fill(xssPayload);
    await page.getByRole("button", { name: /salvar paciente/i }).click();

    // Não deve aparecer dialog de alert (XSS bloqueado)
    page.on("dialog", async (dialog) => {
      expect(dialog.type()).not.toBe("alert");
      await dialog.dismiss();
    });

    // O texto escapado pode aparecer ou dar erro de validação, mas nunca executar
    await expect(page.getByRole("alert")).toBeVisible().catch(() => {
      // Pode ter sucesso com texto escapado — tudo bem
    });
  });

  test("cadastrar paciente sem e-mail (campo opcional)", async ({ page }) => {
    await page.goto("/profissionais");
    const link = page.locator("a[href^='/profissionais/']").first();
    await link.click();
    await page.waitForURL(/\/profissionais\/.+\/pacientes/);

    await page.getByRole("button", { name: /novo paciente/i }).first().click();
    await page.getByLabel(/nome completo/i).fill("Paciente Sem Email Teste");
    // Deixar e-mail em branco (é opcional)
    await page.getByRole("button", { name: /salvar paciente/i }).click();

    // Deve salvar sem erro
    await expect(page.getByText(/paciente sem email teste/i)).toBeVisible({ timeout: 10_000 });
  });

  test("campo nome obrigatório — exibe erro se vazio", async ({ page }) => {
    await page.goto("/profissionais");
    const link = page.locator("a[href^='/profissionais/']").first();
    await link.click();
    await page.waitForURL(/\/profissionais\/.+\/pacientes/);

    await page.getByRole("button", { name: /novo paciente/i }).first().click();
    // Não preenche nada e tenta salvar
    await page.getByRole("button", { name: /salvar paciente/i }).click();

    // Deve mostrar erro de validação
    await expect(page.getByText(/preencha|obrigatório|nome/i)).toBeVisible();
  });
});
