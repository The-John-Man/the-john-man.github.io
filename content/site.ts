// All the words on the site live here. Edit this file to change content;
// the page layout in app/page.tsx reads from it.
// Leave a link as "" to hide it.

export const profile = {
  name: "John Manuel",
  tagline:
    "I build software people can use with whatever they've got: a mouse you steer with your head, a hummed tune that turns into MIDI, a wiring diagram that remembers every change.",
  // TODO: replace with your own two or three sentences.
  about:
    "I'm a developer who likes building things that sit between software and the real world: hardware, health, sound, and accessibility. [Replace this with where you study or work, what kind of role you're looking for, and what you enjoy building.]",
  links: {
    github: "https://github.com/The-John-Man",
    linkedin: "", // e.g. "https://www.linkedin.com/in/your-name"
    email: "", // e.g. "you@example.com"
    resume: "", // e.g. "/resume.pdf" (put the file in public/)
  },
};

export const skills = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "HTML & CSS", "SQL"] },
  { group: "Frameworks", items: ["React", "Vite", "Tauri", "Flask", "Next.js"] },
  { group: "Also worked with", items: ["Web Audio", "OpenCV", "MediaPipe", "PostgreSQL", "Arduino"] },
];

export type Project = {
  name: string;
  summary: string;
  description: string;
  tech: string[];
  image?: { src: string; width: number; height: number; alt: string };
  // Shown instead of an image when there's no screenshot.
  gestures?: { action: string; result: string }[];
  links: { label: string; href: string }[];
  note?: string;
};

export const projects: Project[] = [
  {
    name: "WireTrace",
    summary: "Know exactly how your circuit is wired, and what changed.",
    description:
      "A Windows desktop app for Arduino builders. Lay out boards and parts on a virtual breadboard, click any pin to trace everything on its net, and save a checkpoint when the build works. Later, compare against that checkpoint to see which wires moved, then export matching pin definitions so your firmware and your hardware agree.",
    tech: ["TypeScript", "React", "Tauri", "SVG"],
    image: {
      src: "/projects/wiretrace.png",
      width: 1440,
      height: 900,
      alt: "WireTrace tracing the ground net of a servo across an Arduino Uno and a half-size breadboard, with every connected point outlined in orange.",
    },
    links: [],
    note: "Private beta. Demo available on request.",
  },
  {
    name: "Humline",
    summary: "Hum a melody. Edit it as notes. Export MIDI.",
    description:
      "A browser music studio. Record a hum, and pitch detection running in a Web Worker turns it into notes on a piano roll you can drag, resize and replay. Export a MIDI file when it sounds right. Accounts and a private melody library run on Clerk and PostgreSQL.",
    tech: ["TypeScript", "React", "Vite", "Web Audio", "PostgreSQL"],
    image: {
      src: "/projects/humline.png",
      width: 1440,
      height: 1239,
      alt: "Humline's studio: a recording panel on the left and a piano roll with five purple note blocks on the right.",
    },
    links: [
      { label: "Try the demo", href: "https://the-john-man.github.io/humline/" },
      { label: "View code", href: "https://github.com/The-John-Man/humline" },
    ],
  },
  {
    name: "HeadNav",
    summary: "Hands-free mouse control with just a webcam.",
    description:
      "Built for people with limited hand or arm mobility. HeadNav calibrates to each person's own range of head movement, then turns head turns into cursor motion, with a dead zone so the cursor rests when you do. It costs nothing beyond the laptop webcam you already have.",
    tech: ["Python", "OpenCV", "MediaPipe"],
    gestures: [
      { action: "Turn or tilt your head", result: "Cursor moves that way" },
      { action: "Rest in the middle", result: "Cursor stops" },
      { action: "Double nod", result: "Left click" },
      { action: "Hold mouth open", result: "Right click" },
    ],
    links: [{ label: "View code", href: "https://github.com/The-John-Man/FaceTracekr" }],
  },
];

// Projects you're still building. Move one into `projects` above when it ships.
export const inTheWorks = [
  {
    name: "Insulin Tracker",
    description:
      "Log meals and insulin doses in one place. Describe what you ate in plain words and an AI model estimates the carbs. Every number is labeled as an estimate, never a dose recommendation.",
    tech: ["Python", "Flask", "PostgreSQL", "LLM API"],
  },
];
