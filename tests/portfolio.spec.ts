import { test, expect, type Page } from "@playwright/test";
import data from "../content/site.json";

const blocks = [
  "boot",
  "origin",
  "skills",
  "experience",
  "projects",
  "beyond",
  "goals",
  "connect",
];
// Tests of the HTML layer skip the 3D scene: reduced motion selects the static tier.
const still = { reducedMotion: "reduce" as const };
const order = (page: Page) =>
  page
    .locator("[data-block]")
    .evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.block));

test.describe("home page without the 3D scene", () => {
  test.use(still);
  test("has one h1, eight blocks in order, and no canvas", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("John");
    expect(await order(page)).toEqual(blocks);
    await expect(page.locator("canvas")).toHaveCount(0);
    // Every step is readable at once: nothing is hidden behind scroll position.
    for (const o of data.origin)
      await expect(page.getByRole("heading", { name: o.title })).toBeVisible();
    expect(errors).toEqual([]);
  });
  test("header links reach their sections", async ({ page }) => {
    await page.goto("/");
    for (const id of ["origin", "experience", "projects", "goals"]) {
      await page
        .getByRole("navigation", { name: "Main" })
        .locator(`a[href="/#${id}"]`)
        .click();
      await expect(page.locator("#" + id)).toBeInViewport();
    }
  });
  test("empty content shows as labelled DNP slots", async ({ page }) => {
    await page.goto("/");
    expect(data.showEmptySlots).toBe(true);
    await expect(page.locator("#origin .slot").first()).toContainText("DNP");
    await expect(page.locator("#connect")).toContainText("Email: add");
    await expect(
      page.locator("#connect").getByRole("link", { name: "GitHub" }),
    ).toHaveAttribute("href", data.profile.githubUrl);
  });
  test("skills filter and highlight", async ({ page }) => {
    await page.goto("/");
    const cad = page.getByRole("button", { name: "CAD", exact: true });
    await cad.click();
    await expect(cad).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".skills li", { hasText: "Python" })).toHaveAttribute("data-dim", "");
    await expect(page.locator(".skills li", { hasText: "SolidWorks" })).not.toHaveAttribute("data-dim", "");
    await page.getByRole("button", { name: "All", exact: true }).click();
    await page
      .locator(".skills li", { hasText: "Python" })
      .getByRole("link", { name: /Used in HeadNav/ })
      .focus();
    await expect(page.locator(".skills li", { hasText: "Python" })).toHaveAttribute("data-lit", "");
  });
  test("featured projects open their datasheets", async ({ page }) => {
    for (const p of data.projects.filter((p) => p.featured)) {
      await page.goto("/");
      await page
        .locator("#projects article", { hasText: p.title })
        .getByRole("link", { name: "Read the datasheet" })
        .click();
      await expect(page).toHaveURL(new RegExp("/projects/" + p.slug));
      await expect(page.locator("h1")).toHaveText(p.title);
    }
  });
  test("phone layout stacks and never scrolls sideways", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390);
    await expect(page.locator(".rail")).toBeHidden();
    const stories = page.locator("#origin .story");
    const [a, b] = [await stories.nth(0).boundingBox(), await stories.nth(1).boundingBox()];
    expect(b!.y).toBeGreaterThan(a!.y + a!.height - 1);
  });
});

test("3D scene loads and scroll-stepping is reversible", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-scene", "ready", {
    timeout: 20000,
  });
  await expect(page.locator("canvas")).toHaveCount(1);
  const jump = (id: string, f: number) =>
    page.evaluate(
      ([id, f]) => {
        const s = document.getElementById(id as string)!;
        scrollTo({
          top: s.offsetTop + (s.offsetHeight - innerHeight) * (f as number),
          behavior: "instant",
        });
      },
      [id, f],
    );
  // One origin story at a time, chosen by scroll position.
  await jump("origin", 0.9);
  await expect(page.locator("#origin [data-step='2']")).toHaveAttribute("data-current", "");
  await expect(page.locator("#origin [data-step='0']")).not.toHaveAttribute("data-current", "");
  await expect(page.locator(".rail a[aria-current]")).toHaveText("Origin");
  await jump("connect", 1);
  await expect(page.locator(".rail a[aria-current]")).toHaveText("Connect");
  await jump("boot", 0);
  await expect(page.locator(".rail a[aria-current]")).toHaveText("Start");
  await expect
    .poll(
      async () => {
        const value = await page
          .locator("#boot")
          .evaluate((e) => e.style.getPropertyValue("--p"));
        // Image load can nudge scroll on the heavier home page. Put it back.
        if (value !== "0.0000") await jump("boot", 0);
        return value;
      },
      { timeout: 15_000 },
    )
    .toBe("0.0000");
  // Focusing a link in a hidden step scrolls that step into its turn.
  await page.locator("#projects [data-step='2'] a").first().focus();
  await expect(page.locator("#projects [data-step='2']")).toHaveAttribute("data-current", "");
  expect(errors).toEqual([]);
});

test("no JavaScript keeps every section and link", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3001");
  expect(await order(page)).toEqual(blocks);
  for (const o of data.origin)
    await expect(page.getByRole("heading", { name: o.title })).toBeVisible();
  await page
    .locator("#projects article", { hasText: "Humline" })
    .getByRole("link", { name: "Read the datasheet" })
    .click();
  await expect(page.locator("h1")).toHaveText("Humline");
  await context.close();
});

test("datasheet pages: notebook, disclosures, routes, 404 and wiring demo", async ({
  page,
}) => {
  test.setTimeout(45_000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/about");
  await expect(page.locator("footer")).toContainText("Next.js");
  await page.getByRole("tab", { name: "Sketch", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Build", exact: true })).toBeFocused();
  await page.goto("/experience");
  await page.locator("summary").first().click();
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await page.goto("/goals");
  await expect(page.getByRole("heading", { name: "Automotive" })).toBeVisible();
  await page.goto("/projects");
  await expect(page.locator(".project-index li")).toHaveCount(data.projects.length);
  for (const p of data.projects) {
    const r = await page.goto("/projects/" + p.slug);
    expect(r?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(p.title);
    if (p.slug === "headnav") {
      await expect(page.getByRole("link", { name: "View repository" })).toHaveAttribute(
        "href",
        "https://github.com/The-John-Man/FaceTrackerJohn",
      );
    }
    if (p.slug === "wiretrace") {
      await expect(page.getByRole("link", { name: "Try the demo" })).toHaveAttribute(
        "href",
        /visualizer-starter/,
      );
      await expect(
        page.getByRole("slider", { name: "Compare landing page and visualizer" }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Show misplaced jumper" }).click();
      await expect(page.getByRole("status")).toContainText("one row too low");
      await page.getByRole("link", { name: "Back to the board" }).click();
      await expect(page).toHaveURL(/\/#projects$/);
    }
  }
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Drawing board/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Build North/ })).toHaveAttribute(
    "href",
    "/projects/humline",
  );
  expect((await page.goto("/projects/missing"))?.status()).toBe(404);
  expect(errors).toEqual([]);
});
