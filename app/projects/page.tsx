import Gallery from "../gallery";
import { Arrow } from "../components/icons";
export const metadata = { title: "Projects — John Manuel" };
export default function Projects() {
  return (
    <main id="main">
      <section id="projects" className="chapter projects-chapter">
        <a className="text-link board-back" href="/#board">
          <Arrow back /> Back to the board
        </a>
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
    </main>
  );
}
