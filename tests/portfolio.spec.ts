import { test, expect } from "@playwright/test";
test("notebook, disclosures, project navigation and restored selection", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".scene-ready")).toBeVisible();
  await page.getByRole("tab", { name: "Sketch", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Build", exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("ASSEMBLY STUDY");
  await page.getByRole("tab", { name: "Test", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText("No measurements");
  await page.locator("summary").first().click();
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await page.getByRole("button", { name: "Next project", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "FaceTracekr", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Explore project" }).click();
  await expect(page).toHaveURL(/projects\/facetracekr/);
  await page.getByRole("link", { name: "All projects" }).click();
  await expect(
    page.getByRole("heading", { name: "FaceTracekr", exact: true }),
  ).toBeVisible();
  await expect(page.locator("#active-project-link")).toBeFocused();
  expect(errors).toEqual([]);
});
test("direct routes, missing page and wiring interaction", async ({ page }) => {
  for (const slug of ["wiretrace", "facetracekr", "humline", "hanoi-gantry"]) {
    const r = await page.goto("/projects/" + slug);
    expect(r?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  }
  await page.goto("/projects/wiretrace");
  await page.getByRole("button", { name: "Show misplaced jumper" }).click();
  await expect(page.getByRole("status")).toContainText("one row too low");
  await page.getByRole("button", { name: "Ground net" }).click();
  await expect(
    page.getByRole("button", { name: "Ground net" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect((await page.goto("/projects/missing"))?.status()).toBe(404);
});
test("mobile snap gallery and page fit", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Show Humline", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Humline", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".project-card.center")).toContainText("Humline");
  await page
    .locator(".turntable")
    .evaluate((el) => el.scrollTo({ left: 0, behavior: "instant" }));
  await expect(
    page.getByRole("heading", { name: "WireTrace", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: "/tmp/portfolio-mobile.png", fullPage: true });
});
test("reduced motion and disabled canvas retain navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page
      .locator(".intro-stage")
      .evaluate((el) => getComputedStyle(el).position),
  ).toBe("relative");
  await expect(page.locator(".reduced-project-list")).toBeVisible();
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = (() =>
      null) as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.reload();
  await expect(page.locator(".board-fallback")).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Explore sections" })
      .getByRole("link"),
  ).toHaveCount(4);
});
test("no JavaScript retains chapters, project links and disclosure", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3001");
  await expect(page.locator(".board-fallback")).toBeVisible();
  await page.getByRole("link", { name: /Humline —/ }).click();
  await expect(page.locator("h1")).toHaveText("Humline");
  await context.close();
});
test("scroll camera reverses deterministically and desktop layout fits", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.screenshot({ path: "/tmp/portfolio-opening.png" });
  const read = () =>
    page
      .locator(".intro")
      .evaluate((el) =>
        Number((el as HTMLElement).style.getPropertyValue("--travel")),
      );
  await page.evaluate(() =>
    window.scrollTo({ top: 1100, behavior: "instant" }),
  );
  await expect.poll(read).toBeGreaterThan(0.5);
  await page.screenshot({ path: "/tmp/portfolio-bridge.png" });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(read).toBe(0);
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "/tmp/portfolio-projects.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
