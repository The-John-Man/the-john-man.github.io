"use client";
// The board itself: slab, background circuitry, the signal trace and its travelling light.
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scroll } from "../lib/scroll";
import {
  BOARD,
  ROUTE,
  ROUTE_LENGTH,
  clear,
  finaleAt,
  routeAt,
  seeded,
  signalAt,
  type P2,
} from "./map";
import { Glow, Inst, mat, ribbons, signalMaterial, type Item } from "./kit";

const length = BOARD.front - BOARD.back;
const midZ = (BOARD.front + BOARD.back) / 2;

export function Slab() {
  return (
    <group>
      <mesh position={[0, -0.08, midZ]} material={mat.mask}>
        <boxGeometry args={[BOARD.width, 0.16, length]} />
      </mesh>
      {/* The cut edge shows the fibreglass under the mask. */}
      <mesh position={[0, -0.08, midZ]} material={mat.fr4}>
        <boxGeometry args={[BOARD.width + 0.02, 0.1, length + 0.02]} />
      </mesh>
    </group>
  );
}

/** Background circuitry: trace bundles, vias, passives, small ICs and test points,
    kept clear of the story parts and the signal route. */
export function Decor({ density = 1 }: { density?: number }) {
  const d = useMemo(() => {
    const rand = seeded(11);
    const lines: P2[][] = [];
    const vias: Item[] = [],
      bodies: Item[] = [],
      caps: Item[] = [],
      chips: Item[] = [],
      chipLeads: Item[] = [],
      points: Item[] = [];
    const spot = (): P2 => [
      (rand() - 0.5) * (BOARD.width - 1.2),
      BOARD.front - 1 - rand() * (length - 2),
    ];
    const inside = ([x, z]: P2) =>
      Math.abs(x) < 8.5 && z < BOARD.front - 0.5 && z > BOARD.back + 0.5;

    for (let n = 0; n < 300 * density; n++) {
      // A bundle: parallel traces that run down the board with two 45° jogs.
      const [x, z] = spot();
      const count = 2 + Math.floor(rand() * 7),
        jog1 = (rand() < 0.5 ? -1 : 1) * (0.3 + rand() * 1.4),
        jog2 = (rand() < 0.5 ? -1 : 1) * (0.3 + rand() * 1.4);
      const runs = [1.5 + rand() * 8, 1 + rand() * 7, 1 + rand() * 6];
      const centre: P2[] = [[x, z]];
      const step = (dx: number, dz: number) => {
        const [px, pz] = centre.at(-1)!;
        centre.push([px + dx, pz - dz]);
      };
      step(0, runs[0]);
      step(jog1, Math.abs(jog1));
      step(0, runs[1]);
      step(jog2, Math.abs(jog2));
      step(0, runs[2]);
      if (centre.some((p) => !inside(p) || !clear(p, 1.2))) continue;
      for (let k = 0; k < count; k++) {
        const off = (k - (count - 1) / 2) * 0.15;
        // Outer traces turn slightly earlier or later so the gap between them stays even.
        const s1 = off * Math.sign(jog1) * 0.41,
          s2 = off * Math.sign(jog2) * 0.41;
        const line: P2[] = [
          [centre[0][0] + off, centre[0][1]],
          [centre[1][0] + off, centre[1][1] + s1],
          [centre[2][0] + off, centre[2][1] + s1],
          [centre[3][0] + off, centre[3][1] + s2],
          [centre[4][0] + off, centre[4][1] + s2],
          [centre[5][0] + off, centre[5][1]],
        ];
        lines.push(line);
        vias.push(
          { p: [line[0][0], 0.004, line[0][1]] },
          { p: [line[5][0], 0.004, line[5][1]] },
        );
      }
    }
    for (let n = 0; n < 170 * density; n++) {
      // Passives sit in tidy rows, the way a pick-and-place machine leaves them.
      const [x, z] = spot(),
        along = rand() < 0.5,
        count = 2 + Math.floor(rand() * 6);
      for (let k = 0; k < count; k++) {
        const p: P2 = along ? [x + k * 0.26, z] : [x, z - k * 0.26];
        if (!inside(p) || !clear(p, 0.9)) continue;
        const r = along ? Math.PI / 2 : 0;
        bodies.push({ p: [p[0], 0.035, p[1]], r });
        const dx = along ? 0 : 0.085,
          dz = along ? 0.085 : 0;
        caps.push(
          { p: [p[0] - dx, 0.035, p[1] - dz], r },
          { p: [p[0] + dx, 0.035, p[1] + dz], r },
        );
      }
    }
    for (let n = 0; n < 46 * density; n++) {
      const p = spot();
      if (!clear(p, 1.3)) continue;
      const r = rand() < 0.5 ? 0 : Math.PI / 2,
        s = 0.7 + rand() * 0.9;
      chips.push({ p: [p[0], 0.07, p[1]], r, s: [s, 1, s] });
      chipLeads.push({ p: [p[0], 0.02, p[1]], r, s: [s, 1, s] });
    }
    for (let n = 0; n < 40 * density; n++) {
      // Rows of gold test points.
      const [x, z] = spot(),
        count = 3 + Math.floor(rand() * 5);
      for (let k = 0; k < count; k++) {
        const p: P2 = [x + k * 0.26, z];
        if (inside(p) && clear(p, 0.9)) points.push({ p: [p[0], 0.004, p[1]] });
      }
    }
    return {
      traces: ribbons(lines, 0.06, 0.003),
      vias,
      bodies,
      caps,
      chips,
      chipLeads,
      points,
    };
  }, [density]);
  const glow = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    // Finale: every net on the board lights up.
    glow.current!.emissiveIntensity = finaleAt(scroll.g) * 3.5;
  });
  return (
    <group>
      <mesh geometry={d.traces}>
        <meshStandardMaterial
          ref={glow}
          color="#252d39"
          roughness={0.35}
          metalness={0.55}
          emissive="#2448cf"
          emissiveIntensity={0}
        />
      </mesh>
      <Inst items={d.vias}>
        <cylinderGeometry args={[0.05, 0.05, 0.008, 10]} />
        <primitive object={mat.gold} attach="material" />
      </Inst>
      <Inst items={d.points}>
        <cylinderGeometry args={[0.075, 0.075, 0.008, 16]} />
        <primitive object={mat.gold} attach="material" />
      </Inst>
      <Inst items={d.bodies}>
        <boxGeometry args={[0.11, 0.07, 0.1]} />
        <primitive object={mat.ceramic} attach="material" />
      </Inst>
      <Inst items={d.caps}>
        <boxGeometry args={[0.112, 0.072, 0.045]} />
        <primitive object={mat.tin} attach="material" />
      </Inst>
      <Inst items={d.chips}>
        <boxGeometry args={[0.6, 0.12, 0.42]} />
        <primitive object={mat.epoxy} attach="material" />
      </Inst>
      <Inst items={d.chipLeads}>
        <boxGeometry args={[0.52, 0.03, 0.62]} />
        <primitive object={mat.tin} attach="material" />
      </Inst>
    </group>
  );
}

/** The story's one trace, and the light that runs along it as the page scrolls. */
export function Signal() {
  const { base, core, halo, coreMat, haloMat } = useMemo(
    () => ({
      base: ribbons([ROUTE], 0.26, 0.004),
      core: ribbons([ROUTE], 0.11, 0.008),
      halo: ribbons([ROUTE], 1.1, 0.007),
      coreMat: signalMaterial(false),
      haloMat: signalMaterial(true),
    }),
    [],
  );
  const head = useRef<THREE.Sprite>(null);
  useFrame(() => {
    const s = signalAt(scroll.g);
    coreMat.uniforms.uHead.value = haloMat.uniforms.uHead.value = s / ROUTE_LENGTH;
    const [x, z] = routeAt(s);
    head.current!.position.set(x, 0.12, z);
  });
  return (
    <group>
      <mesh geometry={base} material={mat.relief} />
      <mesh geometry={halo} material={haloMat} />
      <mesh geometry={core} material={coreMat} />
      <Glow spriteRef={head} color="#6f8cff" size={1.5} />
    </group>
  );
}
