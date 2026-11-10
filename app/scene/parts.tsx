"use client";
// Everything soldered to the board, one group per block of the page.
import { useEffect, useMemo, useRef } from "react";
import { invalidate, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import data from "@/content/site";
import { clamp, scroll } from "../lib/scroll";
import { bank } from "../home/skills";
import {
  BANK,
  BUS_Z,
  CHIP,
  DIRECTIONS,
  JUNCTION,
  MODULES,
  USB,
  busArc,
  finaleAt,
  signalAt,
  type P2,
  type V3,
} from "./map";
import { Glow, Inst, Silk, mat, ribbons, signalMaterial, type Item } from "./kit";

const BLUE = "#6f8cff",
  AMBER = "#ffb020",
  GOLD = "#c8a04a";

/** A surface-mount LED whose brightness is set every frame by `level()` (0–1). */
function Led({
  at,
  color,
  level,
}: {
  at: V3;
  color: string;
  level: () => number;
}) {
  const body = useRef<THREE.MeshStandardMaterial>(null),
    glow = useRef<THREE.Sprite>(null);
  useFrame(() => {
    const l = level();
    body.current!.emissiveIntensity = 0.05 + l * 3;
    glow.current!.material.opacity = l * 0.9;
  });
  return (
    <group position={at}>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.26, 0.12, 0.16]} />
        <meshStandardMaterial
          ref={body}
          color="#d8d8d0"
          emissive={color}
          roughness={0.4}
        />
      </mesh>
      <Glow spriteRef={glow} at={[0, 0.2, 0]} color={color} size={0.8} />
    </group>
  );
}

/** Gull-wing leads along the four sides (or two, for a DIP) of a square package. */
function leads(size: number, perSide: number, sides = 4): Item[] {
  const out: Item[] = [];
  for (let s = 0; s < sides; s++)
    for (let i = 0; i < perSide; i++) {
      const t = ((i + 0.5) / perSide - 0.5) * size * 0.84,
        d = size / 2 + 0.1;
      const p: V3 =
        sides === 2
          ? [t, 0.03, s ? d : -d]
          : s % 2
            ? [s === 1 ? d : -d, 0.03, t]
            : [t, 0.03, s ? d : -d];
      out.push({ p, r: sides === 4 && s % 2 ? Math.PI / 2 : 0 });
    }
  return out;
}
function Package({
  size,
  pins,
  sides = 4,
  height = 0.24,
  marking,
  depth = size,
}: {
  size: number;
  pins: number;
  sides?: number;
  height?: number;
  marking?: string;
  depth?: number;
}) {
  const items = useMemo(() => leads(size, pins, sides), [size, pins, sides]);
  return (
    <group>
      <mesh position={[0, 0.002, 0.06]} rotation={[-Math.PI / 2, 0, 0]} material={mat.shadow}>
        <planeGeometry args={[size + 0.5, depth + 0.5]} />
      </mesh>
      <mesh position={[0, height / 2 + 0.03, 0]} material={mat.epoxy}>
        <boxGeometry args={[size, height, sides === 2 ? depth * 0.72 : depth]} />
      </mesh>
      <Inst items={items}>
        <boxGeometry args={[size / pins / 2.2, 0.05, 0.3]} />
        <primitive object={mat.tin} attach="material" />
      </Inst>
      {marking && (
        <Silk
          text={marking}
          face="display"
          color="#a9adb3"
          size={Math.min(0.34, (size * 0.8) / marking.length / 0.42)}
          at={[-size * 0.4, height + 0.032, 0]}
          opacity={0.8}
        />
      )}
    </group>
  );
}

