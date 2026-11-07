"use client";
import { useState } from "react";
export default function NetDemo() {
  const [net, setNet] = useState("signal");
  const [correct, setCorrect] = useState(true);
  return (
    <section className="net-demo">
      <p className="eyebrow">Interactive explanation</p>
      <h2>Follow a connection.</h2>
      <p>
        This simplified illustration explains connected breadboard rows. It is a
        portfolio demonstration, not a capture of WireTrace.
      </p>
      <div className="net-controls" aria-label="Choose a connection">
        {["signal", "ground"].map((n) => (
          <button key={n} aria-pressed={net === n} onClick={() => setNet(n)}>
            {n === "signal" ? "Signal net" : "Ground net"}
          </button>
        ))}
        <button aria-pressed={!correct} onClick={() => setCorrect((c) => !c)}>
          {correct ? "Show misplaced jumper" : "Correct jumper"}
        </button>
      </div>
      <svg
        viewBox="0 0 640 300"
        role="img"
        aria-label={`${net} net selected. Jumper ${correct ? "connects the intended row" : "is in the adjacent, unconnected row"}.`}
      >
        <rect x="20" y="20" width="600" height="260" rx="12" fill="#eeede5" />
        {Array.from({ length: 60 }, (_, i) => {
          const row = Math.floor(i / 10),
            col = i % 10,
            active = row === (net === "signal" ? 2 : 4);
          return (
            <circle
              key={i}
              cx={60 + col * 56}
              cy={60 + row * 36}
              r="7"
              fill={active ? "#2448cf" : "#9ca59f"}
            />
          );
        })}
        <path
          d={`M116 60V${correct ? 132 : 168}H396`}
          fill="none"
          stroke={net === "signal" ? "#2448cf" : "#9ca59f"}
          strokeWidth="7"
        />
        <path
          d="M172 240V204H508"
          fill="none"
          stroke={net === "ground" ? "#2448cf" : "#9ca59f"}
          strokeWidth="7"
        />
        {!correct && (
          <circle
            cx="396"
            cy="168"
            r="14"
            fill="none"
            stroke="#a4492a"
            strokeWidth="3"
          />
        )}
      </svg>
      <p role="status">
        {correct
          ? "The jumper ends in the intended row. Its connected holes share the signal."
          : "The jumper ends one row too low. Nearby holes are not necessarily electrically connected."}
      </p>
    </section>
  );
}
