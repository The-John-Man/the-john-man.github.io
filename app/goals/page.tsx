import data from "@/content/site";
import { Arrow } from "../components/icons";
import TitleBlock from "../components/title-block";
import Slot from "../home/slot";
export const metadata = { title: "Goals — John Manuel" };
export default function Goals() {
  return (
    <main id="main">
      <section id="goals" className="chapter">
        <TitleBlock doc="Goals" status={data.profile.status} back="/#goals" />
        <h2>
          The next
          <br />
          open circuit.
        </h2>
        <div className="goals">
          {data.directions.map((d) => (
            <article key={d.id}>
              <p className="eyebrow">
                <span className="open-pad" /> Direction
              </p>
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
        <h2 className="sub">Next experiments</h2>
        <div className="goals">
          {data.goals.map((g) => (
            <article key={g.title}>
              <p className="eyebrow">
                <span className="open-pad" /> {g.stage}
              </p>
              <h3>{g.title}</h3>
              <p>{g.question}</p>
              {g.related && (
                <a className="text-link" href={g.related}>
                  HeadNav <Arrow />
                </a>
              )}
              <div className="next">
                <small>Next experiment</small>
                <p>{g.proposedNextExperiment}</p>
                {g.successCriterionToSet && (
                  <p className="muted">{g.successCriterionToSet}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
