"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EventImage {
  src: string;
  area: string;
  name: string;
  date: string;
  desc: string;
}

const images: EventImage[] = [
  {
    src: "/images/hackathon1.jpg",
    area: "1 / 1 / 3 / 2",
    name: "HackNight 4.0",
    date: "March 2025",
    desc: "24-hour hackathon. 38 teams. One night of zero sleep and pure building.",
  },
  {
    src: "/images/grp-photo.jpg",
    area: "1 / 2 / 2 / 3",
    name: "Induction Day",
    date: "August 2024",
    desc: "Welcoming the newest batch of builders into the CSI family.",
  },
  {
    src: "/images/workshop1.jpg",
    area: "1 / 3 / 2 / 4",
    name: "RAG & LLMs Workshop",
    date: "February 2025",
    desc: "Hands-on session on building retrieval-augmented generation pipelines from scratch.",
  },
  {
    src: "/images/Hackathon2.jpg",
    area: "1 / 4 / 2 / 5",
    name: "HackNight 3.0",
    date: "October 2023",
    desc: "The edition that started it all — 20 teams, 3 themes, endless caffeine.",
  },
  {
    src: "/images/workshop2.jpg",
    area: "2 / 2 / 3 / 4",
    name: "Web Dev Bootcamp",
    date: "January 2025",
    desc: "Three-day intensive covering React, Next.js, and deploying production-ready apps.",
  },
  {
    src: "/images/Computer1.jpg",
    area: "2 / 4 / 3 / 5",
    name: "DSA Sprint",
    date: "November 2024",
    desc: "Competitive programming session focused on trees, graphs, and dynamic programming.",
  },
];

export function Events() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#0a0a0a",
      padding: "16px",
      boxSizing: "border-box",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 2fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "12px",
        width: "100%",
        height: "100%",
      }}>
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
            onHoverStart={() => setHoveredIndex(i)}
            onHoverEnd={() => setHoveredIndex(null)}
            style={{
              gridArea: img.area,
              borderRadius: "20px",
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
              border: "1px solid rgba(240, 235, 225, 0.1)",
            }}
          >
            {/* Photo */}
            <motion.img
              src={img.src}
              alt={img.name}
              animate={{ scale: hoveredIndex === i ? 1.06 : 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            {/* Dark gradient — always present, stronger on hover */}
            <motion.div
              animate={{ opacity: hoveredIndex === i ? 1 : 0.25 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                borderRadius: "20px",
              }}
            />

            {/* Overlay text */}
            <AnimatePresence>
              {hoveredIndex === i && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "20px 18px",
                    pointerEvents: "none",
                  }}
                >
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "6px",
                  }}>
                    <span style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "1.2px",
                      textTransform: "uppercase",
                      color: "rgba(240, 235, 225, 0.5)",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}>
                      {img.date}
                    </span>
                  </div>

                  <h3 style={{
                    margin: "0 0 6px 0",
                    fontSize: "clamp(0.9rem, 1.4vw, 1.15rem)",
                    fontWeight: 600,
                    color: "#F0EBE1",
                    fontFamily: "var(--font-inter), sans-serif",
                    lineHeight: 1.2,
                    letterSpacing: "-0.01em",
                  }}>
                    {img.name}
                  </h3>

                  <p style={{
                    margin: 0,
                    fontSize: "clamp(0.72rem, 1vw, 0.82rem)",
                    color: "rgba(240, 235, 225, 0.6)",
                    fontFamily: "var(--font-inter), sans-serif",
                    lineHeight: 1.5,
                  }}>
                    {img.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
