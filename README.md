# John Manuel · Circuit portfolio

A Next.js 15 / React 19 portfolio built from the supplied Circuit-Portfolio handoff. Development happens on `website-rebuild`; main retains the original site.

## Local development

Use Node 20.9+ (validated with Node 24) and npm:

```sh
npm ci
npm run dev
```

Production validation: `npm run lint && npm run build`, then `npm start`. No external fonts, API keys, databases or downloaded models are needed. All graphics are original procedural illustrations. The handoff reference PNGs are intentionally outside the production bundle.

## Browser tests

```sh
npx playwright install chromium
npm run build
npm test
```

With an existing system Chromium, use `CHROMIUM_PATH=/usr/bin/chromium npm test`. The test runner starts a production server on port 3001 (or reuses an existing local instance). Tests cover notebook keyboard interaction, disclosures, project navigation and return focus, direct project routes and 404s, the wiring demonstration, mobile snapping, reduced motion, canvas failure, no-JavaScript navigation, and reverse scrolling.

## Content and publication

Edit `content/site.json`. The supplied draft is displayed for review. Null dates, roles, personal actions, results, résumé and contact remain unfilled. `content/site.ts` types editable slots as nullable strings. Do not replace missing facts with inferred accomplishments.

The app deliberately ships `noindex` metadata and an editorial-preview footer. Before a public release, approve the copy and project claims, supply authentic media and final destinations, then change those settings. This branch has not been deployed.

## Implementation

- `app/components/intro.tsx`: world-space board projection, arched jumper, arc-length signal travel and scroll-driven camera; draws only on resize/scroll while visible. Pixel ratio is capped at 1.5. No WebGL dependency; static SVG remains if canvas or JavaScript is unavailable.
- `app/components/notebook.tsx`: keyboard-operated Sketch/Build/Test tabs. Current illustrations and blank test record are explicitly not project evidence.
- `app/gallery.tsx`: CSS perspective turntable; keyboard/buttons/drag on desktop, native scroll snapping on phones. Selection persists per browser tab, Back restores focus, reduced motion exposes a plain project selector.
- `app/projects/[slug]/page.tsx`: four statically generated case-study routes; missing evidence fields remain blank. Native cross-document view transitions enhance supported browsers.
- `app/components/net-demo.tsx`: illustrative wiring explanation. This is not a reproduction or screenshot of WireTrace.
- `app/components/wave.tsx`: pointer-responsive decorative control surface; no continuous render loop.

The opening uses a compact procedural scene rather than a photorealistic authored GLB. Final media and real-device testing on John's laptop/phone remain release work; browser emulation does not substitute for those devices.
