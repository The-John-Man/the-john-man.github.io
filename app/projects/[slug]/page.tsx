import data from "@/content/site";
import { notFound } from "next/navigation";
import { Arrow, ProjectMedia } from "../../components/icons";
import NetDemo from "../../components/net-demo";
import BackLink from "../../components/back-link";
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
  // Unfilled editorial slots render nothing, so a draft page has no empty rows.
  const fields = [
    ["My contribution", p.contribution],
    ["Observed result", p.result],
    ["Next step", p.nextStep],
  ].filter(([, value]) => value);
  return (
    <main id="main" className="case">
      <BackLink slug={p.slug} />
      <div className="case-header">
        <p className="eyebrow">
          Project / {String(index + 1).padStart(2, "0")} · {p.discipline}
        </p>
        <h1>{p.title}</h1>
        <p className="lead">{p.summary}</p>
        {p.status && <p>{p.status}</p>}
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
        </div>
      </div>
      <figure
        className="case-hero"
        style={{ viewTransitionName: `project-${p.slug}` }}
      >
        <ProjectMedia p={p} />
        <figcaption>
          {p.heroCaption ??
            "Concept illustration · original project media to follow"}
        </figcaption>
      </figure>
      {(p.designDecision || fields.length > 0) && (
        <div className="case-body">
          <div>
            <p className="eyebrow">The idea</p>
            <h2>
              {p.slug === "wiretrace"
                ? "Make connections visible."
                : p.slug === "facetracekr"
                  ? "An intentional gesture."
                  : p.slug === "humline"
                    ? "From a hum to a melody."
                    : "A mechanism with a purpose."}
            </h2>
            {p.designDecision && <p className="lead">{p.designDecision}</p>}
          </div>
          {fields.length > 0 && (
            <dl className="case-facts">
              {fields.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}
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
