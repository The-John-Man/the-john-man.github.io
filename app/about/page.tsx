import data from "@/content/site";
import Notebook from "../components/notebook";
import { Arrow } from "../components/icons";
export const metadata = { title: "About — John Manuel" };
export default function About() {
  return (
    <main id="main">
      <section id="about" className="chapter">
        <a className="text-link board-back" href="/#board">
          <Arrow back /> Back to the board
        </a>
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
            <a className="text-link" href="/experience">
              Keep following <Arrow />
            </a>
          </div>
          <Notebook />
        </div>
      </section>
    </main>
  );
}
