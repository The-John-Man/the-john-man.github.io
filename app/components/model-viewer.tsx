"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Component, useState, useSyncExternalStore, type ReactNode } from "react";

const GantryScene = dynamic(() => import("./gantry-scene"), { ssr: false });

function reducedMotion() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    reducedMotion,
    () => true,
  );
}

class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function ModelViewer({
  src,
  poster,
  alt,
}: {
  src: string;
  poster: string;
  alt: string;
}) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const showScene = open && !reduced && !failed;
  return (
    <figure className="model-slot">
      {showScene ? (
        <div className="model-canvas">
          <SceneBoundary onError={() => setFailed(true)}>
            <GantryScene url={src} />
          </SceneBoundary>
        </div>
      ) : (
        <Image
          src={poster}
          alt={alt}
          width={1440}
          height={900}
          sizes="(max-width: 700px) 100vw, 960px"
          style={{ width: "100%", height: "auto" }}
        />
      )}
      <figcaption>
        {reduced
          ? "3D model stays as a still when motion is reduced."
          : failed
            ? "The 3D model did not load. The CAD render is the fallback."
            : showScene
              ? "Drag to turn the gantry. Scroll to zoom."
              : "CAD render. The 3D model loads when you ask."}
      </figcaption>
      {!reduced && !failed && (
        <button type="button" onClick={() => setOpen((v) => !v)}>
          {showScene ? "Show the still" : "Load 3D model"}
        </button>
      )}
    </figure>
  );
}
