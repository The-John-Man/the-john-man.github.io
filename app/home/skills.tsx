"use client";
import { useEffect, useState } from "react";
import data from "@/content/site";
import { Arrow } from "../components/icons";
import Slot from "./slot";

// Shared with the 3D component bank: which part is lifted, which group is lit.
export const bank = {
  hover: null as string | null,
  group: "all",
  subs: new Set<() => void>(),
  set(patch: { hover?: string | null; group?: string }) {
    Object.assign(bank, patch);
    bank.subs.forEach((fn) => fn());
  },
};
const groups = [
  ["all", "All"],
  ["software", "Software"],
  ["hardware", "Hardware"],
  ["cad", "CAD"],
];
export default function Skills() {
  const [, redraw] = useState(0);
  useEffect(() => {
    const fn = () => redraw((n) => n + 1);
    bank.subs.add(fn);
    return () => {
      bank.subs.delete(fn);
    };
  }, []);
  return (
    <section
      id="skills"
      data-block="skills"
      className="pin"
      style={{ "--travel": 0.6 } as React.CSSProperties}
    >
      <div className="stage">
        <div className="col col-right">
          <h2>What’s on the board.</h2>
          <div className="filters" role="group" aria-label="Filter skills">
            {groups.map(([id, label]) => (
              <button
                key={id}
                aria-pressed={bank.group === id}
                onClick={() => bank.set({ group: id })}
              >
                {label}
              </button>
            ))}
          </div>
          <ul className="skills">
            {data.skills.map((s) => {
              const project = data.projects.find((p) => p.slug === s.usedIn);
              return (
                <li
                  key={s.name}
                  data-lit={bank.hover === s.name ? "" : undefined}
                  data-dim={
                    bank.group !== "all" && bank.group !== s.group
                      ? ""
                      : undefined
                  }
                  onPointerEnter={() => bank.set({ hover: s.name })}
                  onPointerLeave={() => bank.set({ hover: null })}
                  onFocus={() => bank.set({ hover: s.name })}
                  onBlur={() => bank.set({ hover: null })}
                >
                  <strong>{s.name}</strong>
                  {s.note && <span>{s.note}</span>}
                  {project ? (
                    <a href={"/projects/" + project.slug}>
                      Used in {project.title} <Arrow />
                    </a>
                  ) : s.href ? (
                    <a href={s.href}>
                      {s.linkLabel} <Arrow />
                    </a>
                  ) : (
                    <Slot value={null} prompt="Used in: add a project" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
