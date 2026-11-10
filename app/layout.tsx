import "./globals.css";
import data from "@/content/site";
export const metadata = {
  title: "John Manuel — Mechatronics",
  description:
    "Exploring the connections between mechanics, electronics and code.",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Must run before first paint: pagereveal fires before React hydrates. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `addEventListener("pagereveal",function(e){var o=sessionStorage.getItem("vt-origin"),d=document.documentElement;sessionStorage.removeItem("vt-origin");if(!o||!e.viewTransition||matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.dataset.reveal="";e.viewTransition.ready.then(function(){d.animate({clipPath:["circle(0 at "+o+")","circle(150vmax at "+o+")"]},{duration:750,easing:"cubic-bezier(.7,0,.2,1)",pseudoElement:"::view-transition-new(root)"})});e.viewTransition.finished.finally(function(){delete d.dataset.reveal})});`,
          }}
        />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header>
          <a className="wordmark" href="/">
            JOHN MANUEL <span className="dot" />
          </a>
          <nav aria-label="Chapters">
            <a href="/about">About</a>
            <a href="/experience">Experience</a>
            <a href="/projects">Projects</a>
            <a href="/goals">Goals</a>
            {data.profile.resumeUrl && (
              <a href={data.profile.resumeUrl}>Résumé</a>
            )}
          </nav>
        </header>
        {children}
        <footer>
          <a href="/">
            John Manuel <span className="dot" />
          </a>
          <span>Mechatronics · University of Waterloo</span>
          <small>Development preview · editorial draft</small>
        </footer>
      </body>
    </html>
  );
}
