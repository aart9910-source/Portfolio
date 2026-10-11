# Ayan — Creative Developer Portfolio

A cinematic, editorial portfolio for **Ayan**, a student developer from India working across web
development, AI applications, robotics, and creative technology.

The rebuild is being delivered **section by section**. This branch contains the first finished
milestone: the **hero** (with navigation, and an honest index of the sections still to come).

---

## What is in this milestone

### Navigation (`components/Header.tsx`)

- `A.` monogram with a small identity lockup, a hairline rule, and a compact primary nav.
- Work · AI experiments · About · **Let’s talk** (with arrow), an availability indicator, and a
  circular GitHub link.
- Mobile panel that opens, closes on Escape, closes when a link is followed, traps nothing, and is
  `inert` while hidden so it stays out of the tab order.

### Hero (`components/Hero.tsx`)

- **Headline** — “Creative developer _building_ what’s next.” in Instrument Serif, with `building`
  italic and molten orange. Each line sits in its own overflow mask for the entrance.
- **Lede** — one sentence, no biography padding.
- **Actions** — `View my work` (primary, orange) and `Scroll to explore` (quieter scroll cue).
- **Metadata** — based in Katihar, Bihar · India; focus areas as tagged items. No invented
  experience, clients, or metrics anywhere.
- **Stage** — the sculptural centrepiece, orbital rings, a masked technical grid, crosshair marks,
  a figure label, and three floating project previews.

### The molten centrepiece (`components/MoltenOrb.tsx`, `components/OrbCanvas.tsx`)

A real-time WebGL sphere with a custom GLSL material (`components/MoltenOrb.tsx`):

- Four signed-noise fields (domain-warped fbm, cheap fbm, and ridged noise) build convection bands,
  thin incandescent fissures, and cold crust patches.
- The surface shades itself with a key / fill / rim rig, a tight specular lobe, fresnel, and
  self-illumination so the hot regions light their own surfaces. Roughly a third of the sphere stays
  near-black so the molten areas read as glowing *through* crust.
- Two orbital rings (one passing in front of the sphere), plus an additive rim halo.
- Ambient drift uses two incommensurate frequencies so it never visibly loops.

**Performance and failure modes**

- The canvas is dynamically imported (`next/dynamic`, client only), mounted after the copy paints
  and only when the stage is near the viewport — the first page render never waits on the GPU.
- DPR is capped at `1.75`; no post-processing, no extra point lights, no textures.
- WebGL unavailable → a layered CSS orb keeps the composition intact.
- `prefers-reduced-motion: reduce` → the canvas is not created at all and the scene holds its
  composed state.

### Floating project previews (`components/ProjectPreview.tsx`, `data/projects.ts`)

Panels are built from **verified** projects only:

