# Ayan — personal portfolio

A responsive, project-led portfolio for Ayan, a student developer from India.

## Layout

- Short hero with one primary action and a GitHub link
- Selected projects: WebHorizn and NutraPop
- Compact experiment list with statuses and public source links where available
- Short About section and simple Contact area
- Dark warm-neutral palette with one orange accent and two type families
- Responsive navigation, visible keyboard focus, reduced-motion support, and subtle reveal transitions

## Selected work

**WebHorizn** — website for the web and digital-marketing agency Ayan co-founded. The portfolio embeds a non-interactive view of the live website as a real preview, with a direct link to open it and a link to its source repository.

**NutraPop** — frontend storefront demo with flavour pages, product variants, a cart, and a demo checkout. Backend, payment processing, and a database are not connected in this release.

Smaller work is listed in the Experiments section with status text and source links only where a public repository exists.

## Visual assets and remaining content

The WebHorizn preview is rendered live from its public site, with official brand artwork as a fallback. NutraPop uses an existing product photograph from its public repository. The page does not use a third-party website screenshot service.

Personal photo, Doctor Robot build photo/video, exact Doctor Robot working/not-yet-working details, and a real screenshot of the completed portfolio were not supplied. Those assets and outcome details have not been invented. Because there is no screenshot of the finished portfolio yet, no Open Graph screenshot image is configured.

The two project images currently load from their original public URLs rather than local files under `public/`.

## Live site

https://ayan-portfolio-lab.vercel.app/

## Run locally

Open `index.html` in a browser or serve this directory with any static file server. No build step is needed.

## Files

- `index.html` — content, links, embed preview, and metadata
- `styles.css` — responsive layout and visual styling
- `app.js` — accessible mobile navigation, scroll progress, and subtle reveal transitions
- `favicon.svg` — browser icon

Automatic redeployments from Git pushes are not connected to Vercel at this time; production is published from a source snapshot.
