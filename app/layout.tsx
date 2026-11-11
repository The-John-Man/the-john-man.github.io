import "./globals.css";
import "./board.css";
import { Archivo, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import data from "@/content/site";
const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
});
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});
export const metadata = {
  title: "John Manuel — Mechatronics",
  description:
    "Exploring the connections between mechanics, electronics and code.",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Must run before first paint: pagereveal fires before React hydrates. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("scrub");addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[href^=\\"/\\"]");if(a)sessionStorage.setItem("vt-origin",e.clientX+"px "+e.clientY+"px")});addEventListener("pagereveal",function(e){var o=sessionStorage.getItem("vt-origin"),d=document.documentElement;sessionStorage.removeItem("vt-origin");if(!o||!e.viewTransition||matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.dataset.reveal="";e.viewTransition.ready.then(function(){d.animate({clipPath:["circle(0 at "+o+")","circle(150vmax at "+o+")"]},{duration:750,easing:"cubic-bezier(.7,0,.2,1)",pseudoElement:"::view-transition-new(root)"})});e.viewTransition.finished.finally(function(){delete d.dataset.reveal})});`,
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
          <nav aria-label="Main">
            <a href="/#origin">Origin</a>
            <a href="/#experience">Experience</a>
            <a href="/#projects">Projects</a>
            <a href="/#goals">Goals</a>
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
          <p className="colophon">
            Built with Next.js. The home page is a 3D circuit board rendered
            with React Three Fiber, and it falls back to the page itself when
            motion is reduced.{" "}
            <a href="https://github.com/The-John-Man/the-john-man.github.io">
              Source
            </a>
            .
          </p>
        </footer>
      </body>
    </html>
  );
}
