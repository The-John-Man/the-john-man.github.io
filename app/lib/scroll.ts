// One scroll listener for the home page. HTML reads `--p` / `data-current`; the 3D rig reads `scroll`.
export const clamp = (n: number) => Math.max(0, Math.min(1, n));
export const ease = (t: number) => t * t * (3 - 2 * t);
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** g = section index + how far the viewport centre is through that section (0–1). */
export const scroll = {
  g: 0,
  index: 0,
  p: {} as Record<string, number>,
  step: {} as Record<string, number>,
};
const subs = new Set<() => void>();
export function onScroll(fn: () => void) {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}
/** Pinned, stepped layouts apply only with motion allowed and room for two columns. */
export const scrubbing = () =>
  document.documentElement.classList.contains("scrub") &&
  matchMedia("(min-width: 901px)").matches;

export function watchScroll() {
  let frame = 0;
  function update() {
    frame = 0;
    const ih = innerHeight;
    const sections = document.querySelectorAll<HTMLElement>("[data-block]");
    sections.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const name = el.dataset.block!;
      // p: progress through the pinned part. c: progress of the viewport centre.
      const p = clamp(-r.top / Math.max(1, r.height - ih));
      const c = (ih / 2 - r.top) / r.height;
      el.style.setProperty("--p", p.toFixed(4));
      scroll.p[name] = p;
      const steps = Number(el.dataset.steps);
      if (steps) {
        const step = Math.min(steps - 1, Math.floor(p * steps));
        if (scroll.step[name] !== step) {
          scroll.step[name] = step;
          el.querySelectorAll<HTMLElement>("[data-step]").forEach((s) =>
            s.toggleAttribute("data-current", Number(s.dataset.step) === step),
          );
        }
      }
      const active = c >= 0 && c < 1;
      el.toggleAttribute("data-active", active);
      if (active) {
        scroll.index = i;
        scroll.g = i + c;
      }
    });
    document.documentElement.style.setProperty(
      "--scroll",
      clamp(
        scrollY / Math.max(1, document.documentElement.scrollHeight - ih),
      ).toFixed(4),
    );
    subs.forEach((fn) => fn());
  }
  const refresh = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  // A hidden step that receives focus (Tab, screen reader) is scrolled into its turn.
  function reveal(e: FocusEvent) {
    const panel = (e.target as HTMLElement).closest<HTMLElement>("[data-step]");
    const section = panel?.closest<HTMLElement>("[data-steps]");
    if (!panel || !section || panel.hasAttribute("data-current")) return;
    if (!scrubbing() || section.querySelector(".steps.all")) return;
    const r = section.getBoundingClientRect();
    scrollTo({
      top:
        scrollY +
        r.top +
        ((Number(panel.dataset.step) + 0.5) / Number(section.dataset.steps)) *
          (r.height - innerHeight),
      behavior: "instant",
    });
  }
  addEventListener("scroll", refresh, { passive: true });
  addEventListener("resize", refresh);
  document.addEventListener("focusin", reveal);
  update();
  return () => {
    cancelAnimationFrame(frame);
    removeEventListener("scroll", refresh);
    removeEventListener("resize", refresh);
    document.removeEventListener("focusin", reveal);
  };
}
