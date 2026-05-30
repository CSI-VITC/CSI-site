"use client";
import React from "react";
import { motion } from "framer-motion";

export function Community() {
  return (
    <div style={{ padding: "40px 8%", color: "#F0EBE1", fontFamily: "var(--font-inter), sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "600px", background: "#0a0a0a", overflowX: "hidden" }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }} style={{ textAlign: "center", maxWidth: "800px", padding: "40px 0" }}>
        
        <h1 style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: "18vw", lineHeight: 0.8, margin: 0, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
          JOIN.
        </h1>
        
        <p style={{ color: "rgba(240, 235, 225, 0.7)", fontSize: "1.2rem", lineHeight: 1.6, margin: "40px auto", maxWidth: "600px" }}>
          Be part of a growing network of tech enthusiasts, builders, and learners. Whether you are a beginner or a pro, there's a place for you here.
        </p>
        
        <motion.button whileHover={{ backgroundColor: "rgba(240, 235, 225, 0.1)" }} whileTap={{ scale: 0.98 }} style={{ background: "transparent", color: "#F0EBE1", border: "2px solid #F0EBE1", padding: "16px 48px", fontSize: "1rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", transition: "background 0.3s ease" }}>
          Apply to Join
        </motion.button>
        
      </motion.div>
    </div>
  );
}
