import type { Metadata } from "next";
import { profile, experience } from "@/content/site";
import { SiteNav, NextPage } from "../site-nav";

export const metadata: Metadata = { title: `Experience | ${profile.name}` };

export default function Experience() {
  return (
    <>
      <SiteNav current="/experience" />
      <main>
        <section className="section page-head">
          <h1>Experience</h1>
          <p>Where I&apos;ve worked and what I did there, newest first.</p>
        </section>

        <section className="section" aria-label="Experience">
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.role + e.org}>
                <p className="dates">{e.dates}</p>
                <h2>{e.role}</h2>
                <p className="org">{e.org}</p>
                <ul>{e.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
              </li>
            ))}
          </ol>
        </section>

        <NextPage current="/experience" />
      </main>
    </>
  );
}
