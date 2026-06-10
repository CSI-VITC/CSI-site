"use client";

import { useState, type ReactNode } from "react";
import { useAdminA11y } from "./AdminA11yContext";

interface AemTooltipProps {
  label: string;
  children: ReactNode;
  description?: string;
  shortcut?: string;
}

export function AemTooltip({ label, children, description, shortcut }: AemTooltipProps) {
  const [visible, setVisible] = useState(false);
  const id = `tip-${label.replace(/\s/g, "-").toLowerCase()}`;

  return (
    <span
      className="aem-tooltip-wrap"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <span aria-describedby={visible ? id : undefined}>{children}</span>
      {visible && (
        <span id={id} role="tooltip" className="aem-tooltip">
          {label}
          {description && <span className="aem-tooltip-desc">{description}</span>}
          {shortcut && <kbd className="aem-kbd" style={{ marginLeft: 6 }}>{shortcut}</kbd>}
        </span>
      )}
    </span>
  );
}

export interface AemToastData {
  message: string;
  type?: "success" | "error" | "info";
  action?: { label: string; onClick: () => void };
}

export function AemToastBar({ toast, onDismiss }: { toast: AemToastData | null; onDismiss: () => void }) {
  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`aem-toast aem-toast--${toast.type ?? "success"}`}
    >
      <span>{toast.message}</span>
      {toast.action && (
        <button type="button" className="aem-toast-action" onClick={toast.action.onClick}>
          {toast.action.label}
        </button>
      )}
      <button type="button" className="aem-toast-dismiss" onClick={onDismiss} aria-label="Dismiss notification">
        ×
      </button>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function AemEmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="aem-empty-state" role="status">
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <button type="button" className="aem-btn aem-btn--primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}

export function AccessibilityToolbar() {
  const { highContrast, reducedMotion, textScale, toggleHighContrast, toggleReducedMotion, setTextScale } =
    useAdminA11y();

  return (
    <div className="aem-a11y-toolbar" role="region" aria-label="Accessibility settings">
      <button
        type="button"
        className={`aem-a11y-btn${highContrast ? " aem-a11y-btn--active" : ""}`}
        onClick={toggleHighContrast}
        aria-pressed={highContrast}
        title="Toggle high contrast"
      >
        Contrast
      </button>
      <button
        type="button"
        className={`aem-a11y-btn${reducedMotion ? " aem-a11y-btn--active" : ""}`}
        onClick={toggleReducedMotion}
        aria-pressed={reducedMotion}
        title="Toggle reduced motion"
      >
        Motion
      </button>
      <label className="aem-a11y-scale">
        <span className="sr-only">Text size</span>
        <select
          value={textScale}
          onChange={(e) => setTextScale(Number(e.target.value))}
          aria-label="Adjust text size"
        >
          <option value={100}>100%</option>
          <option value={110}>110%</option>
          <option value={125}>125%</option>
          <option value={150}>150%</option>
        </select>
      </label>
    </div>
  );
}
