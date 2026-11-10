import data from "@/content/site";
import Intro from "./components/intro";
import { Arrow } from "./components/icons";
export default function Home() {
  return (
    <main id="main">
      <Intro />
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
