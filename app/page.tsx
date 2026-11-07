import Image from "next/image";
import { profile, projects, inTheWorks, skills } from "@/content/site";

// Each wire runs from a header pin on the left to a nav pad on the right.
const pinsY = [90, 160, 230, 300];
const pads = [
  { label: "Projects", href: "#projects", y: 40 },
  { label: "In the works", href: "#works", y: 140 },
  { label: "About", href: "#about", y: 240 },
  { label: "Contact", href: "#contact", y: 340 },
];
const wires = [
  { from: 1, to: 0, color: "var(--wire-orange)" },
  { from: 3, to: 1, color: "var(--wire-yellow)" },
  { from: 0, to: 2, color: "var(--wire-blue)" },
  { from: 2, to: 3, color: "var(--wire-red)" },
];
const pinNames = ["D2", "D5", "D9", "D13"];
const accents = ["var(--wire-orange)", "var(--wire-blue)", "var(--wire-red)"];

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
  const { links } = profile;
  const contact = [
    { label: "GitHub", href: links.github },
    { label: "LinkedIn", href: links.linkedin },
    { label: "Email", href: links.email && `mailto:${links.email}` },
    { label: "Resume", href: links.resume },
  ].filter((l) => l.href);

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

      <section id="projects" className="section">
        <h2>Projects</h2>
        {projects.map((p, i) => (
          <article key={p.name} className="project" style={{ "--accent": accents[i % accents.length] } as React.CSSProperties}>
            <div className="project-media">
              {p.image ? (
                <Image src={p.image.src} width={p.image.width} height={p.image.height} alt={p.image.alt} sizes="(max-width: 860px) 100vw, 60vw" />
              ) : (
                <dl className="gestures">
                  {p.gestures?.map((g) => (
                    <div key={g.action}>
                      <dt>{g.action}</dt>
                      <dd>{g.result}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <div className="project-text">
              <h3>{p.name}</h3>
              <p className="summary">{p.summary}</p>
              <p>{p.description}</p>
              <ul className="tech">
                {p.tech.map((t) => <li key={t}>{t}</li>)}
              </ul>
              {p.note && <p className="note">{p.note}</p>}
              {p.links.length > 0 && (
                <p className="links">
                  {p.links.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
                </p>
              )}
            </div>
          </article>
        ))}
      </section>

      <section id="works" className="section">
        <h2>In the works</h2>
        <ul className="works">
          {inTheWorks.map((w) => (
            <li key={w.name}>
              <h3>{w.name}</h3>
              <p>{w.description}</p>
              <ul className="tech">
                {w.tech.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section id="about" className="section about">
        <h2>About</h2>
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

      <section id="contact" className="section">
        <h2>Contact</h2>
        <p className="links big">
          {contact.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
        </p>
      </section>

      <footer className="footer">Built by {profile.name} with Next.js.</footer>
    </main>
  );
}
