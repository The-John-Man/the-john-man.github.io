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
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header>
          <a className="wordmark" href="/">
            JOHN MANUEL <span className="dot" />
          </a>
          <nav aria-label="Chapters">
            <a href="/#about">About</a>
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
        </footer>
      </body>
    </html>
  );
}
