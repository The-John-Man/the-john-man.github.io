import data from "@/content/site";
import Image from "next/image";
import { notFound } from "next/navigation";
import BeforeAfter from "../../components/before-after";
import { Arrow, ProjectMedia } from "../../components/icons";
import ModelViewer from "../../components/model-viewer";
import NetDemo from "../../components/net-demo";
import TitleBlock from "../../components/title-block";
import Slot from "../../home/slot";
export function generateStaticParams() {
  return data.projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = data.projects.find((p) => p.slug === slug);
  return { title: p ? `${p.title} — John Manuel` : "Project not found" };
}
export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = data.projects.findIndex((p) => p.slug === slug);
  const p = data.projects[index];
  if (!p) notFound();
  const next = data.projects[(index + 1) % data.projects.length];
  const stack = p.stack as string[];
  const gallery = Array.isArray(p.gallery) ? p.gallery : [];
  const extraLinks = Array.isArray(p.extraLinks) ? p.extraLinks : [];
  const compare =
    p.compare && typeof p.compare === "object" ? p.compare : null;
  const sections: [string, string | null, string][] = [
    ["Problem", p.problem, "To add: who had the problem, and what made it hard"],
    ["What I built", p.built ?? p.contribution, "To add: what you made, and which parts were yours"],
    ["How it works", p.howItWorks ?? p.designDecision, "To add: the one design decision worth explaining"],
    ["Results", p.result, "To add: what you observed, with the test conditions"],
  ];
  return (
    <main id="main" className="case">
      <TitleBlock
        doc={p.title}
        status={p.status ?? (p.readyForPublication ? "Released" : "Draft")}
        back="/#projects"
      />
      <div className="case-header">
        <p className="eyebrow">{p.discipline}</p>
        {p.thread && <p className="eyebrow">{p.thread}</p>}
        <h1>{p.title}</h1>
        <p className="lead">{p.summary}</p>
        {p.disclaimer && <p className="muted">{p.disclaimer}</p>}
        <Slot value={p.role} prompt="Role: to add (solo, or your part in the team)">
          <p className="muted">{p.role}</p>
        </Slot>
        <div className="case-links">
          {p.sourceUrl && (
            <a className="text-link" href={p.sourceUrl}>
              View repository <Arrow />
            </a>
          )}
          {p.demoUrl && (
            <a className="text-link" href={p.demoUrl}>
              Try the demo <Arrow />
            </a>
          )}
          {extraLinks.map((link) => (
            <a className="text-link" key={link.href} href={link.href}>
              {link.label} <Arrow />
            </a>
          ))}
        </div>
      </div>
      <figure
        className="case-hero"
        style={{ viewTransitionName: `project-${p.slug}` }}
      >
        <Slot
          value={p.heroImage}
          prompt={"Cover video or image. " + p.editorPrompt}
          ratio="16 / 10"
        >
          <ProjectMedia p={p} />
          <figcaption>{p.heroCaption}</figcaption>
        </Slot>
      </figure>
      {p.model && p.heroImage && (
        <ModelViewer src={p.model} poster={p.heroImage} alt={p.heroAlt ?? p.title} />
      )}
      {gallery.length > 0 && (
        <ul className="case-gallery">
          {gallery.map((shot) => (
            <li key={shot.src}>
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                sizes="(max-width: 700px) 100vw, 480px"
                style={{ width: "100%", height: "auto" }}
              />
              <span>{shot.caption}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="case-sections">
        {sections.map(([title, value, prompt]) => (
          <section key={title}>
            <h2>{title}</h2>
            <Slot value={value} prompt={prompt}>
              <p className="lead">{value}</p>
            </Slot>
            {title === "How it works" && compare && (
              <BeforeAfter
                before={compare.before}
                after={compare.after}
                beforeAlt={compare.beforeAlt}
                afterAlt={compare.afterAlt}
                caption={compare.caption}
              />
            )}
            {title === "How it works" && (
              <Slot
                value={p.diagram}
                prompt="Diagram: a block diagram or annotated screenshot"
                ratio="16 / 7"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
                <img src={p.diagram ?? ""} alt="" />
              </Slot>
            )}
          </section>
        ))}
        <section>
          <h2>Stack</h2>
          <Slot value={stack.length} prompt="To add: languages, tools and parts">
            <ul className="chips">
              {stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Slot>
          {p.nextStep && <p className="muted">Next: {p.nextStep}</p>}
        </section>
      </div>
      {p.slug === "wiretrace" && <NetDemo />}
      <div className="next-case">
        <span className="eyebrow">Next project</span>
        <a href={"/projects/" + next.slug}>
          {next.title}
          <Arrow />
        </a>
      </div>
    </main>
  );
}