| Panel | What it is | Destination |
| --- | --- | --- |
| WebHorizn | Live studio site (co-built; parts used AI-assisted tooling) | [webhorizn.vercel.app](https://webhorizn.vercel.app/) |
| API Key Health Doctor | Open-source (MIT) developer-tooling prototype, 18+ providers | [live demo](https://api-key-tester-three.vercel.app/) · [source](https://github.com/okojiayan/Api-Key-Tester) |
| NutraPop | Front-end storefront demo for a makhana brand (no payments wired up) | [source](https://github.com/aart9910-source/Nutrapop) |

Each panel is a deliberately art-directed reconstruction of that project’s own interface, using its
real palette, real copy, and — for WebHorizn and NutraPop — artwork taken from the project’s own
repository (`public/images/`). No cross-origin iframes, no stock imagery, no invented client work.
Every panel is a single keyboard- and touch-friendly link.

### Motion

- Entrance (`GSAP`): masked headline lines, then lede, actions, metadata, rings, orb, and panels —
  opacity-only for scrubbed layers so hover styles never fight the timeline; `clearProps` hands
  transforms back to CSS where hover owns them.
- Scroll (`ScrollTrigger`, scrubbed): the orb recedes, the rings rotate, the preview cluster lifts,
  and the copy drifts faintly. Native scrolling is preserved — nothing is pinned or hijacked.
- Pointer: one rAF loop writes damped custom properties (`--px`, `--py`, `--tilt-x/y`); each layer
  reads them with its own depth factor, and the orb reads the same store inside its own render loop.
  Disabled entirely on coarse pointers and for reduced motion.

---

## Verification performed

Every item below was executed in this environment:

| Check | Result |
| --- | --- |
| `tsc --noEmit` | clean |
| `eslint .` | clean (flat config, `eslint-config-next` v16) |
| `next build` (production, Turbopack) | passes; `/` and `/icon.svg` statically prerendered |
| Initial payload | 8 chunks ≈ 227 KB gzip total JS + 29 KB CSS + 7 KB HTML |
| Three.js isolation | the 901 KB three/r3f chunk is **not** referenced by the initial HTML |
| SSR audit (curl) | 4 masked headline lines, 3 rings, 3 preview links, 4 index rows, 1 `<dl>`, 0 iframes, 0 remote font requests, every `#anchor` resolves to a real id |
| Font loading | self-hosted woff2 only (Instrument Serif 400 + italic, DM Sans variable, DM Mono 400/500) |
| GLSL validity | all four shaders parsed with a GLSL parser (only three.js’s own `#include` chunks and built-ins unresolved, as expected) |
| Material review | the fragment shader was ported line-for-line to JS and ray-sphere rendered on the CPU across three moments — this drove four material iterations (see “Material study” below) |
| Client behaviour (jsdom harness, 19 checks) | hydration without mismatches; entrance runs and settles; menu opens/closes via click, Escape and link follow; `inert` toggling; parallax writes bounded damped values; no-WebGL path; reduced-motion path (no canvas, no transforms, no pointer writes) |
| Panel/orb collision maths | computed at 1728×1080, 1440×900, 1280×800, 834×1112, 430×844 and 390×844 — no panel covers the orb; the floating overlap on desktop is its rim only; mobile panels clear the orb and the section rule |
| Horizontal overflow | `overflow-x: clip` on `html`/`body` plus a computed audit of every edge-anchored layer at each breakpoint |

### Known limitation: no browser screenshot in this sandbox

A headless Chromium build was assembled and *runs* here, but its DevTools endpoint (HTTP and pipe)
never answers in this restricted sandbox, so automated screenshots were impossible. Visual review
therefore combined:

1. the CPU material render described above (`orb-material.png`), which evaluates the exact shipped
   shader maths, and
2. arithmetic layout audits at five breakpoints.

**Please review the live preview** — the composition, typography and material still deserve your
eyes, and I will tune anything that reads wrong.

---

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Three.js + React Three Fiber · GSAP + ScrollTrigger
· Lucide (interface icons; the GitHub brand mark is inlined in `components/icons/GithubMark.tsx`)
· custom CSS with a token-based design system (`app/globals.css`). No CSS framework, no animation
library beyond GSAP.

Self-hosted typography via `@fontsource` — no remote font requests.

## Structure

```
app/
  layout.tsx          metadata, viewport, font imports
  page.tsx            renders <Portfolio />
  globals.css         design tokens, layout, hero composition, responsive, motion
components/
  Portfolio.tsx       page shell: skip link, hero, index band, footer
  Header.tsx          navigation + mobile panel
  Hero.tsx            hero composition, entrance/scroll/pointer choreography
  OrbCanvas.tsx       lazily mounted R3F canvas
  MoltenOrb.tsx       the orb model + GLSL material
  ProjectPreview.tsx  the three floating panels
  BuildIndex.tsx      honest index of the sections still to come
  icons/GithubMark.tsx
data/projects.ts      verified project data (links, status, contribution)
lib/pointer.ts        shared pointer store + capability guards
public/images/        project artwork taken from the projects' own repositories
```

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
npm run typecheck
```

`vercel.json` pins `"framework": "nextjs"` and nothing else, so Vercel uses its own build command
and output directory detection — the `public/` folder is **not** used as an output directory.

## Next stages

Hero → **About & skills** → **Selected work** (case studies) → **AI & creative experiments** →
**Contact** → **Footer**. Until each one lands, the hero’s index band links its anchors to real,
open destinations rather than to placeholder sections.

Nothing here should be treated as finished client work: WebHorizn was built with the WebHorizn team,
API Key Health Doctor is an open-source prototype, and NutraPop is a front-end demo.
