"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowDownRight, ArrowUpRight, Cpu, Github, Layers3, Menu, Orbit, Sparkles, X, Code2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const OrbCanvas = dynamic(() => import("./OrbCanvas"), {
  ssr: false,
  loading: () => <div className="orb-fallback" aria-hidden="true" />
});

const GITHUB = "https://github.com/aart9910-source";
const WEBHORIZN = "https://webhorizn.vercel.app/";
const API_TOOL = "https://github.com/okojiayan/Api-Key-Tester";

function Header() {
  const [open, setOpen] = useState(false);
  const links = [{ label: "Work", href: "#work" }, { label: "AI experiments", href: "#experiments" }, { label: "About", href: "#about" }, { label: "Let’s talk", href: "#contact" }];
  return <header className="site-header" id="top">
    <a className="brand" href="#top" aria-label="Ayan home"><span className="brand-glyph">A<span>.</span></span></a>
    <div className="header-rule" aria-hidden="true" />
    <nav className="desktop-nav" aria-label="Main navigation">{links.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}</nav>
    <a className="availability" href="#contact"><i />Available for interesting projects</a>
    <a className="header-round-link" href={GITHUB} target="_blank" rel="noreferrer" aria-label="Open GitHub profile"><ArrowUpRight size={22} /></a>
    <button className="menu-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    {open && <nav className="mobile-nav" aria-label="Mobile navigation">{links.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}<ArrowUpRight size={16} /></a>)}</nav>}
  </header>;
}

