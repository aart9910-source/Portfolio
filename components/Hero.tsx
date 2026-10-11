"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowDownRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "./Header";
import ProjectPreview from "./ProjectPreview";
import { getProject, heroPreviewOrder } from "@/data/projects";
import {
  clearPointer,
  hasPrecisePointer,
  isReducedMotion,
  supportsWebGL,
  writePointer
} from "@/lib/pointer";

gsap.registerPlugin(ScrollTrigger);

const OrbCanvas = dynamic(() => import("./OrbCanvas"), { ssr: false });

const maxShift = { x: 46, y: 34 };

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const orbHostRef = useRef<HTMLDivElement>(null);
  const [orbReady, setOrbReady] = useState(false);

  /**
   * Mount WebGL only once the stage is close to the viewport and the hero copy
   * has had a chance to paint, so the first meaningful render never waits on it.
   */
  useEffect(() => {
    const host = orbHostRef.current;
    if (!host || !supportsWebGL()) return;
    // Skip the GPU entirely when the visitor asked for reduced motion; the
    // styled fallback keeps the hero complete.
    if (isReducedMotion()) return;

    let timer = 0;

    // Environments without IntersectionObserver (older browsers, test runners)
    // get the canvas straight away rather than an empty stage.
    if (typeof IntersectionObserver === "undefined") {
      timer = window.setTimeout(() => setOrbReady(true), 260);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        timer = window.setTimeout(() => setOrbReady(true), 220);
      },
      { rootMargin: "280px 0px" }
    );
    observer.observe(host);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  /** Entrance choreography — restrained, and skipped for reduced motion. */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .from(".hero-kicker", { y: 16, opacity: 0, duration: 0.7 }, 0.05)
        .from(
          ".hero-line-inner",
          { yPercent: 112, duration: 1.05, stagger: 0.075, ease: "expo.out" },
          0.12
        )
        .from(".hero-lede", { y: 18, opacity: 0, duration: 0.75, clearProps: "transform" }, 0.55)
        .from(
          ".hero-actions > *",
          { y: 16, opacity: 0, duration: 0.7, stagger: 0.08, clearProps: "transform" },
          0.66
        )
        .from(".hero-meta", { y: 18, opacity: 0, duration: 0.8 }, 0.78)
        // Opacity only: the scrub tweens below own these elements' transforms.
        .from(".hero-ring", { opacity: 0, duration: 1.3, stagger: 0.12, ease: "power2.out" }, 0.3)
        .from(".hero-orb", { opacity: 0, duration: 1.5, ease: "power2.out" }, 0.45)
        .from(
          ".preview-link",
          {
            opacity: 0,
            y: 34,
            scale: 0.965,
            filter: "blur(6px)",
            duration: 1.15,
            stagger: 0.14,
            ease: "power3.out",
            clearProps: "transform,filter"
          },
          0.62
        )
        .from(".stage-note", { opacity: 0, duration: 0.9 }, 1.1);

      // Scroll: the composition recedes and rotates as the story moves on.
      const scrollTrigger = {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 0.9
      } as const;

      gsap.to(".hero-orb", {
        yPercent: 14,
        scale: 0.92,
        ease: "none",
        scrollTrigger
      });
      gsap.to(".hero-ring--1", { rotate: 14, scale: 1.08, ease: "none", scrollTrigger });
      gsap.to(".hero-ring--2", { rotate: -10, scale: 1.04, ease: "none", scrollTrigger });
      gsap.to(".hero-ring--3", { rotate: 9, scale: 1.06, ease: "none", scrollTrigger });
      gsap.to(".hero-previews", { yPercent: -7, ease: "none", scrollTrigger });
      gsap.to(".hero-copy", { y: -26, opacity: 0.55, ease: "none", scrollTrigger });
    }, hero);

    // Fonts settle after first paint; keep scroll positions honest.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  /**
   * Pointer parallax. One rAF loop writes custom properties on the stage; every
   * layer reads them with its own depth multiplier, and the WebGL layer reads
   * the same store, so all depth planes move together.
   */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (isReducedMotion() || !hasPrecisePointer()) return;

    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const nx = Math.min(0.5, Math.max(-0.5, (event.clientX - rect.left) / rect.width - 0.5));
      const ny = Math.min(0.5, Math.max(-0.5, (event.clientY - rect.top) / rect.height - 0.5));
      target.x = nx;
      target.y = ny;
      writePointer(nx, ny);
    };

    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      clearPointer();
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.075;
      current.y += (target.y - current.y) * 0.075;
      stage.style.setProperty("--px", `${(current.x * maxShift.x).toFixed(2)}px`);
      stage.style.setProperty("--py", `${(current.y * maxShift.y).toFixed(2)}px`);
      stage.style.setProperty("--tilt-x", `${(-current.y * 2.2).toFixed(3)}deg`);
      stage.style.setProperty("--tilt-y", `${(current.x * 3).toFixed(3)}deg`);
      frame = window.requestAnimationFrame(tick);
    };

    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave, { passive: true });
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      clearPointer();
    };
  }, []);

  return (
    <>
      <Header />
      <section className="hero" id="hero" ref={heroRef} aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-kicker">
            <span className="hero-kicker-index">[ 01 ]</span>
            <span className="hero-kicker-text">
              Student developer
              <br />
              Web · AI · Robotics
            </span>
          </p>

          <h1 className="hero-title" id="hero-title">
            <span className="hero-line">
              <span className="hero-line-inner">Creative</span>
            </span>
            <span className="hero-line">
              <span className="hero-line-inner">developer</span>
            </span>
            <span className="hero-line">
              <span className="hero-line-inner hero-line-inner--accent">
                <em>building</em>
              </span>
            </span>
            <span className="hero-line">
              <span className="hero-line-inner">what&rsquo;s next.</span>
            </span>
          </h1>

          <p className="hero-lede">
            I&rsquo;m Ayan. I design and build digital experiences, experiment with AI, and turn
            curious ideas into real things.
          </p>

          <div className="hero-actions">
            <a className="button button--primary" href="#work">
              View my work
              <ArrowUpRight size={15} strokeWidth={1.9} aria-hidden="true" />
            </a>
            <a className="scroll-cue" href="#index">
              <span className="scroll-cue-icon" aria-hidden="true">
                <ArrowDown size={14} strokeWidth={1.8} />
              </span>
              Scroll to explore
            </a>
          </div>

          <dl className="hero-meta">
            <div className="hero-meta-block">
              <dt>Based in</dt>
              <dd>Katihar, Bihar · India</dd>
            </div>
            <div className="hero-meta-block hero-meta-block--focus">
              <dt>Focus</dt>
              <dd>
                <ul className="hero-tags">
                  <li>Web development</li>
                  <li>AI applications</li>
                  <li>Robotics</li>
                  <li>Creative technology</li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <div className="hero-stage" ref={stageRef}>
          <div className="stage-field" aria-hidden="true">
            <span className="stage-grid" />
            <span className="stage-aura stage-aura--core" />
            <span className="stage-aura stage-aura--floor" />

            <span className="hero-ring hero-ring--1">
              <span className="hero-ring-inner hero-ring-inner--1" />
            </span>
            <span className="hero-ring hero-ring--2">
              <span className="hero-ring-inner hero-ring-inner--2" />
            </span>

            <span className="hero-orb" ref={orbHostRef}>
              <span className="hero-orb-parallax" data-ready={orbReady}>
                <span className="hero-orb-fallback" />
                {orbReady ? <OrbCanvas /> : null}
              </span>
            </span>

            <span className="hero-ring hero-ring--3">
              <span className="hero-ring-inner hero-ring-inner--3" />
            </span>

            <span className="stage-marks">
              <i className="stage-mark stage-mark--a">+</i>
              <i className="stage-mark stage-mark--b">+</i>
              <i className="stage-mark stage-mark--c">+</i>
              <i className="stage-mark-axis" />
            </span>

            <span className="stage-label stage-label--orb">
              <b>FIG. 01</b>
              Molten core · real-time WebGL
            </span>
          </div>

          <ul className="hero-previews" aria-label="Selected project previews">
            {heroPreviewOrder.map((id, order) => {
              const project = getProject(id);
              return (
                <li className={`hero-preview hero-preview--${id}`} key={project.id} data-order={order}>
                  <div className="hero-preview-parallax">
                    <ProjectPreview project={project} />
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="stage-note" aria-hidden="true">
            <span className="stage-note-orb" />
            Ideas <b>→</b> Prototypes <b>→</b> Real things
          </p>
        </div>

        <a className="hero-next" href="#index">
          <span className="hero-next-index">01</span>
          <span className="hero-next-label">Creative developer</span>
          <ArrowDownRight size={15} strokeWidth={1.7} aria-hidden="true" />
        </a>
      </section>
    </>
  );
}
