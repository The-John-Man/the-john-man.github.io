import data from "@/content/site";
import Intro from "./components/intro";
import Notebook from "./components/notebook";
import Wave from "./components/wave";
import Gallery from "./gallery";
import { Arrow } from "./components/icons";
export default function Home() {
  return (
    <main id="main">
      <Intro />
      <section id="about" className="chapter">
        <p className="eyebrow">01 / About me</p>
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
            <a className="text-link" href="#experience">
              Keep following <Arrow />
            </a>
          </div>
          <Notebook />
        </div>
      </section>
      <section id="experience" className="chapter">
        <p className="eyebrow">02 / Work experience</p>
        <div className="experience-grid">
          <h2>
            Learning by
            <br />
            showing up.
          </h2>
          <div className="experience">
            {data.experience.map((e, i) => (
              <details key={i} name="experience">
                <summary>
                  <span className="timeline-pad" />
                  <span>
                    <strong>{e.role || e.organization}</strong>
                    {e.role && e.organization && (
                      <small>{e.organization}</small>
                    )}
                    {e.type && <small>{e.type}</small>}
                  </span>
                  {e.dates && <span className="date">{e.dates}</span>}
                  <span className="disclosure-icon" aria-hidden="true" />
                </summary>
                <div className="role-details">
                  {e.context && <p>{e.context}</p>}
                  {e.personalAction && <p>{e.personalAction}</p>}
                  {e.outcome && <p>{e.outcome}</p>}
                  {!e.context && !e.personalAction && !e.outcome && (
                    <p className="muted">Details to follow.</p>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section id="projects" className="chapter projects-chapter">
        <p className="eyebrow">03 / Selected projects</p>
        <h2>Things I’m connecting.</h2>
        <Gallery />
        <div className="team-project">
          <span className="eyebrow">Also on the workbench</span>
          <a href="/projects/hanoi-gantry">
            Tower of Hanoi gantry <Arrow />
          </a>
          <small>Robotics / team design</small>
        </div>
      </section>
      <section id="goals" className="chapter">
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
      <section className="closing">
        <p className="eyebrow">Always a work in progress</p>
        <h2>
          Let’s make
          <br />a connection.
        </h2>
        {data.profile.contactUrl ? (
          <a className="text-link" href={data.profile.contactUrl}>
            Get in touch <Arrow />
          </a>
        ) : (
          <a className="text-link" href="https://github.com/The-John-Man">
            Find me on GitHub <Arrow />
          </a>
        )}
        <a className="back-top" href="#main">
          Back to the start <Arrow back />
        </a>
      </section>
    </main>
  );
}
