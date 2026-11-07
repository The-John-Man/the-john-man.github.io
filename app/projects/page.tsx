import type { Metadata } from "next";
import Image from "next/image";
import { profile, projects, inTheWorks } from "@/content/site";
import { SiteNav, NextPage } from "../site-nav";

export const metadata: Metadata = { title: `Projects | ${profile.name}` };

const accents = ["var(--wire-orange)", "var(--wire-blue)", "var(--wire-red)"];

export default function Projects() {
  return (
    <>
      <SiteNav current="/projects" />
      <main>
        <section className="section page-head">
          <h1>Projects</h1>
          <p>Things I&apos;ve built, and what they do for the people using them.</p>
        </section>

        <section className="section" aria-label="Projects">
          {projects.map((p, i) => (
            <article key={p.name} className="project" style={{ "--accent": accents[i % accents.length] } as React.CSSProperties}>
              <div className="project-media">
                {p.image ? (
                  <Image src={p.image.src} width={p.image.width} height={p.image.height} alt={p.image.alt} sizes="(max-width: 860px) 100vw, 60vw" priority={i === 0} />
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
                <h2>{p.name}</h2>
                <p className="summary">{p.summary}</p>
                <p>{p.description}</p>
                <ul className="tech">{p.tech.map((t) => <li key={t}>{t}</li>)}</ul>
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
          <h2 className="section-title">In the works</h2>
          <ul className="works">
            {inTheWorks.map((w) => (
              <li key={w.name}>
                <h3>{w.name}</h3>
                <p>{w.description}</p>
                <ul className="tech">{w.tech.map((t) => <li key={t}>{t}</li>)}</ul>
              </li>
            ))}
          </ul>
        </section>

        <NextPage current="/projects" />
      </main>
    </>
  );
}
