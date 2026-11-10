"use client";
import { useEffect, useState } from "react";
import { onScroll, scroll, watchScroll } from "../lib/scroll";
export const blocks = [
  ["boot", "Start"],
  ["origin", "Origin"],
  ["skills", "Skills"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["beyond", "Beyond the bench"],
  ["goals", "Goals"],
  ["connect", "Connect"],
];
export default function Rail() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const stop = onScroll(() => setIndex(scroll.index));
    const unwatch = watchScroll();
    return () => {
      stop();
      unwatch();
    };
  }, []);
  return (
    <nav className="rail" aria-label="Sections">
      {blocks.map(([id, label], i) => (
        <a
          key={id}
          href={"#" + id}
          aria-current={i === index ? "true" : undefined}
        >
          <span className="rail-pad" />
          <span className="rail-label">{label}</span>
        </a>
      ))}
    </nav>
  );
}
