import data from "@/content/site";
import TitleBlock from "../components/title-block";
export const metadata = { title: "Experience — John Manuel" };
export default function Experience() {
  return (
    <main id="main">
      <section id="experience" className="chapter">
        <TitleBlock
          doc="Experience"
          status={data.profile.status}
          back="/#experience"
        />
        <div className="experience-grid">
          <h2>
            Learning by
            <br />
            showing up.
          </h2>
          <div className="experience">
            {data.experience
              .filter((e) => !e.open)
              .map((e, i) => (
              <details key={e.id ?? i} id={e.id ?? undefined} name="experience">
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
    </main>
  );
}