function ProjectMock({ type }: { type: "web" | "ai" | "robot" }) {
  if (type === "web") return <div className="mock-scene mock-web">
    <div className="mock-nav"><span>W<span className="orange">.</span></span><span>STRATEGY · DESIGN · DEVELOPMENT</span><ArrowUpRight size={12}/></div>
    <div className="mock-web-body"><div><small>INDEPENDENT DIGITAL STUDIO</small><strong>Modern<br/>solutions for<br/><em>real impact.</em></strong><i>Explore our approach ↗</i></div><div className="mock-building"><i/><i/><i/><i/><i/><i/></div></div>
  </div>;
  if (type === "ai") return <div className="mock-scene mock-ai">
    <div className="mock-nav"><span>API / HEALTH</span><span>PROVIDER DIAGNOSTICS</span><span className="mini-status">● READY</span></div>
    <div className="mock-ai-heading">Your AI stack,<br/><em>under control.</em></div>
    {["OpenAI · key format detected","Anthropic · endpoint ready","Google AI · configuration"].map((v, i) => <div className="mock-provider" key={v}><span className={"provider-dot p" + i}/><span>{v}</span><b>{i === 2 ? "CHECK" : "READY"}</b></div>)}
  </div>;
  return <div className="mock-scene mock-robot">
    <div className="robot-stars"/><div className="robot-ground"/>
    <svg className="rover-svg" viewBox="0 0 360 210" role="img" aria-label="Stylised experimental four-wheel rover">
      <defs><linearGradient id="shell" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffbd7a"/><stop offset=".45" stopColor="#df681b"/><stop offset="1" stopColor="#302217"/></linearGradient></defs>
      <g stroke="#ad8c6e" strokeWidth="7" strokeLinecap="round" fill="none"><path d="M95 120 74 150 58 158M130 125 121 155 108 162M235 120 251 149 267 156M267 118 294 144 310 151"/></g>
      <g fill="#171411" stroke="#77634e" strokeWidth="5"><circle cx="72" cy="159" r="23"/><circle cx="116" cy="164" r="20"/><circle cx="264" cy="157" r="23"/><circle cx="306" cy="151" r="19"/></g>
      <g fill="#ff7525"><circle cx="72" cy="159" r="6"/><circle cx="116" cy="164" r="5"/><circle cx="264" cy="157" r="6"/><circle cx="306" cy="151" r="5"/></g>
      <path d="M70 117 113 83 230 79 278 109 242 138 109 141Z" fill="url(#shell)" stroke="#ffbc7f" strokeWidth="1.5"/><path d="M113 83 143 51 213 49 230 79Z" fill="#b7a087" stroke="#f4cf9f" strokeWidth="1.4"/><path d="M143 51 160 31 203 31 213 49Z" fill="#221c16" stroke="#d4a375"/><path d="M164 31 167 14 195 14 203 31Z" fill="#11100f" stroke="#ff873b"/><rect x="173" y="19" width="17" height="7" rx="2" fill="#ff6513"/><path d="M124 91 151 63 194 63 214 91 181 109Z" fill="#11100e" stroke="#745137"/><circle cx="244" cy="96" r="5" fill="#ff6a19"/><circle cx="244" cy="96" r="11" fill="none" stroke="#ff6a19" strokeOpacity=".4"/>
    </svg>
    <span className="robot-label">ARDUINO · MOTION · HARDWARE</span>
  </div>;
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.fromTo(".hero-reveal", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.12 });
      gsap.fromTo(".project-float", { y: 24, opacity: 0, filter: "blur(7px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.15, stagger: 0.16, delay: 0.45, ease: "power3.out" });
      gsap.to(".hero-orbit-one", { rotate: 20, scale: 1.05, scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 } });
      gsap.to(".hero-orb", { yPercent: 12, scale: 0.91, scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1.2 } });
      gsap.to(".hero-projects", { yPercent: -6, scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1.1 } });
    }, heroRef);
    return () => ctx.revert();
  }, []);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      stage.style.setProperty("--px", (x * 20).toFixed(1) + "px");
      stage.style.setProperty("--py", (y * 16).toFixed(1) + "px");
      stage.style.setProperty("--rx", (y * -2.2).toFixed(1) + "deg");
      stage.style.setProperty("--ry", (x * 3.2).toFixed(1) + "deg");
    };
    const reset = () => { stage.style.setProperty("--px", "0px"); stage.style.setProperty("--py", "0px"); stage.style.setProperty("--rx", "0deg"); stage.style.setProperty("--ry", "0deg"); };
    stage.addEventListener("pointermove", move, { passive: true }); stage.addEventListener("pointerleave", reset, { passive: true });
    return () => { stage.removeEventListener("pointermove", move); stage.removeEventListener("pointerleave", reset); };
  }, []);
  return <section className="hero" id="hero" ref={heroRef}>
    <div className="hero-copy">
      <div className="hero-kicker hero-reveal"><span>[ 01 ]</span><i/>STUDENT DEVELOPER<br/>AI BUILDER / CREATIVE THINKER</div>
      <h1 className="hero-title hero-reveal">Creative<br/>developer<br/><em>building</em><br/>what’s next.</h1>
      <p className="hero-description hero-reveal">I design and build digital experiences, experiment with AI, and turn curious ideas into real things.</p>
      <div className="hero-actions hero-reveal"><a className="button button-primary" href="#work">View my work <ArrowUpRight size={15}/></a><a className="scroll-cue" href="#about"><span><ArrowDown size={15}/></span>Scroll to explore</a></div>
      <div className="hero-bottom hero-reveal"><div><small>BASED IN INDIA</small><span>Building from Bihar</span><span>Open to meaningful collaborations</span></div><div><small>FOCUS AREAS</small><div className="pills"><i>Web development</i><i>AI applications</i><i>Robotics</i><i>Creative tech</i></div></div></div>
    </div>
    <div className="hero-stage" ref={stageRef} aria-label="Interactive portfolio artwork">
      <div className="stage-grid"/><div className="stage-glow stage-glow-a"/><div className="stage-glow stage-glow-b"/>
      <div className="hero-orbit hero-orbit-one"/><div className="hero-orbit hero-orbit-two"/><div className="hero-orbit hero-orbit-three"/>
      <span className="cross cross-a">+</span><span className="cross cross-b">+</span><span className="cross cross-c">+</span>
      <div className="hero-orb"><OrbCanvas/></div>
      <div className="hero-projects">
        <a className="project-float project-web" href={WEBHORIZN} target="_blank" rel="noreferrer" aria-label="Open WebHorizn website"><div className="mock-top"><span>WEBHORIZN</span><span>WEB / 01</span></div><ProjectMock type="web"/><div className="mock-caption"><strong>WebHorizn</strong><span>Co-building a web agency ↗</span></div></a>
        <a className="project-float project-ai" href={API_TOOL} target="_blank" rel="noreferrer" aria-label="Open API Key Health Doctor source"><div className="mock-top"><span>API KEY HEALTH DOCTOR</span><span>TOOL / 02</span></div><ProjectMock type="ai"/><div className="mock-caption"><strong>AI developer tools</strong><span>Source code ↗</span></div></a>
        <a className="project-float project-rover" href={GITHUB} target="_blank" rel="noreferrer" aria-label="Explore robotics projects"><div className="mock-top"><span>ROBOTICS LAB</span><span>HARDWARE / 03</span></div><ProjectMock type="robot"/><div className="mock-caption"><strong>Robotics</strong><span>Hardware experiments ↗</span></div></a>
      </div>
      <div className="stage-side-label side-web"><b>01</b><span>WEB PROJECTS</span></div><div className="stage-side-label side-ai"><b>02</b><span>AI EXPERIMENTS</span></div><div className="stage-side-label side-robot"><b>03</b><span>ROBOTICS</span></div>
      <div className="stage-base-note"><span className="base-note-orb"/> IDEAS <b>→</b> PROTOTYPES <b>→</b> REAL THINGS</div>
    </div>
    <a className="hero-index" href="#about"><span>01</span><span>CREATIVE DEVELOPER</span><ArrowDownRight size={15}/></a>
  </section>;
}

