import type { Page } from "@playwright/test";

export const TEST_USER_A = {
  email: process.env.TEST_USER_A_EMAIL ?? "testes_a@cuidaris.dev",
  password: process.env.TEST_USER_A_PASSWORD ?? "TesteCuidaris@123",
};

export const TEST_USER_B = {
  email: process.env.TEST_USER_B_EMAIL ?? "testes_b@cuidaris.dev",
  password: process.env.TEST_USER_B_PASSWORD ?? "TesteCuidaris@123",
};

export async function login(page: Page, email: string, password: string) {
  await page.goto("/login", { waitUntil: "networkidle" });

  // Usa seletores por ID — mais confiável que getByLabel
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.locator('button[type="submit"]').click();

  // Aguarda redirecionamento para o dashboard
  await page.waitForURL("**/dashboard", { timeout: 30_000 });
}

export async function loginA(page: Page) {
  return login(page, TEST_USER_A.email, TEST_USER_A.password);
}

export async function loginB(page: Page) {
  return login(page, TEST_USER_B.email, TEST_USER_B.password);
}
