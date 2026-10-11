import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";

/**
 * A floating hero panel.
 *
 * Each variant is a small, art-directed reconstruction of the project's own
 * interface — built from the real product's palette, typography and copy, with
 * artwork taken from the project's own repository. Nothing here is a stock
 * mockup and nothing is presented as a screenshot of finished client work.
 */
export default function ProjectPreview({ project }: { project: Project }) {
  return (
    <div className={`preview preview--${project.id}`}>
      <a
        className="preview-link"
        href={project.href}
        target="_blank"
        rel="noreferrer"
        aria-label={project.cta}
      >
        <span className="preview-chrome">
          <span className="preview-name">{project.name}</span>
          <span className="preview-index">{project.index}</span>
        </span>

        {project.id === "webhorizn" && <WebHoriznFrame />}
        {project.id === "api-health" && <DeveloperToolFrame />}
        {project.id === "nutrapop" && <BrandFrame />}

        <span className="preview-caption">
          <span className="preview-caption-name">{project.category}</span>
          <span className="preview-caption-action">
            {project.statusLabel}
            <ArrowUpRight size={12} strokeWidth={1.75} aria-hidden="true" />
          </span>
        </span>
      </a>
    </div>
  );
}

/** WebHorizn — cream editorial studio site with an orange accent. */
function WebHoriznFrame() {
  return (
    <span className="frame frame--webhorizn">
      <span className="wh-topbar">
        <Image
          className="wh-mark"
          src="/images/webhorizn-mark.webp"
          alt=""
          width={128}
          height={60}
          aria-hidden="true"
        />
        <span className="wh-nav">
          <i />
          <i />
          <i />
        </span>
        <span className="wh-cta">Get a free audit</span>
      </span>

      <span className="wh-hero">
        <span className="wh-copy">
          <span className="wh-eyebrow">Web development · Digital marketing</span>
          <span className="wh-headline">
            Websites and ads that bring you <em>real customers.</em>
          </span>
          <span className="wh-actions">
            <i className="wh-btn wh-btn--solid">Get a free audit</i>
            <i className="wh-btn">Chat on WhatsApp</i>
          </span>
        </span>
        <span className="wh-diagram" aria-hidden="true">
          <i className="wh-node wh-node--click">Ad click</i>
          <i className="wh-link" />
          <i className="wh-node wh-node--enquiry">Enquiry</i>
        </span>
      </span>

      <span className="wh-strip">
        <i>Clear scope. Clear price.</i>
        <i>Reply within 2 hours</i>
        <i>Website packages from ₹8,999</i>
      </span>
    </span>
  );
}

/** API Key Health Doctor — dark developer tooling UI with indigo accents. */
function DeveloperToolFrame() {
  return (
    <span className="frame frame--tool">
      <span className="tool-topbar">
        <i className="tool-dot" />
        <i className="tool-dot" />
        <i className="tool-dot" />
        <em>api-key-health</em>
        <b>prototype</b>
      </span>

      <span className="tool-body">
        <span className="tool-heading">Is your API key working?</span>
        <span className="tool-tabs">
          <i className="tool-tab tool-tab--active">Single key</i>
          <i className="tool-tab">Batch</i>
          <i className="tool-tab">Custom</i>
        </span>
        <span className="tool-field">
          <i className="tool-field-value">sk-ant-api03-••••••••••••••</i>
          <b className="tool-run">Test</b>
        </span>
        <span className="tool-result">
          <span className="tool-result-head">
            <b>Anthropic Claude</b>
            <i>401 · unauthorized</i>
          </span>
          <span className="tool-result-body">
            The key format is valid, but the provider rejected it. It may have been
            revoked, or copied with a missing character.
          </span>
          <span className="tool-result-steps">
            <i>Create a fresh key in the console</i>
            <i>Check for trailing spaces</i>
          </span>
        </span>
      </span>
    </span>
  );
}

/** NutraPop — brand storefront panel built around the product artwork. */
function BrandFrame() {
  return (
    <span className="frame frame--brand">
      <Image
        className="brand-shot"
        src="/images/nutrapop-makhana.webp"
        alt="NutraPop packaging and a bowl of roasted makhana"
        width={900}
        height={675}
        sizes="(max-width: 760px) 62vw, 300px"
      />
      <span className="brand-overlay">
        <span className="brand-plate">
          <small>Roasted makhana · Katihar</small>
          <b>Pink Himalayan</b>
        </span>
        <span className="brand-tags">
          <i>Frontend demo</i>
          <i>App Router</i>
        </span>
      </span>
    </span>
  );
}