/** U1: the "JM" chip. During Origin its lid fades to show the die, one region per story. */
export function Chip() {
  const lid = useRef<THREE.MeshStandardMaterial>(null),
    mark = useRef<THREE.Group>(null),
    regions = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const items = useMemo(() => leads(2.6, 12), []);
  const die = useMemo(() => {
    // A die photograph in miniature: blocks of fine parallel metal lines.
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#1a1408";
    ctx.fillRect(0, 0, 512, 512);
    const rand = (n: number) => ((Math.sin(n * 91.7) + 1) * 4321) % 1;
    for (let i = 0; i < 46; i++) {
      const x = 20 + rand(i) * 430,
        y = 20 + rand(i + 50) * 430,
        w = 30 + rand(i + 9) * 90,
        h = 20 + rand(i + 23) * 80;
      ctx.strokeStyle = `rgba(214,170,82,${0.25 + rand(i + 3) * 0.5})`;
      ctx.lineWidth = 1;
      const across = rand(i + 77) > 0.5;
      for (let k = 0; k < (across ? h : w); k += 4) {
        ctx.beginPath();
        ctx.moveTo(across ? x : x + k, across ? y + k : y);
        ctx.lineTo(across ? x + w : x + k, across ? y + k : y + h);
        ctx.stroke();
      }
    }
    const map = new THREE.CanvasTexture(c);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    return map;
  }, []);
  useFrame(() => {
    // Lid opens as the camera dives in, closes again on the way out.
    const g = scroll.g;
    const open = clamp((g - 1.12) / 0.2) * clamp((2.05 - g) / 0.15);
    lid.current!.opacity = 1 - open;
    mark.current!.visible = open < 0.5;
    regions.current.forEach((m, i) => {
      if (m)
        m.emissiveIntensity =
          open * (scroll.step.origin === i ? 1.2 : 0.1);
    });
  });
  return (
    <group position={[CHIP[0], 0, CHIP[1]]}>
      <mesh position={[0, 0.002, 0.1]} rotation={[-Math.PI / 2, 0, 0]} material={mat.shadow}>
        <planeGeometry args={[3.4, 3.4]} />
      </mesh>
      <Inst items={items}>
        <boxGeometry args={[0.1, 0.05, 0.34]} />
        <primitive object={mat.tin} attach="material" />
      </Inst>
      {/* Package floor and the die that sits in it. */}
      <mesh position={[0, 0.05, 0]} material={mat.epoxy}>
        <boxGeometry args={[2.6, 0.06, 2.6]} />
      </mesh>
      <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.9, 1.9]} />
        <meshStandardMaterial map={die} roughness={0.35} metalness={0.6} />
      </mesh>
      {[-0.62, 0, 0.62].map((x, i) => (
        <mesh key={i} position={[x, 0.088, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.56, 1.8]} />
          <meshStandardMaterial
            ref={(m) => {
              regions.current[i] = m;
            }}
            color="#000"
            emissive="#ffb648"
            emissiveMap={die}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.2, 0]} renderOrder={1}>
        <boxGeometry args={[2.6, 0.24, 2.6]} />
        <meshStandardMaterial ref={lid} color="#16181b" roughness={0.5} transparent />
      </mesh>
      <group ref={mark}>
        <Silk text="JM" face="display" color="#b4b8be" size={1.05} at={[-0.95, 0.322, -0.15]} />
        <Silk text="MECHATRONICS" face="display" color="#8c9096" size={0.24} at={[-0.95, 0.322, 0.62]} />
        <Silk text="MADE IN ONTARIO" face="display" color="#8c9096" size={0.2} at={[-0.95, 0.322, 0.9]} />
        <mesh position={[-1.02, 0.322, -0.98]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.09, 20]} />
          <meshBasicMaterial color="#5a5e64" />
        </mesh>
      </group>
      <Silk text="U1" at={[-1.3, 0.004, -1.75]} size={0.3} />
      {/* Support parts: crystal, decoupling, power LED. */}
      <group position={[-2.3, 0, 0.9]}>
        <mesh position={[0, 0.11, 0]} material={mat.tin}>
          <boxGeometry args={[0.9, 0.2, 0.42]} />
        </mesh>
        <Silk text="Y1" at={[-0.4, 0.004, 0.6]} size={0.22} />
      </group>
      <Led
        at={[-2.3, 0, -1.1]}
        color="#58e08a"
        level={() => boot.level}
      />
      <Silk text="PWR" at={[-2.65, 0.004, -0.7]} size={0.22} />
    </group>
  );
}
/** Power-on: 0 → 1 once when the scene first appears. The lights follow it too. */
export const boot = { level: 0 };

