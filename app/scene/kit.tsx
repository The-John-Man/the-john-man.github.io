"use client";
// Shared building blocks for the board scene: materials, trace ribbons, instancing, labels.
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { P2, V3 } from "./map";

export const MASK = "#0b0d10";
export const mat = {
  mask: new THREE.MeshStandardMaterial({
    color: "#090b0e",
    roughness: 0.5,
    metalness: 0,
  }),
  fr4: new THREE.MeshStandardMaterial({ color: "#8f7f4f", roughness: 0.9 }),
  gold: new THREE.MeshStandardMaterial({
    color: "#c8a04a",
    roughness: 0.34,
    metalness: 1,
    envMapIntensity: 1.8,
  }),
  tin: new THREE.MeshStandardMaterial({
    color: "#b9bcc0",
    roughness: 0.3,
    metalness: 1,
    envMapIntensity: 2,
  }),
  epoxy: new THREE.MeshStandardMaterial({ color: "#16181b", roughness: 0.55 }),
  ceramic: new THREE.MeshStandardMaterial({ color: "#6b5a44", roughness: 0.7 }),
  relief: new THREE.MeshStandardMaterial({
    color: "#1b2129",
    roughness: 0.6,
    metalness: 0.3,
  }),
  shadow: new THREE.MeshBasicMaterial({
    color: "#000",
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
  }),
};

/** Flat ribbons along [x, z] polylines at height y. uv.x runs 0–1 along each line. */
export function ribbons(lines: P2[][], width: number, y: number) {
  const pos: number[] = [],
    uv: number[] = [],
    idx: number[] = [];
  for (const line of lines) {
    const lens = [0];
    for (let i = 1; i < line.length; i++)
      lens.push(
        lens[i - 1] +
          Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]),
      );
    const base = pos.length / 3;
    line.forEach(([x, z], i) => {
      // Mitre: offset along the bisector of the two neighbouring segment normals.
      const a = line[Math.max(0, i - 1)],
        b = line[Math.min(line.length - 1, i + 1)];
      const before = unit(x - a[0], z - a[1]),
        after = unit(b[0] - x, b[1] - z);
      const dir = unit(before[0] + after[0], before[1] + after[1]);
      const n = [-dir[1], dir[0]];
      const ref = after[0] || after[1] ? after : before;
      const half = width / 2 / Math.max(0.5, dir[0] * ref[0] + dir[1] * ref[1]);
      pos.push(x + n[0] * half, y, z + n[1] * half);
      pos.push(x - n[0] * half, y, z - n[1] * half);
      const u = lens[i] / (lens.at(-1) || 1);
      uv.push(u, 0, u, 1);
      if (i) {
        const k = base + i * 2;
        idx.push(k - 2, k, k - 1, k - 1, k, k + 1);
      }
    });
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
const unit = (x: number, z: number) => {
  const l = Math.hypot(x, z);
  return l ? [x / l, z / l] : [0, 0];
};

export type Item = { p: V3; s?: V3; r?: number };
/** One draw call for many copies of the child geometry and material. */
export function Inst({
  items,
  children,
}: {
  items: Item[];
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    items.forEach((it, i) => {
      o.position.set(...it.p);
      o.scale.set(...(it.s ?? [1, 1, 1]));
      o.rotation.set(0, it.r ?? 0, 0);
      o.updateMatrix();
      ref.current!.setMatrixAt(i, o.matrix);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [items]);
  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, items.length]}
      frustumCulled={false}
    >
      {children}
    </instancedMesh>
  );
}

const fonts = () => {
  const css = getComputedStyle(document.documentElement);
  return {
    mono: css.getPropertyValue("--font-mono") || "monospace",
    display: css.getPropertyValue("--font-display") || "sans-serif",
  };
};
const textures = new Map<string, { map: THREE.CanvasTexture; aspect: number }>();
/** Text drawn to a canvas texture: silkscreen (mono) or chip marking (condensed display). */
export function textTexture(text: string, face: "mono" | "display", color: string) {
  const key = face + color + text;
  if (!textures.has(key)) {
    const c = document.createElement("canvas"),
      ctx = c.getContext("2d")!;
    const font =
      face === "mono"
        ? `500 64px ${fonts().mono}`
        : `600 extra-condensed 64px ${fonts().display}`;
    ctx.font = font;
    c.width = Math.ceil(ctx.measureText(text).width) + 16;
    c.height = 84;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.fillText(text, 8, 44);
    const map = new THREE.CanvasTexture(c);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    textures.set(key, { map, aspect: c.width / c.height });
  }
  return textures.get(key)!;
}
/** Text lying flat on a surface. `at` is the left end of the baseline; `turn` rotates about y. */
export function Silk({
  text,
  at,
  size = 0.3,
  face = "mono",
  color = "#e9e6dc",
  turn = 0,
  opacity = 0.9,
}: {
  text: string;
  at: V3;
  size?: number;
  face?: "mono" | "display";
  color?: string;
  turn?: number;
  opacity?: number;
}) {
  const { map, aspect } = useMemo(
    () => textTexture(text, face, color),
    [text, face, color],
  );
  return (
    <group position={at} rotation={[0, turn, 0]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[(size * aspect) / 2, 0, 0]}
        renderOrder={3}
      >
        <planeGeometry args={[size * aspect, size]} />
        <meshBasicMaterial
          map={map}
          transparent
          opacity={opacity}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

let glowMap: THREE.CanvasTexture | undefined;
/** Soft additive glow, standing in for bloom. */
export function glowTexture() {
  if (!glowMap) {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,255,255,.45)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    glowMap = new THREE.CanvasTexture(c);
  }
  return glowMap;
}
// Shadows are soft blobs, not hard rectangles.
if (typeof document !== "undefined") mat.shadow.map = glowTexture();
export function Glow({
  at,
  color,
  size = 1,
  spriteRef,
}: {
  at?: V3;
  color: string;
  size?: number;
  spriteRef?: React.Ref<THREE.Sprite>;
}) {
  return (
    <sprite ref={spriteRef} position={at} scale={size} renderOrder={4}>
      <spriteMaterial
        map={glowTexture()}
        color={color}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
}

/** Shader for a trace that lights up from its start to `uHead` (0–1 along the ribbon). */
export function signalMaterial(halo: boolean) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uHead: { value: 0 },
      uColor: { value: new THREE.Color("#3f66ff") },
      uTail: { value: 60 },
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform float uHead; uniform float uTail; uniform vec3 uColor; varying vec2 vUv;
      void main(){
        float lit = step(vUv.x, uHead);
        float head = lit * exp(-(uHead - vUv.x) * uTail);
        float across = 1.0 - abs(vUv.y - 0.5) * 2.0;
        ${
          halo
            ? `float a = lit * across * across * (0.16 + head * 0.5);
               gl_FragColor = vec4(uColor * a, a);`
            : `vec3 c = uColor * (0.85 + head * 1.6) + vec3(head) * 0.8;
               gl_FragColor = vec4(c * lit * (0.6 + 0.4 * across), lit);`
        }
      }`,
  });
}
