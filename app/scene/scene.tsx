"use client";
import { useEffect, useRef } from "react";
import { Canvas, invalidate, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { onScroll, scroll } from "../lib/scroll";
import type { Tier } from "../lib/quality";
import { finaleAt, poseAt } from "./map";
import { MASK } from "./kit";
import { Decor, Signal, Slab } from "./board";
import { Airwires, Bank, Bus, Chip, Modules, Usb, boot } from "./parts";

/** Scroll-driven camera: eases between the stops in layout.ts, then glides to that pose. */
function Rig({ lite }: { lite: boolean }) {
  const look = useRef(new THREE.Vector3(-1.1, 0, -0.6)),
    pointer = useRef({ x: 0, y: 0 }),
    started = useRef(0);
  const { camera, scene } = useThree();
  useEffect(() => {
    const stop = onScroll(() => invalidate());
    const move = (e: PointerEvent) => {
      pointer.current = {
        x: e.clientX / innerWidth - 0.5,
        y: e.clientY / innerHeight - 0.5,
      };
      invalidate();
    };
    if (!lite) addEventListener("pointermove", move, { passive: true });
    return () => {
      stop();
      removeEventListener("pointermove", move);
    };
  }, [lite]);
  useFrame((state, dt) => {
    // Power-on: once per tab the lights come up over 1.5 s; afterwards they are simply on.
    started.current ||= state.clock.elapsedTime;
    const seen = sessionStorage.getItem("booted");
    boot.level = seen
      ? 1
      : Math.min(1, (state.clock.elapsedTime - started.current) / 1.5);
    if (boot.level === 1 && !seen) sessionStorage.setItem("booted", "1");

    const { pos, look: target } = poseAt(scroll.g);
    // Phones: the copy covers the full width, so keep the subject centred.
    if (lite) pos[0] = target[0] = (pos[0] + target[0]) / 2;
    pos[0] += pointer.current.x * 0.3;
    pos[1] -= pointer.current.y * 0.2;
    // Glide toward the scroll pose (time constant 120 ms, frame-rate independent).
    const k = 1 - Math.exp(-Math.min(dt, 0.05) / 0.12);
    camera.position.lerp(new THREE.Vector3(...pos), k);
    look.current.lerp(new THREE.Vector3(...target), k);
    camera.lookAt(look.current);
    const fog = scene.fog as THREE.Fog;
    fog.far = 62 + finaleAt(scroll.g) * 200;
    const moving =
      camera.position.distanceToSquared(new THREE.Vector3(...pos)) > 1e-5;
    // Keep drawing while gliding, booting, or while the "open" pad is pulsing on screen.
    if (moving || boot.level < 1 || scroll.index === 3) invalidate();
  });
  return null;
}

/** A warm work light that follows the pointer across the board. */
function Probe() {
  const light = useRef<THREE.PointLight>(null);
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)),
    hit = useRef(new THREE.Vector3());
  useFrame(({ raycaster, pointer, camera }) => {
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(plane.current, hit.current))
      light.current!.position.set(hit.current.x, 1.1, hit.current.z);
  });
  return <pointLight ref={light} color="#ffd9a0" intensity={3.5} distance={6} decay={2} />;
}

function Lights() {
  const key = useRef<THREE.DirectionalLight>(null),
    rim = useRef<THREE.DirectionalLight>(null),
    fill = useRef<THREE.AmbientLight>(null);
  useFrame(({ scene }) => {
    const b = boot.level * boot.level;
    key.current!.intensity = 1.5 * b;
    rim.current!.intensity = 0.45 * b;
    fill.current!.intensity = 0.12 * b;
    scene.environmentIntensity = 0.55 * b;
  });
  return (
    <>
      <ambientLight ref={fill} />
      <directionalLight ref={key} position={[-6, 9, 4]} color="#dfe6ff" />
      <directionalLight ref={rim} position={[7, 3, -8]} color="#3f66ff" />
    </>
  );
}

export default function Scene({ tier }: { tier: Tier }) {
  const lite = tier === "lite";
  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={lite ? 1 : Math.min(devicePixelRatio, 1.5)}
        gl={{ antialias: !lite, powerPreference: "high-performance" }}
        camera={{ fov: lite ? 50 : 35, near: 0.1, far: 400, position: [6.4, 6.2, 11] }}
        eventSource={document.body}
        eventPrefix="client"
        onCreated={() => {
          document.documentElement.dataset.scene = "ready";
        }}
      >
        <color attach="background" args={[MASK]} />
        <fog attach="fog" args={[MASK, lite ? 10 : 14, 62]} />
        <Lights />
        <Environment resolution={64} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[14, 14, 1]} />
          <Lightformer form="rect" intensity={1.5} color="#3f66ff" position={[8, 2, -6]} rotation-y={-Math.PI / 2} scale={[10, 4, 1]} />
          <Lightformer form="rect" intensity={2} color="#ffd9a0" position={[-8, 2, 4]} rotation-y={Math.PI / 2} scale={[10, 4, 1]} />
        </Environment>
        <Slab />
        <Decor density={lite ? 0.5 : 1} />
        <Signal />
        <Chip />
        <Bank />
        <Bus />
        <Modules />
        <Airwires />
        <Usb />
        {!lite && <Probe />}
        <Rig lite={lite} />
      </Canvas>
    </div>
  );
}
