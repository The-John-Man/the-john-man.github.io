import DrawingBoard from "./components/drawing-board";
import Rail from "./home/rail";
import Stage from "./home/stage";
import Skills from "./home/skills";
import {
  Beyond,
  Boot,
  Connect,
  Experience,
  Goals,
  Origin,
  Projects,
} from "./home/sections";
export default function Home() {
  return (
    <main id="main" className="board">
      <Stage />
      <Rail />
      <Boot />
      <Origin />
      <Skills />
      <DrawingBoard />
      <Experience />
      <Projects />
      <Beyond />
      <Goals />
      <Connect />
    </main>
  );
}
