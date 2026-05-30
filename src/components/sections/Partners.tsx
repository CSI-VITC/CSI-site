"use client";
import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function Partners() {
  return (
    <div style={{ padding: "40px 8%", color: "#F0EBE1", fontFamily: "var(--font-inter), sans-serif", background: "#0a0a0a", minHeight: "100%", overflowX: "hidden" }}>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: "60px" }}>
        <h1 style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: "15vw", lineHeight: 0.8, margin: 0, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
          ALLIES.
        </h1>
        <p style={{ fontSize: "1rem", letterSpacing: "2px", textTransform: "uppercase", marginTop: "20px", borderTop: "1px solid rgba(240, 235, 225, 0.2)", paddingTop: "20px", maxWidth: "600px", color: "rgba(240, 235, 225, 0.7)" }}>
          Collaborating with industry leaders to bring the best opportunities.
        </p>
      </motion.div>
      
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <motion.div key={item} variants={fadeUp} style={{ border: "1px solid rgba(240, 235, 225, 0.2)", height: "150px", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(240, 235, 225, 0.05)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <span style={{ color: "rgba(240, 235, 225, 0.4)", fontSize: "1rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "2px" }}>Partner {item}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
