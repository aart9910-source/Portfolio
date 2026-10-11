/**
 * Verified project data.
 *
 * Everything here was checked against Ayan's public repositories and the live
 * deployments at the time of writing. No invented clients, metrics, or results
 * are stored here — new projects should be added only after their links and
 * status have been confirmed.
 *
 * Verified sources:
 *  - https://github.com/aart9910-source/WebHorizn        → https://webhorizn.vercel.app/
 *  - https://github.com/okojiayan/Api-Key-Tester         → https://api-key-tester-three.vercel.app/  (MIT)
 *  - https://github.com/aart9910-source/Nutrapop         → https://nutrapop.vercel.app/
 */

export type ProjectStatus = "live" | "prototype" | "demo";

export type Project = {
  /** Stable key, also used as the CSS modifier. */
  id: "webhorizn" | "api-health" | "nutrapop";
  index: string;
  name: string;
  /** Short category, shown in the panel chrome. */
  category: string;
  /** One sentence describing what it is. */
  summary: string;
  /** Ayan's contribution, stated plainly. */
  contribution: string;
  status: ProjectStatus;
  statusLabel: string;
  /** Primary destination for the panel link. */
  href: string;
  cta: string;
  /** Additional verified links, used by the work section. */
  links: { label: string; href: string }[];
  /** Honest note about collaborators or tooling, where it applies. */
  note?: string;
};

export const projects: Project[] = [
  {
    id: "webhorizn",
    index: "01",
    name: "WebHorizn",
    category: "Web studio site",
    summary:
      "A live studio site for a small web and digital-marketing practice in India — enquiry-led structure, package pricing, and case-study framing.",
    contribution:
      "Front-end build and art direction: layout system, responsive behaviour, typography, and the conversion-focused enquiry flow.",
    status: "live",
    statusLabel: "Live site",
    href: "https://webhorizn.vercel.app/",
    cta: "Open the live WebHorizn site in a new tab",
    links: [
      { label: "Live site", href: "https://webhorizn.vercel.app/" },
      { label: "Repository", href: "https://github.com/aart9910-source/WebHorizn" },
    ],
    note: "Built with the WebHorizn team; parts of the implementation used AI-assisted tooling."
  },
  {
    id: "api-health",
    index: "02",
    name: "API Key Health Doctor",
    category: "AI developer tool",
    summary:
      "A diagnostic tool that tests API keys against 18+ providers and translates cryptic 401s, 429s, and quota errors into plain-English explanations.",
    contribution:
      "Product thinking and development on the provider catalogue, in-memory key testing, and the human-readable error translation.",
    status: "prototype",
    statusLabel: "Live prototype",
    href: "https://api-key-tester-three.vercel.app/",
    cta: "Open the live API Key Health Doctor tool in a new tab",
    links: [
      { label: "Live demo", href: "https://api-key-tester-three.vercel.app/" },
      { label: "Source (MIT)", href: "https://github.com/okojiayan/Api-Key-Tester" },
    ],
    note: "Open-source (MIT) developer tooling prototype."
  },
  {
    id: "nutrapop",
    index: "03",
    name: "NutraPop",
    category: "Brand storefront",
    summary:
      "A full storefront front end for a roasted-makhana snack brand: catalogue, product pages, cart, and a three-step demo checkout.",
    contribution:
      "Next.js App Router build — routing, product data model, cart state, and the responsive visual system.",
    status: "demo",
    statusLabel: "Front-end demo",
    href: "https://github.com/aart9910-source/Nutrapop",
    cta: "Open the NutraPop repository in a new tab",
    links: [
      { label: "Repository", href: "https://github.com/aart9910-source/Nutrapop" },
      { label: "Live demo", href: "https://nutrapop.vercel.app/" },
    ],
    note: "Front-end demo — no payments or backend are wired up."
  }
];

export const githubProfile = "https://github.com/aart9910-source";

export function getProject(id: Project["id"]): Project {
  const project = projects.find((item) => item.id === id);
  if (!project) throw new Error(`Unknown project: ${id}`);
  return project;
}

/** The three panels staged inside the hero scene, front-to-back. */
export const heroPreviewOrder: Project["id"][] = ["webhorizn", "api-health", "nutrapop"];
