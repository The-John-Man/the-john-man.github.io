"use client";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";

// Cached bounding boxes miss the assembled part transforms, so measure vertices.
function measure(root: THREE.Object3D) {
  root.updateMatrixWorld(true);
  const box = new THREE.Box3();
  const v = new THREE.Vector3();
  const inst = new THREE.Matrix4();
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    const attr = mesh.isMesh && mesh.geometry?.getAttribute("position");
    if (!attr) return;
    const step = Math.max(1, Math.floor(attr.count / 24));
    const baked = (mesh as THREE.InstancedMesh).isInstancedMesh
      ? (mesh as THREE.InstancedMesh)
      : null;
    const copies = baked ? baked.count : 1;
    for (let n = 0; n < copies; n++) {
      if (baked) {
        baked.getMatrixAt(n, inst);
        inst.premultiply(mesh.matrixWorld);
      }
      for (let i = 0; i < attr.count; i += step) {
        v.fromBufferAttribute(attr as THREE.BufferAttribute, i);
        v.applyMatrix4(baked ? inst : mesh.matrixWorld);
        box.expandByPoint(v);
      }
    }
  });
  return box;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const clone = useMemo(() => scene.clone(true), [scene]);
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  useLayoutEffect(() => {
    const box = measure(clone);
    if (box.isEmpty()) return;
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const max = Math.max(size.x, size.y, size.z) || 1;
    const dist = max * 0.95;
    camera.position.set(
      center.x + dist * 0.7,
      center.y + dist * 0.45,
      center.z + dist * 0.85,
    );
    camera.near = Math.max(0.1, max / 200);
    camera.far = max * 20;
    camera.lookAt(center);
    camera.updateProjectionMatrix();
    const orbit = controls as { target?: THREE.Vector3; update?: () => void } | null;
    if (orbit?.target) {
      orbit.target.copy(center);
      orbit.update?.();
    }
  }, [camera, clone, controls]);
  return <primitive object={clone} />;
}

export default function GantryScene({ url }: { url: string }) {
  return (
    <Canvas camera={{ fov: 35, position: [4, 3, 5], near: 0.1, far: 5000 }} dpr={[1, 1.75]}>
      <color attach="background" args={["#e9e8df"]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 3]} intensity={1.35} />
      <Suspense fallback={null}>
        <Model url={url} />
      </Suspense>
      <OrbitControls makeDefault enablePan={false} />
    </Canvas>
  );
}
