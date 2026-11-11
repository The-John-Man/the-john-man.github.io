import Image from "next/image";
import data from "@/content/site";
import Slot from "../home/slot";

export default function DrawingBoard() {
  return (
    <section id="drawing-board" className="drawing-board">
      <h2>Drawing board.</h2>
      <p>{data.drawingBoard.intro}</p>
      <ul className="shots">
        {data.drawingBoard.shots.map((shot) => (
          <li key={shot.src}>
            <Image
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              sizes="(max-width: 700px) 100vw, 30vw"
              style={{ width: "100%", height: "auto" }}
            />
            <span className="mono">{shot.caption}</span>
          </li>
        ))}
        <li>
          {/* TODO: scanned orthographic drawings, after the course allows posting graded work. */}
          <Slot value={null} prompt="TODO: hand-drawn orthographic views" ratio="4 / 3" />
        </li>
      </ul>
    </section>
  );
}