const SIZES: Record<string, [number, number]> = {
  mcu: [1.5, 10],
  qfp: [1.2, 8],
  dip: [1.5, 7],
  crystal: [1, 0],
  devboard: [1.6, 0],
  gear: [1.3, 0],
};
function SkillPart({ skill, at }: { skill: (typeof data.skills)[number]; at: P2 }) {
  const group = useRef<THREE.Group>(null),
    spin = useRef<THREE.Mesh>(null);
  const tooth = useMemo(() => {
    const shape = new THREE.Shape();
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2,
        r = i % 2 ? 0.62 : 0.5;
      shape[i ? "lineTo" : "moveTo"](Math.cos(a) * r, Math.sin(a) * r);
      shape.lineTo(Math.cos(a + 0.12) * r, Math.sin(a + 0.12) * r);
    }
    const hole = new THREE.Path();
    hole.absarc(0, 0, 0.16, 0, Math.PI * 2);
    shape.holes.push(hole);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.16, bevelEnabled: false });
  }, []);
  const lit = () => bank.hover === skill.name;
  const dim = () => bank.group !== "all" && bank.group !== skill.group;
  useFrame((_, dt) => {
    const g = group.current!;
    const target = lit() ? 0.4 : dim() ? -0.02 : 0;
    g.position.y += (target - g.position.y) * Math.min(1, dt * 10);
    if (spin.current && lit()) spin.current.rotation.z += dt * 1.5;
    if (Math.abs(target - g.position.y) > 0.002 || (spin.current && lit()))
      invalidate();
  });
  const [size] = SIZES[skill.part] ?? SIZES.qfp;
  const name = skill.name.toUpperCase();
  return (
    <group position={[at[0], 0, at[1]]}>
      <group
        ref={group}
        onPointerOver={() => bank.set({ hover: skill.name })}
        onPointerOut={() => bank.set({ hover: null })}
      >
        {skill.part === "gear" ? (
          <mesh ref={spin} geometry={tooth} material={mat.tin} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} />
        ) : skill.part === "crystal" ? (
          <mesh position={[0, 0.16, 0]} material={mat.tin}>
            <boxGeometry args={[1.05, 0.3, 0.46]} />
          </mesh>
        ) : skill.part === "devboard" ? (
          <group>
            <mesh position={[0, 0.07, 0]}>
              <boxGeometry args={[1.7, 0.08, 1.1]} />
              <meshStandardMaterial color="#0e5560" roughness={0.6} />
            </mesh>
            <mesh position={[0.2, 0.17, 0]} material={mat.epoxy}>
              <boxGeometry args={[0.5, 0.12, 0.5]} />
            </mesh>
            <mesh position={[-0.6, 0.2, 0]} material={mat.tin}>
              <boxGeometry args={[0.4, 0.2, 0.36]} />
            </mesh>
            {[-0.48, 0.48].map((z) => (
              <mesh key={z} position={[0.1, 0.16, z]} material={mat.epoxy}>
                <boxGeometry args={[1.3, 0.14, 0.1]} />
              </mesh>
            ))}
          </group>
        ) : (
          <Package
            size={size}
            pins={SIZES[skill.part]?.[1] ?? 8}
            sides={skill.part === "dip" ? 2 : 4}
            marking={name}
          />
        )}
      </group>
      <Led
        at={[-0.75, 0, 1.02]}
        color={BLUE}
        level={() => (dim() ? 0 : lit() ? 1 : 0.35)}
      />
      <Silk text={name} at={[-0.5, 0.004, 1.08]} size={0.2} />
    </group>
  );
}
/** An unpopulated footprint: pads and a silkscreen outline, nothing soldered. */
function Footprint({ at, label, size = 1.2 }: { at: P2; label?: string; size?: number }) {
  const pads = useMemo(() => {
    const out: Item[] = [];
    for (const z of [-1, 1])
      for (let i = 0; i < 4; i++)
        out.push({ p: [((i + 0.5) / 4 - 0.5) * size * 0.8, 0.004, (z * size) / 2] });
    return out;
  }, [size]);
  const outline = useMemo(
    () =>
      ribbons(
        [
          [
            [-size / 2, -size / 2 + 0.2],
            [-size / 2, size / 2 - 0.2],
          ],
          [
            [size / 2, -size / 2 + 0.2],
            [size / 2, size / 2 - 0.2],
          ],
        ],
        0.03,
        0.004,
      ),
    [size],
  );
  return (
    <group position={[at[0], 0, at[1]]}>
      <Inst items={pads}>
        <boxGeometry args={[size / 7, 0.006, 0.26]} />
        <primitive object={mat.gold} attach="material" />
      </Inst>
      <mesh geometry={outline}>
        <meshBasicMaterial color="#e9e6dc" transparent opacity={0.55} />
      </mesh>
      {label && <Silk text={label} at={[-size / 2, 0.004, size / 2 + 0.5]} size={0.2} />}
    </group>
  );
}
export function Bank() {
  const cells = useMemo(() => {
    const out: P2[] = [];
    for (let r = 0; r < BANK.rows; r++)
      for (let c = 0; c < BANK.cols; c++)
        out.push([
          BANK.centre[0] + (c - (BANK.cols - 1) / 2) * BANK.pitch,
          BANK.centre[1] + (r - (BANK.rows - 1) / 2) * (BANK.pitch + 0.5),
        ]);
    return out;
  }, []);
  useEffect(() => {
    const fn = () => invalidate();
    bank.subs.add(fn);
    return () => {
      bank.subs.delete(fn);
    };
  }, []);
  return (
    <group>
      {cells.map((at, i) =>
        data.skills[i] ? (
          <SkillPart key={i} skill={data.skills[i]} at={at} />
        ) : (
          <Footprint key={i} at={at} label="DNP" />
        ),
      )}
    </group>
  );
}

