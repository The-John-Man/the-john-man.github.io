import data from "@/content/site";

export default function HackathonBadges() {
  return (
    <ul className="badges">
      {data.beyond.events.map((ev) => {
        const body = (
          <>
            <span className="mono">{ev.when}</span>
            <strong>{ev.name}</strong>
            <span className="dim">{ev.built ?? ev.note ?? "After the event"}</span>
          </>
        );
        return (
          <li key={ev.name}>
            {ev.href ? <a href={ev.href}>{body}</a> : <div>{body}</div>}
          </li>
        );
      })}
    </ul>
  );
}
