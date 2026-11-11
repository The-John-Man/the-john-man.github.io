import type { CSSProperties } from "react";
import data from "@/content/site";
import HackathonBadges from "../components/hackathon-badges";
import { Arrow, ProjectMedia } from "../components/icons";
import Slot from "./slot";

// A pinned section scrolls `travel` viewport-heights while its stage stays in view.
const pin = (travel: number) => ({ "--travel": travel }) as CSSProperties;

export function Boot() {
  const { profile } = data;
  return (
    <section id="boot" data-block="boot" className="pin" style={pin(1)}>
      <div className="stage">
        <div className="boot-copy">
          <h1>
            John
            <br />
            Manuel
          </h1>
          <p className="tagline">{profile.tagline}</p>
          <p className="dim">
            {profile.program}
            <br />
            {profile.school}
          </p>
          <a className="status" href="#connect">
            <span className="led" />
            {profile.status}
          </a>
        </div>
        <p className="hint">Scroll to follow the signal</p>
      </div>
    </section>
  );
}

export function Origin() {
  return (
    <section
      id="origin"
      data-block="origin"
      data-steps={data.origin.length}
      className="pin"
      style={pin(data.origin.length * 0.8)}
    >
      <div className="stage">
        <div className="col">
          <p className="refdes">U1</p>
          <h2>Where it started.</h2>
          <div className="steps">
            {data.origin.map((o, i) => (
              <article
                key={o.id}
                className="story"
                data-step={i}
                data-current={i === 0 ? "" : undefined}
              >
                <Slot value={o.photo} prompt={o.photoPrompt} ratio="4 / 3">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
                  <img src={o.photo ?? ""} alt={o.photoAlt ?? ""} />
                </Slot>
                <h3>{o.title}</h3>
                <p>{o.body}</p>
              </article>
            ))}
          </div>
          <ul className="facts">
            {data.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <a className="text-link" href="/about">
            More about me <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  const entries = data.experience;
  return (
    <section
      id="experience"
      data-block="experience"
      data-steps={entries.length}
      className="pin"
      style={pin(entries.length * 0.6)}
    >
      <div className="stage">
        <div className="col col-low">
          <h2>Learning by showing up.</h2>
          <div className="steps">
            {entries.map((e, i) => (
              <article
                key={e.id ?? i}
                id={e.id ?? undefined}
                className={e.open ? "role role-open" : "role"}
                data-step={i}
                data-current={i === 0 ? "" : undefined}
              >
                {e.dates && <p className="mono">{e.dates}</p>}
                <h3>{e.role || e.organization}</h3>
                {e.role && e.organization && <p>{e.organization}</p>}
                {e.type && <p className="dim">{e.type}</p>}
                {e.context && <p>{e.context}</p>}
                {e.personalAction && <p>{e.personalAction}</p>}
                {e.outcome && <p>{e.outcome}</p>}
                {e.open ? (
                  <a className="button" href="#connect">
                    Get in touch <Arrow />
                  </a>
                ) : (
                  <Slot
                    value={e.dates && e.personalAction && e.outcome}
                    prompt="To add: dates, what you did, and what came of it"
                  />
                )}
              </article>
            ))}
          </div>
          <a className="text-link" href="/experience">
            Full history <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Projects() {
  const featured = data.projects.filter((p) => p.featured);
  const rest = data.projects.filter((p) => !p.featured);
  return (
    <>
      <section
        id="projects"
        data-block="projects"
        data-steps={featured.length}
        className="pin"
        style={pin(featured.length)}
      >
        <div className="stage">
          <div className="col col-wide">
            <h2>Things I’ve built.</h2>
            <div className="steps">
              {featured.map((p, i) => (
                <article
                  key={p.slug}
                  className="feature"
                  data-step={i}
                  data-current={i === 0 ? "" : undefined}
                >
                  <div
                    className="plate"
                    style={{ viewTransitionName: `project-${p.slug}` }}
                  >
                    <Slot
                      value={p.heroImage}
                      prompt={"Cover video or image. " + p.editorPrompt}
                      ratio="16 / 10"
                    >
                      <ProjectMedia p={p} />
                    </Slot>
                  </div>
                  <div className="feature-copy">
                    <p className="refdes">
                      J{i + 1} <span>{p.discipline}</span>
                    </p>
                    <h3>{p.title}</h3>
                    <p>{p.summary}</p>
                    <div className="links">
                      <a className="button" href={"/projects/" + p.slug}>
                        Read the datasheet <Arrow />
                      </a>
                      {p.sourceUrl && (
                        <a className="text-link" href={p.sourceUrl}>
                          Repository <Arrow />
                        </a>
                      )}
                      {p.demoUrl && (
                        <a className="text-link" href={p.demoUrl}>
                          Try the demo <Arrow />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="more-projects">
        <ul>
          {rest.map((p) => (
            <li key={p.slug}>
              <a href={"/projects/" + p.slug}>
                <span className="mono">{p.discipline}</span>
                <strong>{p.title}</strong>
                <span className="dim">{p.summary}</span>
              </a>
            </li>
          ))}
        </ul>
        <a className="text-link" href="/projects">
          All projects <Arrow />
        </a>
      </div>
    </>
  );
}

export function Beyond() {
  return (
    <section id="beyond" data-block="beyond">
      <h2>Beyond the bench.</h2>
      <p className="lede">
        Lifeguard, hackathon regular, and the person behind the sound desk at
        community events.
      </p>
      <div className="photos">
        {data.beyond.photos.map((ph, i) => (
          <figure key={i}>
            <Slot value={ph.src} prompt={ph.prompt} ratio={i % 3 ? "1" : "4 / 3"}>
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
              <img src={ph.src ?? ""} alt={ph.alt ?? ""} />
            </Slot>
            {ph.caption && <figcaption>{ph.caption}</figcaption>}
          </figure>
        ))}
      </div>
      <HackathonBadges />
    </section>
  );
}

export function Goals() {
  return (
    <section
      id="goals"
      data-block="goals"
      data-steps={data.directions.length}
      className="pin"
      style={pin(1.2)}
    >
      <div className="stage">
        <div className="col col-low col-full">
          <h2>The next open circuit.</h2>
          <p className="lede">Three connections I haven’t routed yet.</p>
          <div className="steps all">
            {data.directions.map((d, i) => (
              <article
                key={d.id}
                className="direction"
                data-step={i}
                data-current={i === 0 ? "" : undefined}
              >
                <h3>{d.title}</h3>
                <Slot
                  value={d.why}
                  prompt="To add: why this field pulls you, in two sentences"
                >
                  <p>{d.why}</p>
                </Slot>
              </article>
            ))}
          </div>
          <a className="text-link" href="/goals">
            Next experiments <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Connect() {
  const { profile } = data;
  const links: [string, string | null, string][] = [
    ["Email", profile.email && "mailto:" + profile.email, "your email address"],
    ["LinkedIn", profile.linkedinUrl, "your LinkedIn URL"],
    ["GitHub", profile.githubUrl, "your GitHub URL"],
    ["Résumé", profile.resumeUrl, "a résumé PDF"],
  ];
  return (
    <section id="connect" data-block="connect" className="pin" style={pin(1)}>
      <div className="stage">
        <div className="col">
          <p className="refdes">J5</p>
          <h2>
            Let’s make
            <br />a connection.
          </h2>
          <p className="lede">{profile.status}.</p>
          <div className="contacts">
            {links.map(([label, href, missing]) => (
              <Slot key={label} value={href} prompt={`${label}: add ${missing}`}>
                <a className="button" href={href ?? ""}>
                  {label} <Arrow />
                </a>
              </Slot>
            ))}
          </div>
          <a className="text-link" href="#boot">
            <Arrow back /> Back to the start
          </a>
        </div>
      </div>
    </section>
  );
}
