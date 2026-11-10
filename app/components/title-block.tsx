import { Arrow } from "./icons";
// The strip at the top of every datasheet page, like the title block on an engineering drawing.
export default function TitleBlock({
  doc,
  status,
  back,
  backLabel = "Back to the board",
}: {
  doc: string;
  status: string;
  back: string;
  backLabel?: string;
}) {
  return (
    <div className="title-block">
      <a href={back}>
        <Arrow back /> {backLabel}
      </a>
      <p>
        <small>Document</small>
        {doc}
      </p>
      <p>
        <small>Status</small>
        {status}
      </p>
    </div>
  );
}
