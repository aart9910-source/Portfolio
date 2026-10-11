import { ArrowUpRight } from "lucide-react";
import { githubProfile, getProject } from "@/data/projects";

/**
 * A deliberate, honest index of the sections that follow.
 *
 * The hero is the only finished section, so this band gives every navigation
 * anchor a real destination and points visitors at the work they can already
 * open — instead of pretending to be a finished portfolio.
 */
const rows = [
  {
    id: "about",
    index: "02",
    label: "About & skills",
    note: "The interests and tools behind the work. In progress.",
    status: "Writing",
    link: { label: "Repositories for now", href: githubProfile }
  },
  {
    id: "work",
    index: "03",
    label: "Selected work",
    note: "Case studies for the three projects staged in the hero.",
    status: "Next up",
    link: { label: "Open WebHorizn live", href: getProject("webhorizn").href }
  },
  {
    id: "experiments",
    index: "04",
    label: "AI & creative experiments",
    note: "Shaders, generative studies, and robotics prototypes.",
    status: "Building",
    link: { label: "Follow the builds", href: githubProfile }
  },
  {
    id: "contact",
    index: "05",
    label: "Contact",
    note: "A proper invitation to start a conversation.",
    status: "Open now",
    link: { label: "Reach me on GitHub", href: githubProfile }
  }
];

export default function BuildIndex() {
  return (
    <section className="index-band" id="index" aria-labelledby="index-title">
      <div className="index-band-head">
        <h2 className="index-band-title" id="index-title">
          Next in this build
        </h2>
        <p className="index-band-note">
          The hero is the first finished section. Everything below it is being written next — the
          work it references is already live and open.
        </p>
      </div>

      <ol className="index-list">
        {rows.map((row) => (
          <li className="index-row" id={row.id} key={row.id}>
            <span className="index-row-number">{row.index}</span>
            <div className="index-row-main">
              <h3 className="index-row-label">{row.label}</h3>
              <p className="index-row-note">{row.note}</p>
            </div>
            <span className="index-row-status">{row.status}</span>
            <a className="index-row-link" href={row.link.href} target="_blank" rel="noreferrer">
              {row.link.label}
              <ArrowUpRight size={13} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