/** Experience: one solder pad per entry on the bus. The open entry is an empty, pulsing footprint. */
export function Bus() {
  const n = data.experience.length;
  return (
    <group>
      {data.experience.map((e, i) => {
        const x = -6 + (12 * i) / (n - 1);
        const reached = () =>
          signalAt(scroll.g) > busArc(x) ? 1 : 0;
        return (
          <group key={i} position={[x, 0, BUS_Z]}>
            <mesh position={[0, 0.006, 0]} material={mat.gold}>
              <cylinderGeometry args={[0.36, 0.36, 0.012, 28]} />
            </mesh>
            {e.open ? (
              <>
                <Footprint at={[0, -1.6]} label="SUMMER 2027" size={1.4} />
                <Led
                  at={[0, 0, -0.7]}
                  color={AMBER}
                  level={() =>
                    scroll.index === 3 || reached()
                      ? 0.55 + 0.45 * Math.sin(performance.now() / 380)
                      : 0.15
                  }
                />
              </>
            ) : (
              <>
                <mesh position={[0, 0.12, 0]} material={mat.tin}>
                  <sphereGeometry args={[0.2, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                </mesh>
                <Led
                  at={[0, 0, -0.7]}
                  color={BLUE}
                  level={() =>
                    scroll.step.experience === i ? 1 : reached() * 0.3
                  }
                />
              </>
            )}
            <Silk text={"TP" + (i + 1)} at={[-0.25, 0.004, 0.75]} size={0.2} />
          </group>
        );
      })}
    </group>
  );
}

/** Projects: four daughterboards standing in connectors J1–J4. */
export function Modules() {
  const featured = data.projects.filter((p) => p.featured);
  return (
    <group>
      {MODULES.map(([x, z], i) => {
        const active = () =>
          scroll.index === 4 && scroll.step.projects === i ? 1 : 0.08;
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -0.32, 0]}>
            <mesh position={[0, 0.15, 0]} material={mat.epoxy}>
              <boxGeometry args={[3.5, 0.3, 0.42]} />
            </mesh>
            <group position={[0, 0.3, 0]} rotation={[-0.06, 0, 0]}>
              <mesh position={[0, 1.05, 0]}>
                <boxGeometry args={[3.2, 2.1, 0.07]} />
                <meshStandardMaterial color="#10141a" roughness={0.7} metalness={0.2} />
              </mesh>
              <group position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
                <Silk text={"J" + (i + 1)} at={[-1.45, 0, -1.85]} size={0.26} color={GOLD} />
                <Silk
                  text={(featured[i]?.title ?? "").toUpperCase()}
                  face="display"
                  at={[-1.45, 0, -1.25]}
                  size={0.36}
                />
                <group position={[0.75, 0, -0.75]}>
                  <Package size={0.8} pins={6} height={0.14} />
                </group>
                <group position={[-0.9, 0, -0.55]}>
                  <Package size={0.5} pins={4} height={0.1} />
                </group>
                <Led at={[1.3, 0, -1.8]} color={BLUE} level={active} />
              </group>
              <Inst
                items={Array.from({ length: 14 }, (_, k) => ({
                  p: [-1.4 + k * 0.215, 0.12, 0.04] as V3,
                }))}
              >
                <boxGeometry args={[0.12, 0.24, 0.01]} />
                <primitive object={mat.gold} attach="material" />
              </Inst>
            </group>
            <mesh position={[0.3, 0.002, 0.6]} rotation={[-Math.PI / 2, 0, 0]} material={mat.shadow}>
              <planeGeometry args={[4, 1.6]} />
            </mesh>
            <Silk text={"J" + (i + 1)} at={[-1.75, 0.004, 0.75]} size={0.24} />
          </group>
        );
      })}
    </group>
  );
}