function SectionHeading({ n, label, title, italic, desc }: { n: string; label: string; title: string; italic?: string; desc: string }) {
  return <div className="section-heading"><div className="section-index">{n}<span>{label}</span></div><div className="section-head-main"><h2>{title} {italic && <em>{italic}</em>}</h2><p>{desc}</p></div></div>;
}

function About() {
  return <section className="content-section about-section" id="about">
    <SectionHeading n="02" label="A LITTLE ABOUT ME" title="Curiosity meets" italic="execution." desc="A developer’s mindset, a builder’s instinct, and a soft spot for ideas that shouldn’t stay ideas."/>
    <div className="about-grid reveal-on-scroll"><div className="about-statement"><small>THE WAY I WORK</small><p>I like the space where <em>design, code, and intelligence</em> meet.</p><div className="about-orbit"><Orbit size={62}/></div></div><div className="about-copy"><p>I’m Ayan, a student developer from India. I build web experiences, explore practical AI, and tinker with robotics and hardware.</p><p>I care about the details people feel: a clear idea, a fast interface, an interaction that makes sense, and a project that works beyond the demo.</p><a className="text-link" href={GITHUB} target="_blank" rel="noreferrer">Explore what I’m building <ArrowUpRight size={16}/></a></div></div>
    <div className="skills-strip reveal-on-scroll"><div className="skills-lead"><small>CURRENT TOOLBOX</small><span>A practical mix of software and hardware.</span></div><div className="skill"><Code2/><b>Web development</b><small>Interfaces · web apps</small></div><div className="skill"><Sparkles/><b>AI applications</b><small>LLMs · experiments</small></div><div className="skill"><Cpu/><b>Robotics</b><small>Embedded · hardware</small></div><div className="skill"><Layers3/><b>Creative tech</b><small>Prototypes · systems</small></div></div>
  </section>;
}

function Visual({ type }: { type: "web" | "ai" | "robot" }) {
  if (type === "web") return <div className="work-visual work-visual-web"><div className="visual-nav"><span>W / H</span><span>GOOD IDEAS, BUILT BETTER</span><span>↗</span></div><div className="visual-web-main"><small>INDEPENDENT DIGITAL AGENCY</small><strong>Make it<br/>mean <em>something.</em></strong><div className="architecture"><i/><i/><i/><i/></div><span>DESIGN → DEVELOP → SHIP</span></div></div>;
  if (type === "ai") return <div className="work-visual work-visual-ai"><div className="visual-nav"><span>API / HEALTH</span><span>MODEL LAB</span></div><div className="ai-visual-title">Intelligence<br/>made <em>useful.</em></div>{["OpenAI · response check","Anthropic · key detected","Google AI · endpoint"].map((x, i) => <div className="ai-visual-row" key={x}><i className={"provider-dot p" + i}/>{x}<b>{i === 2 ? "CHECK" : "READY"}</b></div>)}</div>;
  return <div className="work-visual work-visual-robot"><div className="visual-grid"/><ProjectMock type="robot"/><span className="coord-label">FIELD UNIT / 004</span></div>;
}

