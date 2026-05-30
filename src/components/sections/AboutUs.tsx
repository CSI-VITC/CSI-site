"use client";
import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export function AboutUs() {
  return (
    <div style={{ padding: "40px 8%", color: "#F0EBE1", fontFamily: "var(--font-inter), sans-serif", overflowX: "hidden", background: "#0a0a0a" }}>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
        
        <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", marginBottom: "60px" }}>
          <h1 style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: "15vw", lineHeight: 0.8, margin: 0, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
            BUILD.
          </h1>
          <p style={{ fontSize: "1rem", letterSpacing: "2px", textTransform: "uppercase", marginTop: "20px", borderTop: "1px solid rgba(240, 235, 225, 0.2)", paddingTop: "20px" }}>
            CSI Student Chapter • MKU
          </p>
        </motion.div>
        
        <motion.div variants={fadeUp} style={{ fontSize: "2rem", fontWeight: 400, lineHeight: 1.2, marginBottom: "40px" }}>
          Build. Break. Innovate. Repeat.
        </motion.div>

        <motion.p variants={fadeUp} style={{ fontSize: "1.05rem", lineHeight: 1.6, maxWidth: "700px", marginBottom: "20px", color: "rgba(240, 235, 225, 0.7)" }}>
          We exist to turn curious students into builders. CSI MKU bridges the gap between classroom theory and industry reality — through hands-on projects, real mentorship, and a community that pushes each other to ship.
        </motion.p>
        
        <motion.p variants={fadeUp} style={{ fontSize: "1.05rem", lineHeight: 1.6, maxWidth: "700px", marginBottom: "60px", color: "rgba(240, 235, 225, 0.7)" }}>
          We're a 150-member strong collective of developers, designers, researchers, and dreamers. From late-night hackathons to open-source contributions, everything we do is driven by one belief: the best way to learn is to build something real.
        </motion.p>

        <motion.h3 variants={fadeUp} style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>Core Values</motion.h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "60px" }}>
          {[
            { title: "Craft over credentials", desc: "What you build matters more than your GPA." },
            { title: "Open by default", desc: "Knowledge shared is knowledge multiplied." },
            { title: "Ship early, learn fast", desc: "Progress over perfection, always." }
          ].map((val, i) => (
            <motion.div key={i} variants={fadeUp} style={{ border: "1px solid rgba(240, 235, 225, 0.2)", padding: "30px" }}>
              <h4 style={{ fontSize: "1.2rem", margin: "0 0 10px 0", fontWeight: 500 }}>{val.title}</h4>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.5, margin: 0, color: "rgba(240, 235, 225, 0.6)" }}>{val.desc}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div variants={fadeUp} style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", borderTop: "1px solid rgba(240, 235, 225, 0.2)", paddingTop: "40px" }}>
          {[
            { num: "150+", lbl: "Members" },
            { num: "40+", lbl: "Events" },
            { num: "25+", lbl: "Projects" },
            { num: "6", lbl: "Years Strong" }
          ].map((stat, i) => (
            <div key={i} style={{ flex: "1 1 120px" }}>
              <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: "4rem", lineHeight: 1 }}>{stat.num}</div>
              <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "2px", marginTop: "10px", color: "rgba(240, 235, 225, 0.5)" }}>{stat.lbl}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