/** Goals: airwires (connections not routed yet) to three empty footprints. The current one routes itself. */
export function Airwires() {
  const wires = useMemo(
    () =>
      DIRECTIONS.map(({ at, route }) => {
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(JUNCTION[0], 0.02, JUNCTION[1]),
            new THREE.Vector3(at[0], 0.02, at[1]),
          ]),
          new THREE.LineDashedMaterial({
            color: "#e9e6dc",
            dashSize: 0.22,
            gapSize: 0.16,
            transparent: true,
            opacity: 0.7,
          }),
        );
        line.computeLineDistances();
        return {
          line,
          base: ribbons([route], 0.2, 0.004),
          core: ribbons([route], 0.1, 0.008),
          material: signalMaterial(false),
        };
      }),
    [],
  );
  useFrame((_, dt) => {
    wires.forEach((w, i) => {
      const on =
        (scroll.index === 6 && scroll.step.goals >= i) || scroll.index > 6;
      const u = w.material.uniforms.uHead;
      const next = u.value + ((on ? 1.05 : 0) - u.value) * Math.min(1, dt * 3);
      if (Math.abs(next - u.value) > 0.001) invalidate();
      u.value = next;
    });
  });
  return (
    <group>
      <mesh position={[JUNCTION[0], 0.006, JUNCTION[1]]} material={mat.gold}>
        <cylinderGeometry args={[0.3, 0.3, 0.012, 24]} />
      </mesh>
      {wires.map((w, i) => (
        <group key={i}>
          <primitive object={w.line} />
          <mesh geometry={w.base} material={mat.relief} />
          <mesh geometry={w.core} material={w.material} />
          <Footprint
            at={DIRECTIONS[i].at}
            label={data.directions[i]?.title.toUpperCase()}
            size={1.5}
          />
        </group>
      ))}
    </group>
  );
}

/** Connect: the USB-C receptacle on the board edge. */
export function Usb() {
  return (
    <group position={[USB[0], 0, USB[1]]}>
      <mesh position={[0, 0.2, 0]} material={mat.tin}>
        <boxGeometry args={[1.9, 0.4, 1.7]} />
      </mesh>
      <mesh position={[0, 0.2, -0.86]}>
        <boxGeometry args={[1.5, 0.2, 0.02]} />
        <meshBasicMaterial color="#050608" />
      </mesh>
      <mesh position={[0, 0.002, 0.2]} rotation={[-Math.PI / 2, 0, 0]} material={mat.shadow}>
        <planeGeometry args={[2.6, 2.4]} />
      </mesh>
      <Silk text="J5 USB-C" at={[-0.95, 0.004, 1.3]} size={0.24} />
      <Led at={[1.6, 0, 0.9]} color={BLUE} level={() => finaleAt(scroll.g)} />
      <Led at={[-1.6, 0, 0.9]} color="#58e08a" level={() => finaleAt(scroll.g)} />
    </group>
  );
}
