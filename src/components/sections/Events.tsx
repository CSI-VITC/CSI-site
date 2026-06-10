"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { EVENT_STORIES } from "@/data/interactionContent";

export function Events() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", background: "#0a0a0a", padding: "16px", boxSizing: "border-box" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 2fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "12px",
          width: "100%",
          height: "100%",
        }}
      >
        {EVENT_STORIES.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.45, ease: "easeOut" }}
            whileHover={{ scale: 0.985 }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              gridArea: img.area,
              borderRadius: "20px",
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
              border: "1px solid rgba(240, 235, 225, 0.1)",
            }}
          >
            <img
              src={img.src}
              alt={img.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <motion.div
              initial={false}
              animate={{ opacity: hoveredIndex === i ? 1 : 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "18px 20px",
                pointerEvents: "none",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: "#F0EBE1", marginBottom: 4 }}>
                {img.title}
              </div>
              <div style={{ fontSize: 12, color: "rgba(240,235,225,0.65)", lineHeight: 1.45 }}>
                {img.story}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
