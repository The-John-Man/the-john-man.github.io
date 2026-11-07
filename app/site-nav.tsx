import { profile } from "@/content/site";

// Plain <a> links on purpose: full page loads let the browser run the
// 3D page-flip view transition in globals.css. next/link would skip it.
export const pages = [
  { href: "/projects", label: "Projects", color: "var(--wire-orange)" },
  { href: "/experience", label: "Experience", color: "var(--wire-blue)" },
  { href: "/interests", label: "Interests", color: "var(--wire-red)" },
];

export function SiteNav({ current }: { current: string }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a href="/" className="home-link">{profile.name}</a>
        <nav aria-label="Pages">
          <ul>
            {pages.map((p) => (
              <li key={p.href}>
                <a href={p.href} aria-current={p.href === current ? "page" : undefined} style={{ "--pin": p.color } as React.CSSProperties}>
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

// "Next page" link at the bottom of each page, looping back home at the end.
export function NextPage({ current }: { current: string }) {
  const i = pages.findIndex((p) => p.href === current);
  const next = pages[i + 1] ?? { href: "/", label: "Back to the start", color: "var(--wire-yellow)" };
  return (
    <div className="section">
      <a className="next-page" href={next.href} style={{ "--pin": next.color } as React.CSSProperties}>
        <span>Next</span>
        <strong>{next.label}</strong>
      </a>
    </div>
  );
}
