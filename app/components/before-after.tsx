"use client";
import Image from "next/image";
import { useState, useSyncExternalStore } from "react";

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

const frame = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
};

export default function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
  caption,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  caption: string;
}) {
  const reduced = useReducedMotion();
  const [pct, setPct] = useState(56);
  if (reduced) {
    return (
      <div className="compare compare-still">
        <figure>
          <Image src={before} alt={beforeAlt} width={1440} height={900} style={{ width: "100%", height: "auto" }} />
          <figcaption>Landing</figcaption>
        </figure>
        <figure>
          <Image src={after} alt={afterAlt} width={1440} height={900} style={{ width: "100%", height: "auto" }} />
          <figcaption>Visualizer</figcaption>
        </figure>
        <p className="muted">{caption}</p>
      </div>
    );
  }
  return (
    <figure className="compare">
      <div className="compare-frame">
        <Image src={after} alt={afterAlt} width={1440} height={900} style={frame} />
        <div className="compare-top" style={{ width: `${pct}%` }}>
          <Image
            src={before}
            alt={beforeAlt}
            width={1440}
            height={900}
            style={{ ...frame, width: "100cqi", maxWidth: "none" }}
          />
        </div>
        <span className="compare-tag">Landing</span>
        <span className="compare-tag compare-tag-after">Visualizer</span>
      </div>
      <label>
        Compare landing page and visualizer
        <input
          type="range"
          min={0}
          max={100}
          value={pct}
          onChange={(e) => setPct(Number(e.target.value))}
        />
      </label>
      {/* TODO: swap in the WireTrace ui-redesign before/after pair. Landing vs visualizer is a stand-in. */}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
