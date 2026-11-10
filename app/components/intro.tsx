"use client";
import { useEffect, useRef } from "react";
import { Arrow } from "./icons";
const chapters = [
  ["about", "About me"],
  ["experience", "Work experience"],
  ["projects", "Projects"],
  ["goals", "Goals & aspirations"],
];
type V = [number, number, number];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const FINAL_PITCH = 1.2;
const pads = [-2.25, -0.75, 0.75, 2.25];
// One conductor: a board trace from the chip, an insulated jumper arching between two
// solder pads (a half ellipse, so both legs drop vertically into them), then a trace on.
const feet = [0.5, 2.7];
// The jumper runs midway between contacts 3 and 4, so neither label sits on its line.
const lane = 1.5;
const route: V[] = [
  [-0.55, 0.01, 0.94],
  [-0.1, 0.01, 0.94],
];
for (let i = 0; i <= 48; i++) {
  const a = (i / 48) * Math.PI;
  route.push([
    mix(feet[0], feet[1], (1 - Math.cos(a)) / 2),
    0.01 + 1.25 * Math.sin(a),
    lane,
  ]);
}
route.push([4, 0.01, lane]);
const dist = [0];
for (let i = 1; i < route.length; i++)
  dist.push(
    dist[i - 1] + Math.hypot(...route[i].map((n, j) => n - route[i - 1][j])),
  );
const length = dist.at(-1)!;
function at(d: number): V {
  let i = 1;
  while (i < route.length - 1 && dist[i] < d) i++;
  const t = clamp((d - dist[i - 1]) / (dist[i] - dist[i - 1]));
  return route[i].map((n, j) => mix(route[i - 1][j], n, t)) as V;
}
const junction = route.at(-1)!;
// Branch lengths to the four pads. Their pulses share one speed, so nearer pads light first.
const branches = pads.map((z) =>
  Math.hypot(4.5 - junction[0], z - junction[2]),
);
const reach = Math.max(...branches);
// Scroll beats (progress 0–1): name readable until `trace`, follow the trace to the jumper,
// rise beside it to the junction, pause there while the camera settles, split to the pads
// by `lit`, then hold.
const beat = {
  trace: 0.12,
  jumper: 0.4,
  junction: 0.62,
  settled: 0.72,
  lit: 0.88,
};
// Pulse distance along the route by progress.
const pulse = (p: number) =>
  p < beat.trace
    ? mix(0.1, 0.5, p / beat.trace)
    : p < beat.jumper
      ? mix(0.5, dist[2], (p - beat.trace) / (beat.jumper - beat.trace))
      : mix(
          dist[2],
          length,
          clamp((p - beat.jumper) / (beat.junction - beat.jumper)),
        );
