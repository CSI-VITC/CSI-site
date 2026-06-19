"use client";

import { FEATURED_PROJECT } from "@/data/platformContent";
import type { WindowId } from "@/components/nova/types";

interface ProjectSpotlightProps {
  onNavigate: (id: WindowId) => void;
  variant?: "featured" | "quiet";
}

export function ProjectSpotlight({ onNavigate, variant = "featured" }: ProjectSpotlightProps) {
  const p = FEATURED_PROJECT;
  const cardClass = `csi-platform-card${variant === "quiet" ? " csi-platform-card--quiet" : ""}`;

  return (
    <div className={cardClass}>
      <div className="csi-platform-card-label">Featured Project</div>
      <h3>{p.name}</h3>
      <p>{p.summary}</p>
      <div className="csi-platform-project-stack">
        {p.stack.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
      <button type="button" className="csi-platform-btn" onClick={() => onNavigate(p.windowId)}>
        Explore Projects
      </button>
    </div>
  );
}
