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
      visible = true;
    function draw() {
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
      const p =
        reduced.matches || mobile.matches
          ? 0
          : Math.max(0, Math.min(1, -r.top / (r.height - innerHeight)));
      el.style.setProperty("--travel", String(p));
      el.style.setProperty("--title-opacity", String(Math.max(0, 1 - p * 4)));
      const yaw = 0.32 * (1 - p),
        pitch = 0.68 + p * 0.89;
      const zoom = 1 + Math.sin(p * Math.PI) * 0.4;
      const scale = Math.min(w / 13, h / 8) * zoom;
      const center = w * (0.68 - 0.18 * p);
      const project = ([x, y, z]: V): [number, number] => {
        const xx = x * Math.cos(yaw) - z * Math.sin(yaw),
          zz = x * Math.sin(yaw) + z * Math.cos(yaw);
        return [
          center + (xx - p * 0.7) * scale,
          h * 0.45 + (zz * Math.sin(pitch) - y * Math.cos(pitch)) * scale,
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
      function block(
        x: number,
        z: number,
        width: number,
        depth: number,
        height: number,
      ) {
        path(
          [
            [x, 0, z],
            [x + width, 0, z],
            [x + width, height, z],
            [x, height, z],
          ],
          "#525b60",
        );
        path(
          [
            [x + width, 0, z],
            [x + width, 0, z + depth],
            [x + width, height, z + depth],
            [x + width, height, z],
          ],
          "#434a4f",
        );
        path(
          [
            [x, height, z],
            [x + width, height, z],
            [x + width, height, z + depth],
            [x, height, z + depth],
          ],
          "#1d2228",
        );
      }
      ctx.globalAlpha = p > 0.92 ? 1 - (p - 0.92) / 0.08 : 1;
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
      for (let i = 0; i < 15; i++) {
        const z = -2.8 + i * 0.4;
        path(
          [
            [-5, 0.02, z],
            [-3.5, 0.02, z],
            [-2.8, 0.02, z * 0.7],
            [4.9, 0.02, z * 0.7],
          ],
          null,
          "#b9c0b5",
          1,
        );
      }
      for (let i = 0; i < 8; i++) {
        const z = -0.95 + i * 0.27;
        path(
          [
            [-3.5, 0.15, z],
            [-2.8, 0.15, z],
          ],
          null,
          "#8c9696",
          6,
        );
        path(
          [
            [-1, 0.15, z],
            [-0.5, 0.15, z],
          ],
          null,
          "#8c9696",
          6,
        );
      }
      block(-2.9, -1.3, 1.9, 2.6, 0.45);
      disk(-2.55, 0.46, -0.95, 0.08, "#d5d9d0");
      // One continuous conductor climbs an insulated bridge before branching to four pads.
      const route: V[] = [
        [-0.55, 0.14, 0.35],
        [0.1, 0.14, 0.35],
        [0.8, 0.14, 1.05],
      ];
      for (let i = 0; i <= 48; i++) {
        const t = i / 48;
        route.push([0.8 + t * 2.4, 0.14 + Math.sin(t * Math.PI) * 1.8, 1.05]);
      }
      route.push([4, 0.14, 1.05]);
      path(
        route.map(([x, , z]) => [x, 0.03, z + 0.1]),
        null,
        "#a7afa455",
        10,
      );
      path(route, null, "#1735a5", 8);
      path(
        route.map(([x, y, z]) => [x, y + 0.025, z]),
        null,
        "#4268ed",
        3,
      );
      const distances = [0];
      for (let i = 1; i < route.length; i++)
        distances.push(
          distances[i - 1] +
            Math.hypot(...route[i].map((n, j) => n - route[i - 1][j])),
        );
      const target = (0.03 + p * 0.97) * distances.at(-1)!;
      let i = 1;
      while (i < distances.length - 1 && distances[i] < target) i++;
      const t = (target - distances[i - 1]) / (distances[i] - distances[i - 1]);
      const signal = route[i].map(
        (n, j) => route[i - 1][j] + (n - route[i - 1][j]) * t,
      ) as V;
      disk(signal[0], signal[1] + 0.06, signal[2], 0.11, "#fff");
      for (let k = 0; k < 4; k++) {
        const z = -2.4 + k * 1.5;
        path(
          [
            [4, 0.12, 1.05],
            [4.5, 0.12, z],
          ],
          null,
          "#2448cf",
          3,
        );
        disk(4.5, 0.13, z, 0.22, "#828f91");
        disk(4.5, 0.15, z, 0.12, "#faf9f2");
      }
      ctx.globalAlpha = 1;
      // Finish on the same screen-space contact centers as the HTML directory.
      const links = el.querySelectorAll<HTMLElement>(".contact-dot");
      if (p > 0.78) {
        ctx.globalAlpha = (p - 0.78) / 0.22;
        const points = Array.from(links).map((n) => {
          const r = n.getBoundingClientRect();
          return [
            r.left + r.width / 2 - box.left,
            r.top + r.height / 2 - box.top,
          ];
        });
        ctx.strokeStyle = "#2448cf";
        ctx.lineWidth = 2;
        points.forEach(([x, y]) => {
          ctx.beginPath();
          ctx.moveTo(w * 0.5, h * 0.48);
          ctx.lineTo(w * 0.5, y - 45);
          ctx.lineTo(x, y - 45);
          ctx.lineTo(x, y);
          ctx.stroke();
        });
        ctx.globalAlpha = 1;
      }
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
      el.classList.remove("scene-ready");
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
          <a className="text-link" href="#directory">
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
            <a href={"#" + id} key={id}>
              <span className="contact-dot" />
              <small>0{i + 1}</small>
              <strong>{title}</strong>
              <Arrow />
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
