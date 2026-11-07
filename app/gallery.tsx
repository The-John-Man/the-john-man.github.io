"use client";
import { useState, useEffect, useRef, type CSSProperties } from "react";
import data from "@/content/site";
import { Arrow, ProjectArt } from "./components/icons";
type Project = (typeof data.projects)[number];
const defaultProjects = data.projects.slice(0, 3);
export default function Gallery({
  projects = defaultProjects,
}: {
  projects?: Project[];
}) {
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState(0);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const count = projects.length;
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function restore() {
      const saved = sessionStorage.getItem("portfolio-project");
      const i = projects.findIndex((p) => p.slug === saved);
      if (i >= 0) {
        setIndex(i);
        requestAnimationFrame(() => {
          const el = rail.current;
          const card = el?.querySelectorAll<HTMLElement>(".project-card")[i];
          if (el && card && matchMedia("(max-width: 700px)").matches)
            el.scrollTo({
              left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2,
              behavior: "instant",
            });
        });
      }
      if (sessionStorage.getItem("portfolio-return")) {
        sessionStorage.removeItem("portfolio-return");
        requestAnimationFrame(() => {
          document
            .getElementById("projects")
            ?.scrollIntoView({ behavior: "instant" });
          link.current?.focus({ preventScroll: true });
        });
      }
    }
    restore();
    window.addEventListener("pageshow", restore);
    return () => window.removeEventListener("pageshow", restore);
  }, [projects]);
  function choose(i: number) {
    if (!count) return;
    const next = (i + count) % count;
    setTurn((t) => t + 1);
    setIndex(next);
    const el = rail.current;
    if (el && matchMedia("(max-width: 700px)").matches) {
      const card = el.querySelectorAll<HTMLElement>(".project-card")[next];
      if (card)
        el.scrollTo({
          left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2,
          behavior: "instant",
        });
    }
    sessionStorage.setItem("portfolio-project", projects[next].slug);
  }
  if (!count) return <p className="muted">New projects are on the way.</p>;
  const p = projects[index] ?? projects[0];
  return (
    <div
      className="gallery"
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected projects"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          choose(index + 1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          choose(index - 1);
        }
      }}
    >
      <div
        ref={rail}
        className="turntable"
        style={{ "--turn": `${turn * 45}deg` } as CSSProperties}
        onPointerDown={(e) => {
          pointer.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          if (matchMedia("(max-width: 700px)").matches) return;
          if (!pointer.current) return;
          const dx = e.clientX - pointer.current.x,
            dy = e.clientY - pointer.current.y;
          pointer.current = null;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4)
            choose(index + (dx < 0 ? 1 : -1));
        }}
        onPointerCancel={() => {
          pointer.current = null;
        }}
        onScroll={(e) => {
          if (!matchMedia("(max-width: 700px)").matches) return;
          const el = e.currentTarget;
          const cards = Array.from(
            el.querySelectorAll<HTMLElement>(".project-card"),
          );
          const closest = cards.reduce(
            (best, card, i) =>
              Math.abs(
                card.offsetLeft +
                  card.clientWidth / 2 -
                  el.scrollLeft -
                  el.clientWidth / 2,
              ) <
              Math.abs(
                cards[best].offsetLeft +
                  cards[best].clientWidth / 2 -
                  el.scrollLeft -
                  el.clientWidth / 2,
              )
                ? i
                : best,
            0,
          );
          if (closest !== index) {
            setIndex(closest);
            sessionStorage.setItem("portfolio-project", projects[closest].slug);
          }
        }}
      >
        <div className="gear-decoration" aria-hidden="true">
          <svg viewBox="0 0 500 220">
            {[0, 1].map((g) => (
              <g
                key={g}
                className={"gear gear-" + g}
                style={{ transformOrigin: `${g ? 335 : 175}px 110px` }}
              >
                <circle
                  cx={g ? 335 : 175}
                  cy="110"
                  r={g ? 64 : 84}
                  fill="none"
                  stroke={g ? "#2448cf" : "#a1aaa0"}
                  strokeWidth="18"
                  strokeDasharray={g ? "12 8" : "14 9"}
                />
                <circle
                  cx={g ? 335 : 175}
                  cy="110"
                  r="20"
                  fill="none"
                  stroke="#84918d"
                  strokeWidth="8"
                />
              </g>
            ))}
          </svg>
        </div>
        <div className="orbit" aria-hidden="true" />
        {projects.map((item, i) => {
          let d = (i - index + count) % count;
          if (d > count / 2) d -= count;
          const pos = d === 0 ? "center" : d < 0 ? "left" : "right";
          return (
            <div
              key={item.slug}
              className={"project-card " + pos}
              aria-hidden={i !== index}
              style={
                {
                  "--distance": Math.abs(d),
                  viewTransitionName:
                    i === index ? `project-${item.slug}` : "none",
                  visibility: Math.abs(d) > 1 ? "hidden" : "visible",
                } as CSSProperties
              }
            >
              <ProjectArt kind={item.slug} />
              <div className="print-caption">
                <span>{item.title}</span>
                <small>0{i + 1} / STUDY</small>
              </div>
            </div>
          );
        })}
      </div>
      <div className="project-description">
        <div aria-live="polite" aria-atomic="true">
          <p className="eyebrow">{p.discipline}</p>
          <h3>{p.title}</h3>
          <p>{p.summary}</p>
        </div>
        <a
          ref={link}
          id="active-project-link"
          className="text-link"
          href={"/projects/" + p.slug}
          onClick={() => {
            sessionStorage.setItem("portfolio-project", p.slug);
            sessionStorage.setItem("portfolio-return", "true");
          }}
        >
          Explore project <Arrow />
        </a>
      </div>
      {count > 1 && (
        <div className="gallery-controls">
          <button
            aria-label="Previous project"
            onClick={() => choose(index - 1)}
          >
            <Arrow back />
          </button>
          <div className="project-dots" aria-label="Choose project">
            {projects.map((item, i) => (
              <button
                key={item.slug}
                aria-label={"Show " + item.title}
                aria-pressed={i === index}
                onClick={() => choose(i)}
              >
                <span />
              </button>
            ))}
          </div>
          <button aria-label="Next project" onClick={() => choose(index + 1)}>
            <Arrow />
          </button>
        </div>
      )}
      <div className="reduced-project-list">
        {projects.map((item, i) => (
          <button
            key={item.slug}
            aria-pressed={index === i}
            onClick={() => choose(i)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <noscript>
        <ul className="static-projects">
          {projects.map((p) => (
            <li key={p.slug}>
              <a href={"/projects/" + p.slug}>
                {p.title} — {p.summary}
              </a>
            </li>
          ))}
        </ul>
      </noscript>
      <p className="art-note">
        Illustrated concepts · project captures to follow
      </p>
    </div>
  );
}
