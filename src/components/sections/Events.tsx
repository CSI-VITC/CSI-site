"use client";

import React from "react";
import { motion } from "framer-motion";

export function Events() {
  const images = [
    { 
      src: "/images/csi_genesis_26_editorial_poster.png", 
      name: "Genesis",
      url: "https://genesis.csivitc.com",
      area: "1 / 1 / 3 / 5" 
    },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", background: "#0a0a0a", padding: "16px", boxSizing: "border-box" }}>
      <div style={{ 
        width: "100%", 
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        {images.map((img, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
            whileHover="hover"
            onClick={() => window.open(img.url, "_blank")}
            style={{ 
              width: "100%",
              maxWidth: "500px", // Constrain poster width
              aspectRatio: "3/4", // typical poster ratio
              borderRadius: "20px",
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
              border: "1px solid rgba(240, 235, 225, 0.1)"
            }}
          >
            <img 
              src={img.src} 
              alt={img.name} 
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", background: "#000" }} 
            />
            <motion.div
              variants={{ hover: { opacity: 1 } }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.6)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backdropFilter: "blur(4px)",
              }}
            >
              <h3 style={{ 
                color: "#fff", 
                fontSize: "24px", 
                fontWeight: "bold", 
                letterSpacing: "2px",
                fontFamily: "var(--font-inter), sans-serif"
              }}>
                {img.name}
              </h3>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
