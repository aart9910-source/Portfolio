# Ayan — Creative Developer Portfolio

A Next.js portfolio built around a cinematic charcoal / ivory / molten-orange art direction, a custom real-time GLSL orb, responsive project mockups, and GSAP scroll reveals.

## Stack

- Next.js App Router + TypeScript
- React Three Fiber + Three.js for the animated molten-glass hero orb
- Custom GLSL shader for fluid, ember-like surface patterns
- GSAP + ScrollTrigger for section entrances and hero parallax through scroll
- Custom CSS design system; no UI component framework

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

## Sections included

1. Cinematic hero with interactive 3D orb and three project panels
2. About and skills
3. Selected work
4. AI / creative experiments
5. Contact CTA
6. Footer

## Notes

- The project panels are art-directed HTML/CSS compositions rather than cross-origin iframes, keeping the hero fast and visually controlled.
- Project claims and links are intentionally conservative; replace or enrich them with confirmed details and real case studies as the portfolio evolves.
- The hero 3D scene is lazy-loaded client-side and has a CSS fallback. Motion is disabled or reduced when the visitor requests reduced motion.