// Light comes from above, left and behind: shadows fall toward +x and +z by height.
const shade = ([x, y, z]: V): V => [x + 0.3 * y, 0.004, z + 0.45 * y];
export default function Intro() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = root.current,
      c = canvas.current;
    if (!el || !c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)"),
      mobile = matchMedia("(max-width: 700px)");
    let frame = 0,
      visible = true,
      shown = -1,
      last = 0;
    function draw(now: number) {
      frame = 0;
      if (!el || !c || !ctx || !visible || document.hidden) return;
      const box = c.getBoundingClientRect(),
        w = box.width,
        h = box.height;
      if (!w || !h) return;
      const dpr = Math.min(devicePixelRatio, 1.5);
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const r = el.getBoundingClientRect();
      // Phones get the finished board; reduced motion keeps the still opening view. Both keep
      // the link row underneath: off-screen pads, or too little width for labels beside them.
      const target = reduced.matches
        ? 0
        : mobile.matches
          ? 1
          : clamp(-r.top / (r.height - innerHeight));
      // Glide toward the scroll position (time constant 120ms, frame-rate independent) so
      // wheel steps don't jump the scene; it lands exactly on the target when close.
      const glide = 1 - Math.exp(-Math.min(now - last, 20) / 120);
      last = now;
      shown =
        shown < 0 || reduced.matches || Math.abs(target - shown) < 0.0005
          ? target
          : mix(shown, target, glide);
      const p = shown;
      el.classList.toggle("pinned", !reduced.matches && !mobile.matches);
      el.style.setProperty("--travel", String(p));
      el.style.setProperty(
        "--title-opacity",
        String(clamp(1 - (p - 0.07) / 0.1)),
      );
      const base = Math.min(w / 13, h / 8);
      // The settled pose fits the whole board inside the frame's margins.
      const fit = Math.min(
        (w - 2 * Math.max(16, w * 0.05)) / 10.8,
        (h - 2 * Math.max(40, h * 0.08)) /
          (6.4 * Math.sin(FINAL_PITCH) + 0.2 * Math.cos(FINAL_PITCH)),
      );
      // Camera stops [progress, yaw, pitch, zoom, screen x, screen y], eased to rest at each:
      // opening, along the trace, rising beside the jumper, settled directory (still from
      // `settled` on, so the split plays on a steady frame).
      const stops = [
        [0, 0.32, 0.68, 1, 0.68, 0.45],
        [beat.trace, 0.36, 0.62, 1.2, 0.66, 0.5],
        [beat.jumper, 0.5, 0.56, 1.7, 0.4, 0.56],
        [beat.junction, 0.1, 0.95, 1.6, 0.5, 0.5],
        [beat.settled, 0, FINAL_PITCH, fit / base, 0.5, 0.5],
      ];
      let k = 1;
      while (k < stops.length - 1 && stops[k][0] < p) k++;
      const t = ease(
        clamp((p - stops[k - 1][0]) / (stops[k][0] - stops[k - 1][0])),
      );
      const [, yaw, pitch, zoom, ax, ay] = stops[k].map((v, i) =>
        mix(stops[k - 1][i], v, t),
      );
      // The focal point leads the pulse: half-way to the path ahead, part-way up its height.
      // Averaging nearby progress keeps the pan gradual where the pulse changes pace.
      const focus = [0, 0, 0];
      const follow =
        ease(clamp((p - 0.03) / 0.13)) *
        (1 - ease(clamp((p - beat.junction) / (beat.settled - beat.junction))));
      for (let j = -2; j <= 2; j++) {
        const d = pulse(clamp(p + j * 0.02)),
          s = at(d),
          a = at(Math.min(length, d + 1.2));
        focus[0] += ((s[0] + a[0]) / 10) * follow;
        focus[1] += ((s[1] + a[1]) / 10) * 0.6 * follow;
        focus[2] += ((s[2] + a[2]) / 10) * follow;
      }
      const scale = base * zoom,
        cy = Math.cos(yaw),
        sy = Math.sin(yaw),
        cp = Math.cos(pitch),
        sp = Math.sin(pitch);
      const project = ([x, y, z]: V): [number, number] => {
        const dx = x - focus[0],
          dz = z - focus[2];
        return [
          w * ax + (dx * cy - dz * sy) * scale,
          h * ay + ((dx * sy + dz * cy) * sp - (y - focus[1]) * cp) * scale,
        ];
      };
      function path(
        points: V[],
        fill: string | null,
        stroke?: string,
        width = 1,
      ) {
        if (!ctx) return;
        ctx.beginPath();
        points.forEach((v, i) => {
          const [x, y] = project(v);
          if (i) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        });
        if (fill) {
          ctx.closePath();
          ctx.fillStyle = fill;
          ctx.fill();
        }
        if (stroke) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = width;
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          ctx.stroke();
        }
      }
      function disk(
        x: number,
        y: number,
        z: number,
        radius: number,
        fill: string,
      ) {
        path(
          Array.from(
            { length: 32 },
            (_, i) =>
              [
                x + Math.cos((i * Math.PI) / 16) * radius,
                y,
                z + Math.sin((i * Math.PI) / 16) * radius,
              ] as V,
          ),
          fill,
        );
      }
      // A lit pulse is a small sphere: round on screen from any angle.
      function glow(v: V, size = 1) {
        if (!ctx) return;
        const [x, y] = project(v);
        for (const [radius, fill] of [
          [0.2, "rgba(66, 104, 237, 0.28)"],
          [0.09, "#fff"],
        ] as const) {
          ctx.beginPath();
          ctx.arc(x, y, radius * size * scale, 0, 7);
          ctx.fillStyle = fill;
          ctx.fill();
        }
      }
      // A filled band of varying width along screen points: one fill, so no seams where
      // semi-transparent segments would overlap.
      function ribbon(pts: [number, number][], widths: number[], fill: string) {
        if (!ctx) return;
        const side = (sign: number) =>
          pts.map(([x, y], i) => {
            const [px, py] = pts[Math.max(0, i - 1)],
              [nx, ny] = pts[Math.min(pts.length - 1, i + 1)],
              o = (sign * widths[i]) / 2 / (Math.hypot(nx - px, ny - py) || 1);
            return [x - (ny - py) * o, y + (nx - px) * o];
          });
        ctx.beginPath();
        [...side(1), ...side(-1).reverse()].forEach(([x, y], i) =>
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y),
        );
        ctx.fillStyle = fill;
        ctx.fill();
      }
      // Lighter strokes shifted toward the light (up and left on screen) read as a round section.
      function rounded(points: V[], colors: string[], width: number) {
        if (!ctx) return;
        path(points, null, colors[0], width);
        ctx.save();
        ctx.translate(-width * 0.12, -width * 0.12);
        path(points, null, colors[1], width * 0.5);
        ctx.translate(-width * 0.1, -width * 0.1);
        path(points, null, colors[2], width * 0.18);
        ctx.restore();
      }
      path(
        [
          [-5.4, -0.2, -3.2],
          [5.4, -0.2, -3.2],
          [5.4, -0.2, 3.2],
          [-5.4, -0.2, 3.2],
        ],
        "#d1d5cb",
      );
      path(
        [
          [-5.4, 0, -3.2],
          [5.4, 0, -3.2],
          [5.4, 0, 3.1],
          [-5.4, 0, 3.1],
        ],
        "#e7e8de",
      );
      // Chip: cast shadow, far-side leads, the faces toward the camera, near-side leads.
      const [cx, cz, cw, cd, ch] = [-2.9, -1.3, 1.9, 2.6, 0.5],
        xf = cx + cw;
      path(
        [
          [cx, 0, cz],
          [xf, 0, cz],
          shade([xf, ch, cz]),
          shade([xf, ch, cz + cd]),
          shade([cx, ch, cz + cd]),
          [cx, 0, cz + cd],
        ],
        "rgba(30, 38, 34, 0.14)",
      );
      const lead = (x0: number, s: number, z: number) =>
        rounded(
          [
            [x0, 0.24, z],
            [x0 + s * 0.14, 0.24, z],
            [x0 + s * 0.24, 0.02, z],
            [x0 + s * 0.46, 0.02, z],
          ],
          ["#7a8585", "#a3acaa", "#e3e7e2"],
          0.08 * scale,
        );
      for (let i = 0; i < 8; i++) lead(cx, -1, -0.95 + i * 0.27);
      // Yaw never goes below zero, so the +x and +z sides are the visible ones.
      path(
        [
          [xf, 0, cz],
          [xf, 0, cz + cd],
          [xf, ch, cz + cd],
          [xf, ch, cz],
        ],
        "#3a4248",
      );
      path(
        [
          [cx, 0, cz + cd],
          [xf, 0, cz + cd],
          [xf, ch, cz + cd],
          [cx, ch, cz + cd],
        ],
        "#2b3137",
      );
      path(
        [
          [cx, ch, cz],
          [xf, ch, cz],
          [xf, ch, cz + cd],
          [cx, ch, cz + cd],
        ],
        "#1d2228",
      );
      path(
        [
          [cx, ch, cz + cd],
          [xf, ch, cz + cd],
          [xf, ch, cz],
        ],
        null,
        "#5d666e",
        1.2,
      );
      disk(cx + 0.35, ch + 0.002, cz + 0.35, 0.08, "#d5d9d0");
      for (let i = 0; i < 8; i++) lead(xf, 1, -0.95 + i * 0.27);
      // After the pause at the junction the signal splits; `split` is the share of the
      // longest branch covered.
      const split = reduced.matches
        ? 1
        : clamp((p - beat.settled) / (beat.lit - beat.settled));
      el.style.setProperty("--lit", String(split));
      el.style.setProperty("--pad-size", `${Math.max(44, 0.52 * fit)}px`);
      path(route.slice(0, 3), null, "#2448cf", 0.075 * scale);
      path(route.slice(-2), null, "#2448cf", 0.075 * scale);
      const links = el.querySelectorAll<HTMLElement>(".contact-directory a");
      const tips: V[] = [];
      pads.forEach((z, k) => {
        const pad: V = [4.5, 0.01, z],
          run = clamp((split * reach) / branches[k]),
          tip = junction.map((n, j) => mix(n, pad[j], run)) as V;
        path([junction, pad], null, "#a1aaa0", 0.035 * scale);
        if (run) path([junction, tip], null, "#2448cf", 0.045 * scale);
        if (run && run < 1) tips.push(tip);
        disk(4.5, 0.008, z, 0.26, "#87918e");
        disk(4.5, 0.01, z, 0.225, "#c3c8c0");
        disk(4.5, 0.012, z, 0.12, run >= 1 ? "#2448cf" : "#faf9f2");
        // Its label pops out of the pad as the pulse arrives (see .lit in globals.css).
        links[k]?.classList.toggle("lit", run >= 1);
        // Pin each HTML link onto its pad so the pads are the navigation.
        const [x, y] = project(pad);
        links[k]?.style.setProperty("--pad-x", `${x + c.offsetLeft}px`);
        links[k]?.style.setProperty("--pad-y", `${y + c.offsetTop}px`);
      });
      // Solder pads for the jumper's two legs.
      for (const x of feet) {
        disk(x, 0.006, lane, 0.17, "#87918e");
        disk(x, 0.008, lane, 0.145, "#cbcfc7");
      }
      // Jumper shadow: a dark core at the legs that thins out under the arch, inside a
      // penumbra that widens with height.
      const wire = route.slice(2, -1),
        thick = 0.085 * scale,
        cast = wire.map((v) => project(shade(v)));
      ribbon(
        cast,
        wire.map(([, y]) => (0.1 + 0.22 * y) * scale),
        "rgba(30, 38, 34, 0.08)",
      );
      ribbon(
        cast,
        wire.map(([, y]) => Math.max(0, 0.09 - 0.065 * y) * scale),
        "rgba(30, 38, 34, 0.16)",
      );
      path(wire, null, "#11266c", thick + 1.5);
      rounded(wire, ["#1f40c0", "#3b63ea", "#b5c6ff"], thick - 0.5);
      // Solder fillets where each leg enters its pad.
      for (const x of feet) {
        disk(x, 0.03, lane, 0.085, "#dfe2da");
        disk(x - 0.025, 0.035, lane - 0.02, 0.03, "#fff");
      }
      // During the pause the waiting pulse swells; then each branch carries its own pulse.
      if (!split)
        glow(
          at(pulse(p)),
          1 +
            0.5 *
              ease(clamp((p - beat.junction) / (beat.settled - beat.junction))),
        );
      else tips.forEach((tip) => glow(tip));
      if (p !== target) refresh();
    }
    function refresh() {
      if (!frame && visible && !document.hidden)
        frame = requestAnimationFrame(draw);
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else refresh();
    });
    observer.observe(el);
    const resize = new ResizeObserver(refresh);
    resize.observe(c);
    window.addEventListener("scroll", refresh, { passive: true });
    document.addEventListener("visibilitychange", refresh);
    reduced.addEventListener("change", refresh);
    mobile.addEventListener("change", refresh);
    el.classList.add("scene-ready");
    refresh();
    return () => {
      observer.disconnect();
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", refresh);
      document.removeEventListener("visibilitychange", refresh);
      reduced.removeEventListener("change", refresh);
      mobile.removeEventListener("change", refresh);
      el.classList.remove("scene-ready", "pinned");
    };
  }, []);
  return (
    <section ref={root} className="intro" aria-label="Introduction">
      <div className="intro-stage">
        <div className="hero-copy">
          <p className="eyebrow">Mechanics / electronics / code</p>
          <h1>
            John
            <br />
            Manuel<span className="blue">.</span>
          </h1>
          <p>
            Mechatronics Engineering
            <br />
            University of Waterloo
          </p>
          <a className="text-link" href="#board">
            Explore sections <Arrow />
          </a>
        </div>
        <div className="board-fallback" aria-hidden="true">
          <svg viewBox="0 0 600 400">
            <path
              d="M170 200h100q70-220 140 0h100"
              fill="none"
              stroke="#2448cf"
              strokeWidth="8"
            />
            <rect
              x="80"
              y="120"
              width="120"
              height="160"
              rx="8"
              fill="#17191c"
            />
            <circle
              cx="510"
              cy="200"
              r="14"
              fill="none"
              stroke="#2448cf"
              strokeWidth="5"
            />
          </svg>
        </div>
        <canvas ref={canvas} className="intro-canvas" aria-hidden="true" />
        <p className="scene-note">
          01 / Follow the connection <span>Scroll to trace the signal</span>
        </p>
        <nav
          id="directory"
          className="contact-directory"
          aria-label="Explore sections"
        >
          {chapters.map(([id, title], i) => (
            <a
              href={"/" + id}
              key={id}
              onClick={(e) => {
                // The next page opens as a circle from this pad (see layout.tsx).
                const r = e.currentTarget.getBoundingClientRect();
                const onPad = root.current?.classList.contains("pinned");
                sessionStorage.setItem(
                  "vt-origin",
                  `${Math.round(onPad ? r.right - r.height / 2 : r.left + 10)}px ${Math.round(r.top + r.height / 2)}px`,
                );
              }}
            >
              <span className="contact-dot" />
              <span className="card">
                <small>0{i + 1}</small>
                <strong>{title}</strong>
                <Arrow />
              </span>
            </a>
          ))}
        </nav>
      </div>
      <span id="board" className="intro-end" />
    </section>
  );
}
