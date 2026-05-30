"use client";
import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export function CsiOfficial() {
  return (
    <div style={{ padding: "40px 8%", color: "#F0EBE1", fontFamily: "var(--font-inter), sans-serif", overflowX: "hidden", background: "#0a0a0a" }}>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        
        <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", marginBottom: "60px" }}>
          <h1 style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: "15vw", lineHeight: 0.8, margin: 0, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
            INDIA.
          </h1>
          <p style={{ fontSize: "1rem", letterSpacing: "2px", textTransform: "uppercase", marginTop: "20px", borderTop: "1px solid rgba(240, 235, 225, 0.2)", paddingTop: "20px" }}>
            The National Body
          </p>
        </motion.div>
        
        <motion.div variants={fadeUp} style={{ fontSize: "2rem", fontWeight: 400, lineHeight: 1.2, marginBottom: "40px" }}>
          Computer Society of India <span style={{ color: "rgba(240, 235, 225, 0.4)" }}>(CSI)</span>
        </motion.div>
        
        <motion.p variants={fadeUp} style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "rgba(240, 235, 225, 0.7)", maxWidth: "800px", margin: "0 0 50px 0" }}>
          Established in 1965, the Computer Society of India is the first and largest body of computer professionals in India. It is a national level professional society dedicated to the advancement of theory and practice of Computer Science & Information Technology.
        </motion.p>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", margin: "0 0 50px 0" }}>
          {[
            { title: "Professional Network", desc: "Connecting over 150,000 IT professionals, academicians, and student builders across India." },
            { title: "Knowledge & Events", desc: "Hosting national level conferences, symposia, and publishing prestigious research journals." },
            { title: "Student Chapters", desc: "Nurturing tech talent in colleges through specialized workshops, contests, and mentorship." }
          ].map((val, i) => (
            <motion.div key={i} variants={fadeUp} style={{ border: "1px solid rgba(240, 235, 225, 0.2)", padding: "30px" }}>
              <h4 style={{ fontSize: "1.2rem", margin: "0 0 10px 0", fontWeight: 500 }}>{val.title}</h4>
              <p style={{ color: "rgba(240, 235, 225, 0.6)", fontSize: "0.95rem", lineHeight: 1.5, margin: 0 }}>{val.desc}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div variants={fadeUp} style={{ marginTop: "60px" }}>
          <a href="http://www.csi-india.org/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "transparent", color: "#F0EBE1", border: "2px solid #F0EBE1", padding: "16px 48px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", letterSpacing: "2px", textTransform: "uppercase", transition: "background 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(240, 235, 225, 0.1)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            Visit Official Website
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
