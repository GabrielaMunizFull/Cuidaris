/**
 * Testes de isolamento multi-tenant.
 * Usuária B nunca deve ver dados de usuária A.
 *
 * PRÉ-REQUISITO: criar as duas usuárias no Supabase e um profissional
 * com paciente para a usuária A antes de rodar.
 */
import { test, expect, type Browser } from "@playwright/test";
import { loginA, loginB } from "./helpers/auth";
import path from "path";

// Usuária A — contexto com sessão salva
const authA = path.join(__dirname, ".auth/user-a.json");
const authB = path.join(__dirname, ".auth/user-b.json");

test.describe("Isolamento multi-tenant", () => {
  test("usuária B não vê profissionais de A", async ({ browser }: { browser: Browser }) => {
    // Logar como A e pegar ID de um profissional
    const ctxA = await browser.newContext({ storageState: authA });
    const pageA = await ctxA.newPage();
    await pageA.goto("/profissionais");
    const linkProfissional = pageA.locator("a[href^='/profissionais/']").first();
    const href = await linkProfissional.getAttribute("href");
    await ctxA.close();

    if (!href) {
      test.skip(true, "Nenhum profissional cadastrado para usuária A");
      return;
    }

    // Logar como B e tentar acessar o mesmo profissional diretamente pela URL
    const ctxB = await browser.newContext({ storageState: authB });
    const pageB = await ctxB.newPage();
    await pageB.goto(href);

    // Deve retornar 404 ou redirecionar, nunca mostrar dados de A
    const url = pageB.url();
    const is404 = await pageB.locator("h2", { hasText: /404|não encontrado/i }).isVisible().catch(() => false);
    const redirectedAway = !url.includes(href.split("/")[2] ?? "");
    expect(is404 || redirectedAway).toBeTruthy();

    await ctxB.close();
  });

  test("usuária B vê dashboard próprio vazio (não dados de A)", async ({ browser }: { browser: Browser }) => {
    const ctxA = await browser.newContext({ storageState: authA });
    const pageA = await ctxA.newPage();
    await pageA.goto("/dashboard");
    // Pegar nome de um profissional de A
    const nomeProfissional = await pageA.locator("text=/Dra?\\./").first().textContent().catch(() => null);
    await ctxA.close();

    if (!nomeProfissional) {
      test.skip(true, "Nenhum profissional visível para usuária A");
      return;
    }

    const ctxB = await browser.newContext({ storageState: authB });
    const pageB = await ctxB.newPage();
    await pageB.goto("/dashboard");
    // B não deve ver o profissional de A
    await expect(pageB.getByText(nomeProfissional)).not.toBeVisible();
    await ctxB.close();
  });
});
