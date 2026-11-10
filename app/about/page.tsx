import data from "@/content/site";
import Notebook from "../components/notebook";
import TitleBlock from "../components/title-block";
import Slot from "../home/slot";
export const metadata = { title: "About — John Manuel" };
export default function About() {
  return (
    <main id="main">
      <section id="about" className="chapter">
        <TitleBlock doc="About John" status={data.profile.status} back="/#origin" />
        <div className="about-grid">
          <div>
            <h2>
              Ideas become
              <br />
              something real.
            </h2>
            <p className="lead">{data.profile.intro}</p>
            <p className="muted">
              {data.profile.program}
              <br />
              {data.profile.school}
            </p>
            {data.profile.personalDetail && (
              <p>{data.profile.personalDetail}</p>
            )}
          </div>
          <Notebook />
        </div>
        <div className="stories">
          {data.origin.map((o) => (
            <article key={o.id}>
              <Slot value={o.photo} prompt={o.photoPrompt} ratio="4 / 3">
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
                <img src={o.photo ?? ""} alt={o.photoAlt ?? ""} />
              </Slot>
              <h3>{o.title}</h3>
              <p>{o.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
