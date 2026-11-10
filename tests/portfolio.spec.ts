import { test, expect } from "@playwright/test";
test("notebook, disclosures, project navigation and restored selection", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/about");
  await page.getByRole("tab", { name: "Sketch", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Build", exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("ASSEMBLY STUDY");
  await page.getByRole("tab", { name: "Test", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText("No measurements");
  await page.goto("/experience");
  await page.locator("summary").first().click();
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await page.goto("/projects");
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
  await expect(
    page
      .getByRole("navigation", { name: "Explore sections" })
      .getByRole("link"),
  ).toHaveCount(4);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/projects");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator(".gallery-count")).toHaveText("1 of 3");
  await page.getByRole("button", { name: "Previous project" }).click();
  await expect(page.locator(".gallery-count")).toHaveText("3 of 3");
  await expect(
    page.getByRole("heading", { name: "Humline", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".project-card.center img")).toHaveAttribute(
    "alt",
    /Humline/,
  );
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
  await page.goto("/projects");
  await expect(page.locator(".reduced-project-list")).toBeVisible();
  await page.goto("/");
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
  await page
    .getByRole("link", { name: /Projects/ })
    .first()
    .click();
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
    window.scrollTo({ top: 1900, behavior: "instant" }),
  );
  await expect.poll(read).toBeGreaterThan(0.5);
  await page.screenshot({ path: "/tmp/portfolio-bridge.png" });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(read).toBe(0);
  // At the end of the trace the pads light up and are the links.
  await page.getByRole("link", { name: "Explore sections" }).click();
  await expect.poll(read).toBeGreaterThan(0.99);
  await page.screenshot({ path: "/tmp/portfolio-board.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const pads = page
    .getByRole("navigation", { name: "Explore sections" })
    .getByRole("link");
  for (let k = 0; k < 4; k++) {
    const box = (await pads.nth(k).boundingBox())!;
    expect(box.x >= 0 && box.x + box.width <= 1440).toBe(true);
    expect(box.y >= 0 && box.y + box.height <= 1000).toBe(true);
  }
  await pads.nth(2).click();
  await expect(page).toHaveURL(/\/projects$/);
});
test("directory pose holds through reversal and resize with links on their pads", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const travel = () =>
    page
      .locator(".intro")
      .evaluate((el) =>
        Number((el as HTMLElement).style.getPropertyValue("--travel")),
      );
  const scrollToProgress = (p: number) =>
    page.evaluate((p) => {
      const el = document.querySelector<HTMLElement>(".intro")!;
      const top = el.getBoundingClientRect().top + scrollY;
      scrollTo({
        top: top + p * (el.offsetHeight - innerHeight),
        behavior: "instant",
      });
    }, p);
  const boxes = () =>
    page
      .locator(".contact-directory a")
      .evaluateAll((links) =>
        links.map((a) =>
          ["x", "y", "width", "height"]
            .map((k) => Math.round(a.getBoundingClientRect()[k as "x"]))
            .join(),
        ),
      );
  await scrollToProgress(0.92);
  await expect.poll(travel).toBeCloseTo(0.92, 2);
  const settled = await boxes();
  await scrollToProgress(1);
  await expect.poll(travel).toBe(1);
  expect(await boxes()).toEqual(settled);
  // Pads light (and labels pop) as their pulses arrive: the nearer 03 and 04 first.
  const lit = () =>
    page
      .locator(".contact-directory a")
      .evaluateAll((links) => links.map((a) => a.classList.contains("lit")));
  expect(await lit()).toEqual([true, true, true, true]);
  await scrollToProgress(0.79);
  await expect.poll(travel).toBeCloseTo(0.79, 2);
  expect(await lit()).toEqual([false, false, true, true]);
  await scrollToProgress(0.6);
  await expect.poll(travel).toBeCloseTo(0.6, 2);
  expect(await lit()).toEqual([false, false, false, false]);
  // Rapid forward/back without waiting lands on the same pose.
  for (const p of [0.3, 0.95, 0.05, 0.7]) await scrollToProgress(p);
  await scrollToProgress(1);
  await expect.poll(travel).toBe(1);
  expect(await boxes()).toEqual(settled);
  // Resize mid-journey, then arrive: each hit circle is centred on its drawn pad,
  // and the four labelled links fit without overlapping.
  await scrollToProgress(0.6);
  await page.setViewportSize({ width: 1000, height: 760 });
  await scrollToProgress(1);
  await expect.poll(travel).toBe(1);
  const layout = await page.locator(".intro").evaluate((intro) => {
    const dir = intro
      .querySelector(".contact-directory")!
      .getBoundingClientRect();
    const pad = parseFloat(
      (intro as HTMLElement).style.getPropertyValue("--pad-size"),
    );
    return [...intro.querySelectorAll<HTMLElement>(".contact-directory a")].map(
      (a) => {
        const r = a.getBoundingClientRect();
        return {
          dx:
            r.right -
            pad / 2 -
            dir.left -
            parseFloat(a.style.getPropertyValue("--pad-x")),
          dy:
            r.top +
            r.height / 2 -
            dir.top -
            parseFloat(a.style.getPropertyValue("--pad-y")),
          box: [r.left, r.top, r.right, r.bottom],
        };
      },
    );
  });
  for (const [k, { dx, dy, box }] of layout.entries()) {
    expect(Math.abs(dx)).toBeLessThan(1);
    expect(Math.abs(dy)).toBeLessThan(1);
    expect(box[0] >= 0 && box[1] >= 0 && box[2] <= 1000 && box[3] <= 760).toBe(
      true,
    );
    if (k) expect(box[1]).toBeGreaterThanOrEqual(layout[k - 1].box[3]);
  }
});
test("phone return trip restores the selected project", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects");
  await expect(page.locator(".gallery-count")).toHaveText("1 of 3");
  await page.getByRole("button", { name: "Next project" }).click();
  await page.locator("#active-project-link").click();
  await expect(page).toHaveURL(/projects\/facetracekr/);
  // Unfilled case-study fields take no space.
  await expect(page.locator(".case-facts")).toHaveCount(0);
  await page.getByRole("link", { name: "All projects" }).click();
  await expect(page.locator(".project-description h3")).toHaveText(
    "FaceTracekr",
  );
  await expect(page.locator("#active-project-link")).toBeFocused();
  // Browser Back, separately.
  await page.locator("#active-project-link").click();
  await expect(page).toHaveURL(/projects\/facetracekr/);
  await page.goBack();
  await expect(page.locator(".project-description h3")).toHaveText(
    "FaceTracekr",
  );
  // A fresh tab has no sessionStorage; the return link's URL carries the slug.
  const fresh = await context.newPage();
  await fresh.setViewportSize({ width: 390, height: 844 });
  await fresh.goto("/projects/humline");
  await fresh.getByRole("link", { name: "All projects" }).click();
  await expect(fresh.locator(".gallery-count")).toHaveText("3 of 3");
  await expect(fresh.locator("#active-project-link")).toBeFocused();
  // And a plain fresh visit still defaults to the first project.
  const plain = await context.browser()!.newContext();
  const first = await plain.newPage();
  await first.goto("http://127.0.0.1:3001/projects");
  await expect(first.locator(".project-description h3")).toHaveText(
    "WireTrace",
  );
  await plain.close();
});
test("repeated steps leave one selected print matching its title", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/projects");
  for (const name of ["Next", "Next", "Previous", "Next", "Previous"])
    await page.getByRole("button", { name: `${name} project` }).click();
  await expect(page.locator(".project-card.center")).toHaveCount(1);
  await expect(page.locator(".project-description h3")).toHaveText(
    "FaceTracekr",
  );
  await expect(page.locator("#active-project-link")).toHaveAttribute(
    "href",
    "/projects/facetracekr",
  );
  await expect(
    page.getByRole("button", { name: "Show FaceTracekr" }),
  ).toHaveAttribute("aria-pressed", "true");
});
