"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const stagger: Variants = {
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
        
        <motion.div variants={fadeUp} style={{ fontSize: "1rem", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(240, 235, 225, 0.5)", marginBottom: "40px" }}>
          150 members. One belief.
        </motion.div>

        <motion.p variants={fadeUp} style={{ fontSize: "1.05rem", lineHeight: 1.6, maxWidth: "700px", marginBottom: "20px", color: "rgba(240, 235, 225, 0.7)" }}>
          We exist to turn curious students into builders. CSI MKU bridges the gap between classroom theory and industry reality — through hands-on projects, real mentorship, and a community that pushes each other to ship.
        </motion.p>
        
        <motion.p variants={fadeUp} style={{ fontSize: "1.05rem", lineHeight: 1.6, maxWidth: "700px", marginBottom: "60px", color: "rgba(240, 235, 225, 0.7)" }}>
          We're a 150-member strong collective of developers, designers, researchers, and dreamers. From late-night hackathons to open-source contributions, everything we do is driven by one belief: the best way to learn is to build something real.
        </motion.p>

        <div style={{ marginBottom: "80px", marginTop: "40px" }}>
          {[
            { num: "01", title: "Craft over credentials", desc: "What you build matters more than your GPA." },
            { num: "02", title: "Open by default", desc: "Knowledge shared is knowledge multiplied." },
            { num: "03", title: "Ship early, learn fast", desc: "Progress over perfection, always." }
          ].map((val, i) => (
            <motion.div key={i} variants={fadeUp} style={{ borderBottom: i !== 2 ? "1px solid rgba(240, 235, 225, 0.2)" : "none", padding: "30px 0", display: "flex", gap: "30px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: 500, color: "rgba(240, 235, 225, 0.4)", fontFamily: "var(--font-anton), sans-serif", marginTop: "2px" }}>{val.num}</span>
              <div>
                <h4 style={{ fontSize: "1.4rem", margin: "0 0 8px 0", fontWeight: 400, letterSpacing: "-0.01em" }}>{val.title}</h4>
                <p style={{ fontSize: "1rem", lineHeight: 1.5, margin: 0, color: "rgba(240, 235, 225, 0.6)" }}>{val.desc}</p>
              </div>
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
