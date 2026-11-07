import type { Metadata } from "next";
import { profile, aspirations, interests } from "@/content/site";
import { SiteNav, NextPage } from "../site-nav";

export const metadata: Metadata = { title: `Interests | ${profile.name}` };

export default function Interests() {
  return (
    <>
      <SiteNav current="/interests" />
      <main>
        <section className="section page-head">
          <h1>Interests and aspirations</h1>
          <p>What I&apos;m working toward, and what I can&apos;t stop thinking about.</p>
        </section>

        <section className="section">
          <h2 className="section-title">Where I&apos;m headed</h2>
          <ol className="roadmap">
            {aspirations.map((a) => (
              <li key={a.when}>
                <h3>{a.when}</h3>
                <p>{a.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="section">
          <h2 className="section-title">What I&apos;m into</h2>
          <ul className="interests">
            {interests.map((it) => (
              <li key={it.name}>
                <h3>{it.name}</h3>
                <p>{it.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <NextPage current="/interests" />
      </main>
    </>
  );
}
