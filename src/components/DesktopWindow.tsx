"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";

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
        y: isActive ? [0, -8, 0] : 10
      }}
      transition={{
        opacity: { type: "spring", stiffness: 300, damping: 28 },
        scale: { type: "spring", stiffness: 300, damping: 28 },
        y: isActive ? {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 3,
          ease: "easeInOut"
        } : { type: "spring", stiffness: 300, damping: 28 }
      }}
      onMouseDown={onFocus}
      style={{
        position: "fixed",
        top: "6vh",
        left: "6vw",
        width: "88vw",
        height: "76vh",
        zIndex: isActive ? 110 : 10,
        display: "flex",
        flexDirection: "column",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 30px 70px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.15)",
        border: "1px solid rgba(16, 185, 129, 0.4)",
        background: "rgba(6, 26, 21, 0.85)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        pointerEvents: isActive ? "auto" : "none"
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
          padding: "14px 20px",
          background: "rgba(16, 185, 129, 0.08)",
          borderBottom: "1px solid rgba(16, 185, 129, 0.25)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "20px",
            display: "flex",
            gap: "8px",
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            style={{
              width: "12px", height: "12px", borderRadius: "50%",
              background: "#ff5f56", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 8px rgba(255, 95, 86, 0.6)"
            }}
            aria-label="Close"
          />
          <button
            style={{
              width: "12px", height: "12px", borderRadius: "50%",
              background: "#ffbd2e", border: "none", cursor: "pointer",
              boxShadow: "0 0 8px rgba(255, 189, 46, 0.6)"
            }}
            aria-label="Minimize"
          />
          <button
            style={{
              width: "12px", height: "12px", borderRadius: "50%",
              background: "#27c93f", border: "none", cursor: "pointer",
              boxShadow: "0 0 8px rgba(39, 201, 63, 0.6)"
            }}
            aria-label="Maximize"
          />
        </div>
        <div style={{ fontSize: "14px", fontWeight: 600, color: "#f0fdf4", letterSpacing: "1px", textShadow: "0 0 10px rgba(16, 185, 129, 0.4)" }}>
          {title}
        </div>
      </div>

      {/* Content Area */}
      <div
        style={{
          padding: 0,
          overflowY: "auto",
          flex: 1,
          background: "rgba(3, 15, 12, 0.65)",
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
