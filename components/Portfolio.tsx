import { ArrowUpRight } from "lucide-react";
import GithubMark from "./icons/GithubMark";
import Hero from "./Hero";
import BuildIndex from "./BuildIndex";
import { githubProfile } from "@/data/projects";

export default function Portfolio() {
  return (
    <div className="page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <main id="main">
        <div className="page-frame">
          <Hero />
          <BuildIndex />
        </div>
      </main>

      <footer className="site-footer">
        <div className="page-frame site-footer-inner">
          <p className="footer-brand">
            <span className="brand-mark" aria-hidden="true">
              A<i>.</i>
            </span>
            <span>
              Ayan
              <em>Creative developer · India</em>
            </span>
          </p>
          <nav className="footer-nav" aria-label="Footer">
            <a href="#work">Work</a>
            <a href="#experiments">Experiments</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
          <p className="footer-meta">
            <span>© {new Date().getFullYear()} Ayan</span>
            <span className="footer-meta-sep" aria-hidden="true" />
            <span>Built with Next.js, Three.js &amp; GSAP</span>
            <a
              className="footer-github"
              href={githubProfile}
              target="_blank"
              rel="noreferrer"
              aria-label="Open Ayan's GitHub profile in a new tab"
            >
              <GithubMark size={14} />
              <span className="footer-github-text">GitHub</span>
              <ArrowUpRight size={12} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
