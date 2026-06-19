"use client";

import { FOOTER_LINKS } from "@/data/platformContent";
import type { WindowId } from "@/components/nova/types";

interface SiteFooterProps {
  activeWindow: WindowId | null;
  onNavigate: (id: WindowId) => void;
}

export function SiteFooter({ activeWindow, onNavigate }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="csi-site-footer" role="contentinfo">
      <div>
        <strong style={{ color: "rgba(240,235,225,0.65)" }}>CSI VIT Chennai</strong>
        <span style={{ margin: "0 10px", opacity: 0.25 }}>·</span>
        <span>© {year}</span>
      </div>
      <nav className="csi-site-footer-nav" aria-label="Footer navigation">
        {FOOTER_LINKS.map((link) => (
          <button
            key={link.windowId}
            type="button"
            aria-current={activeWindow === link.windowId ? "page" : undefined}
            onClick={() => onNavigate(link.windowId)}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </footer>
  );
}
