import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("homepage communicates the product and passes automated accessibility checks", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /GPU jobs that finish/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Run the interactive failure demo/i })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

for (const route of ["/console", "/architecture", "/providers", "/blueprint"]) {
  test(`${route} passes automated accessibility checks`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main h1").first()).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, `${route} accessibility violations`).toEqual([]);
  });
}

test("golden run settles and verifies its receipt in the browser", async ({ page }) => {
  await page.goto("/console");
  await page.getByRole("button", { name: /Launch demo run/i }).click();
  await expect(page.getByText("CHECKPOINT_18", { exact: true })).toBeVisible({ timeout: 12_000 });
  const clean = page.getByRole("button", { name: /Continue clean/i });
  await expect(clean).toBeEnabled();
  await clean.click();
  await expect(page.getByRole("status", { name: "Run status: Settled" })).toBeVisible();
  await expect(page.getByText("7 blocks", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Verify chain in browser/i }).click();
  await expect(page.getByText(/Verified in this browser/i)).toBeVisible();
});

test("host loss recovers from a checkpoint", async ({ page }) => {
  await page.goto("/console");
  await page.getByRole("button", { name: /Launch demo run/i }).click();
  await expect(page.getByText("CHECKPOINT_18", { exact: true })).toBeVisible({ timeout: 12_000 });
  const disconnect = page.getByRole("button", { name: /Disconnect host/i });
  await expect(disconnect).toBeEnabled();
  await disconnect.click();
  await expect(page.getByText("HEARTBEAT_LOST", { exact: true })).toBeVisible();
  await expect(page.getByText("CHECKPOINT_RESTORED", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Continue clean/i })).toBeDisabled();
  await expect(disconnect).toBeDisabled();
  await expect(page.getByRole("button", { name: /Corrupt output/i })).toBeDisabled();
  await expect(page.getByRole("status", { name: "Run status: Settled" })).toBeVisible();
  await expect(page.getByText("9 blocks", { exact: true })).toBeVisible();
});

test("bad output is rejected and provider payout stays at zero", async ({ page }) => {
  await page.goto("/console");
  await page.getByRole("button", { name: /Launch demo run/i }).click();
  await expect(page.getByText("CHECKPOINT_18", { exact: true })).toBeVisible({ timeout: 12_000 });
  const corrupt = page.getByRole("button", { name: /Corrupt output/i });
  await expect(corrupt).toBeEnabled();
  await corrupt.click();
  await expect(page.getByRole("status", { name: "Run status: Rejected" })).toBeVisible();
  await expect(page.getByText("Receipt withheld", { exact: true })).toBeVisible();
  await expect(page.getByText("Provider pending", { exact: true })).toBeVisible();
});
