// Single source of truth for the 3D board: where things sit, where the signal runs and
// where the camera stands. World units: x across the board, y up, the board runs toward -z.
import { clamp, ease, mix } from "../lib/scroll";

export type V3 = [number, number, number];
export type P2 = [number, number]; // [x, z] on the board surface

export const BOARD = { width: 18, front: 8, back: -150, top: 0 };
export const CHIP: P2 = [2.5, 0];
export const BANK = { centre: [-1.6, -32] as P2, cols: 4, rows: 3, pitch: 2.1 };
export const BUS_Z = -48;
export const MODULES: P2[] = [-64, -72, -80, -88].map((z) => [3, z]);
export const JUNCTION: P2 = [0, -114];
export const USB: P2 = [0, -148.6];
// Each goal is an unrouted connection: an airwire, and the 45° route it will take.
export const DIRECTIONS: { at: P2; route: P2[] }[] = [
  { at: [-2, -123], route: [JUNCTION, [0, -121], [-2, -123]] },
  { at: [2.5, -125.5], route: [JUNCTION, [0, -123], [2.5, -125.5]] },
  { at: [7, -122.5], route: [JUNCTION, [7, -121], [7, -122.5]] },
];

// The one signal path. Every segment is axis-aligned or at 45°, like a routed board.
export const ROUTE: P2[] = [
  [2.5, -1.5], //  0 leaves the chip
  [2.5, -5],
  [4.5, -7],
  [4.5, -36], //  3 past the component bank
  [-7.5, BUS_Z], //  4 experience bus starts
  [7.5, BUS_Z], //  5 bus ends
  [7.5, -55],
  [5.5, -57],
  [5.5, -92], //  8 past the four project modules
  [0, -97.5],
  JUNCTION, // 10 goals branch off here
  [-7, -121],
  [-7, -135],
  [0, -142],
  [0, -148], // 14 the edge connector
];
const cum = [0];
for (let i = 1; i < ROUTE.length; i++)
  cum.push(
    cum[i - 1] +
      Math.hypot(ROUTE[i][0] - ROUTE[i - 1][0], ROUTE[i][1] - ROUTE[i - 1][1]),
  );
export const ROUTE_LENGTH = cum.at(-1)!;
/** Arc length at a (possibly fractional) route point index. */
const arc = (index: number) => {
  const i = Math.min(ROUTE.length - 2, Math.floor(index));
  return mix(cum[i], cum[i + 1], index - i);
};
/** Point on the route at an arc length. */
export function routeAt(s: number): P2 {
  let i = 1;
  while (i < ROUTE.length - 1 && cum[i] < s) i++;
  const t = clamp((s - cum[i - 1]) / (cum[i] - cum[i - 1]));
  return [
    mix(ROUTE[i - 1][0], ROUTE[i][0], t),
    mix(ROUTE[i - 1][1], ROUTE[i][1], t),
  ];
}
/** Arc length of the point on the bus trace at world x. */
export const busArc = (x: number) => cum[4] + (x + 7.5);

// Scroll position g (section index + progress) → how far the signal has travelled.
const SIGNAL: [number, number][] = [
  [0.25, 0],
  [0.95, 2],
  [2.0, 2.25],
  [3.0, 3],
  [3.2, 4],
  [3.85, 5],
  [4.1, 7.2],
  [4.9, 8],
  [5.9, 9.7],
  [6.3, 10],
  [6.9, 12],
  [7.45, 14],
];
export function signalAt(g: number) {
  let i = 1;
  while (i < SIGNAL.length - 1 && SIGNAL[i][0] < g) i++;
  const [g0, a] = SIGNAL[i - 1],
    [g1, b] = SIGNAL[i];
  return arc(mix(a, b, clamp((g - g0) / (g1 - g0))));
}

// Camera stops: [g, position, look-at]. The rig eases between neighbours.
type Stop = [number, V3, V3];
const hold = (g: number, pos: V3, look: V3): Stop[] => [
  [g - 0.07, pos, look],
  [g + 0.07, pos, look],
];
export const STOPS: Stop[] = [
  [0.22, [6.4, 6.2, 11], [-1.1, 0, -0.6]],
  [0.8, [4.6, 3.6, 6], [1.4, 0, -0.8]],
  [1.2, [2.9, 2.3, 2.4], [2.1, 0.1, 0]],
  [1.4, [1.15, 5.7, 0.9], [1.15, 0, 0]],
  [1.82, [1.15, 5.3, 0.8], [1.15, 0, -0.05]],
  [2.25, [2.1, 16, -24.6], [2.1, 0, -32.2]],
  [2.8, [2.1, 15, -25], [2.1, 0, -32.3]],
  [3.2, [-4.6, 6, -37.5], [-3.6, 0, -45.6]],
  [3.85, [4.6, 6, -37.5], [3.6, 0, -45.6]],
  ...MODULES.flatMap(([, z], i) =>
    hold(4.2 + i * 0.2, [-0.4, 3.3, z + 8.6], [0.6, 1.05, z]),
  ),
  [5.3, [0, 10, -96], [0, 0, -104]],
  [5.85, [0.5, 9, -102], [0.5, 0, -110]],
  [6.3, [2.5, 12.5, -91], [2.5, 0, -110]],
  [6.75, [2.5, 11.5, -93], [2.5, 0, -110.5]],
  [7.2, [-5, 2.4, -135], [-2.8, 0.3, -147]],
  [7.42, [-4.6, 2.1, -137.5], [-2.6, 0.3, -147.5]],
  // Finale: pull up and back to take in the whole lit board.
  [7.8, [-3, 27, -86], [1.5, 0, -116]],
];
export function poseAt(g: number): { pos: V3; look: V3 } {
  let i = 1;
  while (i < STOPS.length - 1 && STOPS[i][0] < g) i++;
  const [g0, p0, l0] = STOPS[i - 1],
    [g1, p1, l1] = STOPS[i];
  const t = ease(clamp((g - g0) / (g1 - g0)));
  return {
    pos: p0.map((n, j) => mix(n, p1[j], t)) as V3,
    look: l0.map((n, j) => mix(n, l1[j], t)) as V3,
  };
}
/** 0 until the signal reaches the connector, then 1: every net lights up. */
export const finaleAt = (g: number) => clamp((g - 7.42) / 0.2);

// Decoration stays clear of these rectangles [x0, x1, z0, z1] and of the signal route.
const KEEP_OUT = [
  [-9, 4.7, -2.6, 3.2],
  [-6, 9, -37, -27],
  [-9, 9, -49.6, -46.4],
  [1, 5, -90, -62],
  [-4, 9, -128, -112],
  [-2, 2, -150, -144],
];
export function clear([x, z]: P2, margin = 0.7) {
  if (KEEP_OUT.some(([a, b, c, d]) => x > a && x < b && z > c && z < d))
    return false;
  for (let i = 1; i < ROUTE.length; i++) {
    const [ax, az] = ROUTE[i - 1],
      [bx, bz] = ROUTE[i];
    const t = clamp(
      ((x - ax) * (bx - ax) + (z - az) * (bz - az)) /
        ((bx - ax) ** 2 + (bz - az) ** 2),
    );
    if (Math.hypot(x - mix(ax, bx, t), z - mix(az, bz, t)) < margin)
      return false;
  }
  return true;
}
/** Deterministic random numbers, so the board is the same on every visit. */
export function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
