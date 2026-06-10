"use client";

import type { CSSProperties } from "react";

interface TrafficLightsProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  variant?: "window" | "nova";
  isExpanded?: boolean;
}

export default function TrafficLights({
  onClose,
  onMinimize,
  onMaximize,
  variant = "window",
  isExpanded = false,
}: TrafficLightsProps) {
  if (variant === "nova") {
    return (
      <div className="nova-traffic-lights">
        <button
          type="button"
          className="nova-traffic-light nova-traffic-light--close"
          onClick={onClose}
          aria-label="Close"
          title="Close"
        />
        <button
          type="button"
          className="nova-traffic-light nova-traffic-light--minimize"
          onClick={onMaximize}
          aria-label="Expand"
          title="Expand panel"
        />
        <button
          type="button"
          className="nova-traffic-light nova-traffic-light--maximize"
          onClick={onMinimize}
          aria-label="Minimize"
          title="Minimize to dock"
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close window"
        title="Close"
        style={dotStyle("#ff5f56")}
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMaximize();
        }}
        aria-label={isExpanded ? "Exit expanded view" : "Expand window"}
        title={isExpanded ? "Exit expanded view" : "Expand"}
        style={{
          ...dotStyle("#ffbd2e"),
          boxShadow: isExpanded
            ? "0 0 0 1px rgba(0, 0, 0, 0.35), inset 0 0 0 1px rgba(255, 255, 255, 0.35)"
            : "0 0 0 1px rgba(0, 0, 0, 0.35)",
        }}
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMinimize();
        }}
        aria-label="Minimize window"
        title="Minimize to Dock"
        style={dotStyle("#27c93f")}
      />
    </div>
  );
}

function dotStyle(color: string): CSSProperties {
  return {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: color,
    border: "none",
    cursor: "pointer",
    padding: 0,
    flexShrink: 0,
    display: "block",
    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.35)",
  };
}