function Work() {
  const projects = [
    { id: "01", tag: "WEB DEVELOPMENT", title: "WebHorizn", desc: "A digital agency direction focused on useful, high-quality web experiences.", type: "web" as const, href: WEBHORIZN, action: "Visit live site" },
    { id: "02", tag: "AI / DEVELOPER TOOLING", title: "API Key Health Doctor", desc: "A developer tool experiment for checking AI provider API configurations.", type: "ai" as const, href: API_TOOL, action: "View source" },
    { id: "03", tag: "ROBOTICS / HARDWARE", title: "Robotics Lab", desc: "Learning by building: motor control, embedded systems, and physical prototypes.", type: "robot" as const, href: GITHUB, action: "Explore builds" }
  ];
  return <section className="content-section work-section" id="work">
    <SectionHeading n="03" label="SELECTED WORK" title="Less talk." italic="Real projects." desc="A selection of work and explorations across the digital and physical worlds."/>
    <div className="work-grid reveal-on-scroll">{projects.map(p => <article className="work-card" key={p.id}><a className="work-visual-link" href={p.href} target="_blank" rel="noreferrer" aria-label={p.action + ": " + p.title}><Visual type={p.type}/><span className="visual-open"><ArrowUpRight size={18}/></span></a><div className="work-meta"><span>{p.tag}</span><span>{p.id}</span></div><h3>{p.title}</h3><p>{p.desc}</p><a className="text-link" href={p.href} target="_blank" rel="noreferrer">{p.action}<ArrowUpRight size={15}/></a></article>)}</div>
    <div className="work-footer"><span>More experiments are always in progress.</span><a className="button button-outline" href={GITHUB} target="_blank" rel="noreferrer">Browse GitHub <ArrowUpRight size={15}/></a></div>
  </section>;
}

function Experiments() {
  const items = [
    { n: "01", title: "Generative imagery", desc: "Custom visuals, AI-assisted workflows, and art direction.", cls: "exp-image" },
    { n: "02", title: "Creative coding", desc: "Motion studies, shaders, and interaction ideas.", cls: "exp-code" },
    { n: "03", title: "Model experiments", desc: "Language models, prompts, and practical AI systems.", cls: "exp-model" },
    { n: "04", title: "Hardware meets software", desc: "Prototypes that move beyond the browser.", cls: "exp-hardware" }
  ];
  return <section className="content-section experiments-section" id="experiments"><SectionHeading n="04" label="THE PLAYGROUND" title="Serious about" italic="curiosity." desc="Not every idea needs to become a product. Some need room to get weird first."/><div className="experiments-grid reveal-on-scroll">{items.map(it => <article className={"experiment-card " + it.cls} key={it.n}><div className="experiment-art"><span>{it.n}</span>{it.cls === "exp-image" && <div className="glass-flower"><i/></div>}{it.cls === "exp-code" && <div className="code-orbit"><i/><i/><i/></div>}{it.cls === "exp-model" && <div className="model-window"><small>MODEL / PLAYGROUND</small><i/><i/><i/><b>→</b></div>}{it.cls === "exp-hardware" && <div className="hardware-rings"><i/><i/><i/></div>}</div><div className="experiment-copy"><small>EXPERIMENT / {it.n}</small><h3>{it.title}</h3><p>{it.desc}</p></div></article>)}</div></section>;
}

function Contact() {
  return <section className="contact-section" id="contact"><div className="contact-topline"><span>05 / HAVE SOMETHING IN MIND?</span><span>MY INBOX IS OPEN <i/></span></div><div className="contact-main"><h2>Let’s build<br/><em>something</em><br/>that matters.</h2><div className="contact-aside"><p>Have a project, a curious idea, or just want to talk about what’s possible? I’m always glad to hear about interesting things people are making.</p><a className="button button-primary" href={GITHUB} target="_blank" rel="noreferrer">Start a conversation <ArrowUpRight size={16}/></a><span>Find me on GitHub for now.</span></div></div><div className="contact-bottom"><span>IDEAS → PROTOTYPES → REAL THINGS</span><a href="#top">Back to top <ArrowUpRight size={14}/></a></div></section>;
}

function Footer() {
  return <footer className="site-footer"><a className="footer-brand" href="#top"><span className="brand-glyph">A<span>.</span></span><span>Ayan<br/><small>Creative developer</small></span></a><nav className="footer-nav"><a href="#work">Work</a><a href="#experiments">Experiments</a><a href="#about">About</a><a href="#contact">Contact</a></nav><div className="footer-right"><a href={GITHUB} target="_blank" rel="noreferrer" aria-label="GitHub profile"><Github size={17}/></a><span>© {new Date().getFullYear()} Ayan. Built with curiosity.</span></div></footer>;
}

export default function Portfolio() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-on-scroll").forEach((el) => {
        gsap.fromTo(el, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 86%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".work-card, .experiment-card").forEach((el, i) => {
        gsap.fromTo(el, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.72, delay: (i % 4) * 0.08, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });
    });
    return () => ctx.revert();
  }, []);
  return <><a className="skip-link" href="#main">Skip to content</a><div className="page-frame"><Header/><main id="main"><Hero/><div className="section-divider"><span>SCROLL TO DISCOVER</span><i/><ArrowDown size={14}/></div><About/><Work/><Experiments/><Contact/></main><Footer/></div></>;
}
