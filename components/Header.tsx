"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import GithubMark from "./icons/GithubMark";
import { githubProfile } from "@/data/projects";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "AI experiments", href: "#experiments" },
  { label: "About", href: "#about" }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the mobile panel on Escape and return focus to the trigger.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // A resize past the breakpoint should never leave a stale open panel behind.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 981px)");
    const onChange = () => setOpen(false);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand" href="#hero" aria-label="Ayan — back to the top of the page">
          <span className="brand-mark" aria-hidden="true">
            A<i>.</i>
          </span>
          <span className="brand-meta" aria-hidden="true">
            Ayan
            <em>Creative developer</em>
          </span>
        </a>

        <span className="header-rule" aria-hidden="true" />

        <nav className="header-nav" aria-label="Primary">
          {navItems.map((item) => (
            <a key={item.href} className="header-nav-link" href={item.href}>
              {item.label}
            </a>
          ))}
          <a className="header-nav-link header-nav-link--cta" href="#contact">
            Let&rsquo;s talk
            <ArrowUpRight size={13} strokeWidth={1.75} aria-hidden="true" />
          </a>
        </nav>

        <p className="header-status">
          <span className="header-status-dot" aria-hidden="true" />
          Open to collaborations
        </p>

        <a
          className="header-round"
          href={githubProfile}
          target="_blank"
          rel="noreferrer"
          aria-label="Open Ayan's GitHub profile in a new tab"
        >
          <GithubMark size={16} />
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X size={17} strokeWidth={1.6} aria-hidden="true" />
          ) : (
            <Menu size={17} strokeWidth={1.6} aria-hidden="true" />
          )}
        </button>
      </div>

      <div
        id="mobile-nav"
        ref={panelRef}
        className="mobile-nav"
        data-open={open}
        inert={!open}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
              <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)}>
            Let&rsquo;s talk
            <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
          </a>
        </nav>
        <div className="mobile-nav-foot">
          <p>
            <span className="header-status-dot" aria-hidden="true" />
            Open to collaborations
          </p>
          <a href={githubProfile} target="_blank" rel="noreferrer">
            <GithubMark size={14} />
            github.com/aart9910-source
            <ArrowUpRight size={13} strokeWidth={1.6} aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
