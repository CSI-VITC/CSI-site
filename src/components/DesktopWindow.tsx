"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { X, Minus, Maximize2 } from "lucide-react";

interface DesktopWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  isActive: boolean;
  onFocus: () => void;
  defaultPosition?: { x: number; y: number };
}

export default function DesktopWindow({
  id,
  title,
  children,
  onClose,
  isActive,
  onFocus,
  defaultPosition = { x: 50, y: 50 },
}: DesktopWindowProps) {
  const constraintsRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ 
        opacity: isActive ? 1 : 0, 
        scale: isActive ? 1 : 0.98,
        y: isActive ? 0 : 10,
        pointerEvents: isActive ? "auto" : "none"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      onMouseDown={onFocus}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: isActive ? 110 : 10,
        display: "flex",
        flexDirection: "column",
        borderRadius: 0,
        overflow: "hidden",
      }}
      className="glass-panel"
    >
      {/* Title Bar */}
      <div
        className="window-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 20px",
          background: "rgba(255, 255, 255, 0.05)",
          borderBottom: "1px solid var(--color-border-tertiary)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "16px",
            display: "flex",
            gap: "8px",
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            style={{
              width: "12px", height: "12px", borderRadius: "50%",
              background: "#ff5f56", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          />
          <button
            style={{
              width: "12px", height: "12px", borderRadius: "50%",
              background: "#ffbd2e", border: "none", cursor: "pointer"
            }}
          />
          <button
            style={{
              width: "12px", height: "12px", borderRadius: "50%",
              background: "#27c93f", border: "none", cursor: "pointer"
            }}
          />
        </div>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-primary)", letterSpacing: "0.5px" }}>
          {title}
        </div>
      </div>

      {/* Content Area */}
      <div
        style={{
          padding: 0,
          overflowY: "auto",
          flex: 1,
          background: "rgba(5, 5, 5, 0.95)",
          display: "flex",
          justifyContent: "center",
        }}
        className="window-content"
      >
        <div style={{ width: "100%", height: "100%" }}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}
