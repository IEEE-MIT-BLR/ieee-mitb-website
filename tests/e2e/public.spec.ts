import { expect, test } from "@playwright/test";

/**
 * Smoke tests for the public site and the admin auth gate.
 *
 * These run a production build against a live, migrated + seeded Supabase
 * project (set the env in `.env.local` / CI secrets). Without a real database
 * the dynamic pages will error, so this suite is excluded from the default CI
 * job — run it with `npm run test:e2e` once Supabase is connected.
 *
 * Headings are matched at `level: 1` so a page's own title is asserted rather
 * than an incidental section/card heading further down the page.
 */
test("home page renders the hero", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: /Advancing technology/i }),
  ).toBeVisible();
});

test("events page renders", async ({ page }) => {
  await page.goto("/events");
  await expect(
    page.getByRole("heading", { level: 1, name: "Events" }),
  ).toBeVisible();
});

test("societies overview renders", async ({ page }) => {
  await page.goto("/societies");
  await expect(
    page.getByRole("heading", { level: 1, name: "Societies" }),
  ).toBeVisible();
});

test("admin area redirects unauthenticated users to login", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
});
