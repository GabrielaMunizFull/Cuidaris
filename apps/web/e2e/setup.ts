/**
 * Setup: faz login via rota de teste que usa Supabase SSR server-side.
 * Os cookies de sessão são setados corretamente pelo servidor.
 */
import { test as setup } from "@playwright/test";
import path from "path";
import fs from "fs";

const authDir = path.join(__dirname, ".auth");

async function saveSession(
  page: import("@playwright/test").Page,
  email: string,
  password: string,
  file: string
) {
  // Chama a rota de teste — o servidor faz signInWithPassword e seta os cookies SSR
  const response = await page.request.post("http://localhost:3000/api/test-login", {
    data: { email, password },
  });

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`Login falhou para ${email}: ${body}`);
  }

  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });
  await page.context().storageState({ path: file });
}

setup("sessão usuária A", async ({ page }) => {
  await saveSession(
    page,
    process.env.TEST_USER_A_EMAIL ?? "testes_a@cuidaris.dev",
    process.env.TEST_USER_A_PASSWORD ?? "TesteCuidaris@123",
    path.join(authDir, "user-a.json")
  );
});

setup("sessão usuária B", async ({ page }) => {
  await saveSession(
    page,
    process.env.TEST_USER_B_EMAIL ?? "testes_b@cuidaris.dev",
    process.env.TEST_USER_B_PASSWORD ?? "TesteCuidaris@123",
    path.join(authDir, "user-b.json")
  );
});
