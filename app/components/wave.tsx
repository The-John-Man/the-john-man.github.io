"use client";
import { useState } from "react";
export default function Wave() {
  const [offset, setOffset] = useState(0);
  return (
    <div
      className="wave-study"
      onPointerMove={(e) => {
        if (
          e.pointerType !== "touch" &&
          !matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          const r = e.currentTarget.getBoundingClientRect();
          setOffset(((e.clientX - r.left) / r.width) * 4);
        }
      }}
    >
      <svg viewBox="0 0 800 280" aria-hidden="true">
        {Array.from({ length: 21 }, (_, j) => (
          <path
            key={j}
            d={Array.from({ length: 81 }, (_, i) => {
              const x = i * 10,
                y =
                  70 +
                  j * 7 +
                  Math.sin(i * 0.13 + offset + j * 0.08) *
                    Math.exp(-Math.pow((i - 40) / 25, 2)) *
                    60;
              return `${i ? "L" : "M"}${x} ${y.toFixed(2)}`;
            }).join(" ")}
            fill="none"
            stroke={j === 10 ? "#2448cf" : "#a9b2a7"}
            strokeWidth={j === 10 ? 3 : 1}
          />
        ))}
      </svg>
      <small>Control surface / illustrative study</small>
    </div>
  );
}
