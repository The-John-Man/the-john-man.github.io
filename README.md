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

The test runner starts a production server on port 3001. Tests cover the eight home blocks in order, header and rail navigation, DNP slots, the skills filter, project datasheet routes and 404s, the phone layout, reduced motion (no canvas), no-JavaScript reading, scene loading and reversible scroll stepping, the notebook, disclosures and the wiring demonstration.

## Content and publication

Edit `content/site.json`. The supplied draft is displayed for review. Every `null` value renders as a labelled DNP slot (an unpopulated footprint) saying what belongs there; fill the value and the slot becomes the real thing. Set `showEmptySlots` to `false` to hide all remaining slots. `content/site.ts` types editable slots as nullable strings. Do not replace missing facts with inferred accomplishments.

The app deliberately ships `noindex` metadata and an editorial-preview footer. Before a public release, approve the copy and project claims, supply authentic media and final destinations, then change those settings. This branch has not been deployed.

## Implementation

The home page is one circuit board. The HTML is complete on its own; the 3D board is an enhancement behind it.

- `app/page.tsx`, `app/home/`: the eight blocks (boot, origin, skills, experience, projects, beyond, goals, connect), the section rail and the `Slot` placeholder. `app/board.css` holds the board theme; the stacked layout is the default and the pinned, scroll-stepped layout applies on wide screens with motion allowed.
- `app/lib/scroll.ts`: one scroll listener. It writes `--p` and `data-current` for the HTML and a plain `scroll` object the camera reads.
- `app/scene/`: the react-three-fiber board. `map.ts` is the single source of truth for part positions, the signal route and the camera stops. Rendering is on demand (scroll, pointer, or an animation in progress), with no shadow maps and no post-processing.
- `app/lib/quality.ts`: `static` (reduced motion, save-data or no WebGL2: no canvas), `lite` (small or low-power devices) or `full`.
- Deep-dive pages (`/about`, `/experience`, `/projects`, `/projects/[slug]`, `/goals`) keep the ivory theme as datasheets, each with a title block linking back to its place on the board.

Not done yet: pre-rendered poster images for the static tier, pointer tilt on project plates, automatic quality drop on slow frames, and frame-rate measurement on John's laptop and phone. A project `model` (GLB) field exists in the content but nothing renders it yet.
