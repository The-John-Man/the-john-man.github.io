import data from "@/content/site";
import Wave from "../components/wave";
import { Arrow } from "../components/icons";
export const metadata = { title: "Goals — John Manuel" };
export default function Goals() {
  return (
    <main id="main">
      <section id="goals" className="chapter">
        <a className="text-link board-back" href="/#board">
          <Arrow back /> Back to the board
        </a>
        <p className="eyebrow">04 / Goals & aspirations</p>
        <div className="goals-header">
          <h2>
            The next
            <br />
            open circuit.
          </h2>
          <Wave />
        </div>
        <div className="goals">
          {data.goals.map((g) => (
            <article key={g.title}>
              <p className="eyebrow">
                <span className="open-pad" /> {g.stage}
              </p>
              <h3>{g.title}</h3>
              <p>{g.question}</p>
              <div className="next">
                <small>NEXT EXPERIMENT</small>
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
