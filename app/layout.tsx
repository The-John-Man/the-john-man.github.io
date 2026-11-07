import type { Metadata } from "next";
import { Schibsted_Grotesk, JetBrains_Mono } from "next/font/google";
import { profile } from "@/content/site";
import "./globals.css";

const sans = Schibsted_Grotesk({ variable: "--font-sans", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["500"] });

export const metadata: Metadata = {
  title: `${profile.name}, developer`,
  description: profile.tagline,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { links } = profile;
  const contact = [
    { label: "GitHub", href: links.github },
    { label: "LinkedIn", href: links.linkedin },
    { label: "Email", href: links.email && `mailto:${links.email}` },
    { label: "Resume", href: links.resume },
  ].filter((l) => l.href);

  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable}`}>
        {children}
        <footer id="contact" className="footer">
          <h2>Get in touch</h2>
          <p className="links big">
            {contact.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
          </p>
          <p className="fine">Built by {profile.name} with Next.js.</p>
        </footer>
      </body>
    </html>
  );
}
