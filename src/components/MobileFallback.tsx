"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function MobileFallback() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "#050505",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ fontSize: "64px", marginBottom: "1.5rem" }}>💻</div>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "1rem", letterSpacing: "-0.02em" }}>
          Desktop Experience Only
        </h2>
        <p style={{ color: "rgba(255, 255, 255, 0.6)", lineHeight: "1.6", maxWidth: "320px", fontSize: "15px" }}>
          This interface is designed as a desktop environment. Please open it on a PC, laptop, or a wider screen for the full experience.
        </p>
      </motion.div>
    </div>
  );
}
