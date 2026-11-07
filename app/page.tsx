import { profile, skills } from "@/content/site";
import { pages } from "./site-nav";

// Each wire runs from a header pin on the left to a nav pad on the right.
const pinsY = [90, 160, 230, 300];
const pads = [
  { label: "About", href: "#about", y: 40 },
  { label: "Projects", href: "/projects", y: 140 },
  { label: "Experience", href: "/experience", y: 240 },
  { label: "Interests", href: "/interests", y: 340 },
];
const wires = [
  { from: 1, to: 0, color: "var(--wire-yellow)" },
  { from: 3, to: 1, color: "var(--wire-orange)" },
  { from: 0, to: 2, color: "var(--wire-blue)" },
  { from: 2, to: 3, color: "var(--wire-red)" },
];
const pinNames = ["D2", "D5", "D9", "D13"];

function Board() {
  return (
    <svg className="board" viewBox="0 0 560 400">
      <rect x="44" y="56" width="36" height="278" rx="4" className="header" />
      {pinsY.map((y, i) => (
        <g key={y}>
          <rect x="54" y={y - 8} width="16" height="16" rx="2" className="pin" />
          <text x="36" y={y + 4} textAnchor="end" className="silk">{pinNames[i]}</text>
        </g>
      ))}
      {wires.map((w, i) => {
        const y1 = pinsY[w.from];
        const y2 = pads[w.to].y + 22;
        return (
          <path
            key={i}
            d={`M62 ${y1} C 240 ${y1}, 210 ${y2}, 372 ${y2}`}
            pathLength={1}
            className="wire"
            style={{ stroke: w.color, animationDelay: `${i * 0.18}s` }}
          />
        );
      })}
      {pads.map((p) => (
        <a key={p.href} href={p.href} className="pad">
          <rect x="372" y={p.y} width="176" height="44" rx="6" />
          <text x="392" y={p.y + 28}>{p.label}</text>
        </a>
      ))}
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <header className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <h1>{profile.name}</h1>
            <p>{profile.tagline}</p>
          </div>
          <nav aria-label="Sections">
            <Board />
          </nav>
        </div>
      </header>

      <div className="sheet">
        <section id="about" className="section about">
          <h2>About me</h2>
          <p className="about-text">{profile.about}</p>
          <div className="skills">
            {skills.map((s) => (
              <div key={s.group}>
                <h3>{s.group}</h3>
                <ul>{s.items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Keep going</h2>
          <ul className="page-links">
            {pages.map((p) => (
              <li key={p.href}>
                <a href={p.href} style={{ "--pin": p.color } as React.CSSProperties}>{p.label}</a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
