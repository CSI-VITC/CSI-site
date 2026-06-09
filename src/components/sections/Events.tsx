"use client";

import React from "react";
import { motion } from "framer-motion";

export function Events() {
  const images = [
    { src: "/images/hackathon1.jpg", area: "1 / 1 / 3 / 2" },
    { src: "/images/grp-photo.jpg", area: "1 / 2 / 2 / 3" },
    { src: "/images/workshop1.jpg", area: "1 / 3 / 2 / 4" },
    { src: "/images/Hackathon2.jpg", area: "1 / 4 / 2 / 5" },
    { src: "/images/workshop2.jpg", area: "2 / 2 / 3 / 4" },
    { src: "/images/Computer1.jpg", area: "2 / 4 / 3 / 5" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", background: "transparent", padding: "16px", boxSizing: "border-box" }}>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1.2fr 2fr 1fr 1fr", 
        gridTemplateRows: "1fr 1fr", 
        gap: "12px", 
        width: "100%", 
        height: "100%" 
      }}>
        {images.map((img, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 0.98 }}
            style={{ 
              gridArea: img.area,
              borderRadius: "20px",
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              boxShadow: "0 0 15px rgba(16, 185, 129, 0.05)"
            }}
          >
            <img 
              src={img.src} 
              alt="Event" 
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
