"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import data from "@/content/site";
import { ProjectArt } from "./icons";
const labels = ["Sketch", "Build", "Test"];
export default function Notebook() {
  const [tab, setTab] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className="notebook">
      <div className="notebook-binding" aria-hidden="true" />
      <div
        className="notebook-tabs"
        role="tablist"
        aria-label="Engineering notebook"
      >
        {labels.map((label, i) => (
          <button
            key={label}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            id={"notebook-tab-" + i}
            role="tab"
            aria-selected={i === tab}
            aria-controls={"notebook-panel-" + i}
            tabIndex={i === tab ? 0 : -1}
            onClick={() => setTab(i)}
            onKeyDown={(e) => {
              let next = i;
              if (e.key === "ArrowRight") next = (i + 1) % 3;
              else if (e.key === "ArrowLeft") next = (i + 2) % 3;
              else if (e.key === "Home") next = 0;
              else if (e.key === "End") next = 2;
              else return;
              e.preventDefault();
              setTab(next);
              buttons.current[next]?.focus();
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {labels.map((label, i) => {
        const sheet = data.aboutNotebook[i];
        return (
        <div
          key={label}
          role="tabpanel"
          id={"notebook-panel-" + i}
          aria-labelledby={"notebook-tab-" + i}
          hidden={tab !== i}
          tabIndex={0}
          className={"notebook-sheet notebook-" + i}
        >
          <p className="eyebrow">Design notebook / 0{i + 1}</p>
          {sheet.asset ? (
            <Image
              src={sheet.asset}
              alt={sheet.alt ?? ""}
              width={i === 2 ? 1139 : 1440}
              height={i === 2 ? 1663 : 900}
              sizes="(max-width: 700px) 100vw, 640px"
              style={{ width: "100%", height: "auto" }}
            />
          ) : i === 0 ? (
            // TODO: no hand sketch of the gantry yet.
            <ProjectArt kind="hanoi-gantry" />
          ) : (
            <svg
              className="test-chart"
              viewBox="0 0 640 400"
              role="img"
              aria-label="Blank test record awaiting measured results"
            >
              <path
                d="M80 60v260h490"
                fill="none"
                stroke="#7b8787"
                strokeWidth="2"
              />
              {[100, 150, 200, 250].map((y) => (
                <path
                  key={y}
                  d={`M80 ${y}H570`}
                  stroke="#c3c9be"
                  strokeDasharray="4 5"
                />
              ))}
              <text x="120" y="190" fontSize="18" fill="#68726e">
                No measurements recorded
              </text>
              <text x="80" y="355" fill="#68726e" fontSize="13">
                TEST RECORD / AWAITING EVIDENCE
              </text>
            </svg>
          )}
          <div className="notebook-caption">
            <span>0{i + 1}</span>
            <p>
              {sheet.caption ?? sheet.prompt}
            </p>
          </div>
        </div>
        );
      })}
    </div>
  );
}
