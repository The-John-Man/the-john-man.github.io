import data from "@/content/site";
// An empty content slot, drawn like an unpopulated ("DNP") footprint on a board.
// Fill the matching value in content/site.json and the slot becomes the real thing.
export default function Slot({
  value,
  prompt,
  ratio,
  children,
}: {
  value: unknown;
  prompt: string;
  ratio?: string;
  children?: React.ReactNode;
}) {
  if (value) return <>{children}</>;
  if (!data.showEmptySlots) return null;
  return (
    <div
      className={ratio ? "slot" : "slot slot-line"}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <span className="slot-tag">DNP</span>
      <span>{prompt}</span>
    </div>
  );
}
