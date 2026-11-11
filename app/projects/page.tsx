import data from "@/content/site";
import { ProjectMedia } from "../components/icons";
import TitleBlock from "../components/title-block";
import Slot from "../home/slot";
export const metadata = { title: "Projects — John Manuel" };
export default function Projects() {
  return (
    <main id="main">
      <section id="projects" className="chapter">
        <TitleBlock doc="Project index" status={`${data.projects.length} projects`} back="/#projects" />
        <h2>Things I’ve built.</h2>
        <ul className="project-index">
          {data.projects.map((p) => (
            <li key={p.slug}>
              <a href={"/projects/" + p.slug}>
                {/* TODO: HeadNav, the insulin tracker, and RC vehicles still need a real cover. */}
                <Slot value={p.heroImage} prompt={p.heroImage ? "Cover to add" : p.editorPrompt} ratio="16 / 10">
                  <ProjectMedia p={p} />
                </Slot>
                <span className="eyebrow">{p.discipline}</span>
                <strong>{p.title}</strong>
                <span className="muted">{p.summary}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
