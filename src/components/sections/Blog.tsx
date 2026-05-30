"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export function Blog() {
  const posts = [
    { title: "Why every CS student should contribute to open source before graduating", tag: "Career", author: "Arjun Selvam", date: "May 10, 2025", read: "6 min", desc: "Open source isn't just a resume line — it's the fastest way to learn how real software is built." },
    { title: "RAG vs fine-tuning: what actually works for small teams in 2025", tag: "AI", author: "Karthik Rajan", date: "Apr 3, 2025", read: "8 min", desc: "Everyone's building with LLMs now. But which approach is right for your use case?" },
    { title: "The quiet skill nobody teaches: reading other people's code", tag: "Craft", author: "Priya Nair", date: "Feb 18, 2025", read: "5 min", desc: "Writing code is one thing. Understanding an unfamiliar 10,000-line codebase in 30 minutes is another." }
  ];

  return (
    <div style={{ padding: "40px 8%", color: "#F0EBE1", fontFamily: "var(--font-inter), sans-serif", overflowX: "hidden", background: "#0a0a0a", minHeight: "100%" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: "60px" }}>
        <h1 style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: "15vw", lineHeight: 0.8, margin: 0, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
          READ.
        </h1>
        <p style={{ fontSize: "1rem", letterSpacing: "2px", textTransform: "uppercase", marginTop: "20px", borderTop: "1px solid rgba(240, 235, 225, 0.2)", paddingTop: "20px" }}>
          Latest Thoughts & Notes
        </p>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {posts.map((p, i) => (
          <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} 
            style={{ border: "1px solid rgba(240, 235, 225, 0.2)", padding: "30px", transition: "background 0.3s ease", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(240, 235, 225, 0.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 400, margin: 0, maxWidth: "80%", lineHeight: 1.4 }}>{p.title}</h2>
              <span style={{ border: "1px solid rgba(240, 235, 225, 0.5)", color: "#F0EBE1", padding: "4px 12px", fontSize: "0.8rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px" }}>{p.tag}</span>
            </div>
            <p style={{ color: "rgba(240, 235, 225, 0.7)", fontSize: "1rem", lineHeight: 1.6, margin: "0 0 20px 0" }}>{p.desc}</p>
            <div style={{ display: "flex", gap: "15px", alignItems: "center", fontSize: "0.85rem", color: "rgba(240, 235, 225, 0.5)", textTransform: "uppercase", letterSpacing: "1px" }}>
              <span style={{ color: "rgba(240, 235, 225, 0.9)", fontWeight: 500 }}>{p.author}</span>
              <span>•</span>
              <span>{p.date}</span>
              <span>•</span>
              <span>{p.read}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
