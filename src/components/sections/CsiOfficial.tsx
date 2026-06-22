"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export function CsiOfficial() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#0a0a0a", color: "#F0EBE1", fontFamily: "var(--font-inter), sans-serif", overflow: "hidden" }}>
      
      {/* Safari Toolbar */}
      <div style={{ height: "52px", background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", display: "flex", alignItems: "center", padding: "0 16px", justifyContent: "space-between", flexShrink: 0 }}>
        
        {/* Left Actions */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center", color: "rgba(240, 235, 225, 0.6)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" cursor="pointer"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
          <div style={{ display: "flex", gap: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" cursor="pointer"><polyline points="15 18 9 12 15 6"></polyline></svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" cursor="pointer"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </div>

        {/* Address Bar */}
        <div style={{ width: "400px", maxWidth: "40%", height: "28px", borderRadius: "6px", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#F0EBE1", fontSize: "0.85rem", gap: "6px", cursor: "text" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(240, 235, 225, 0.5)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          csi-india.org
        </div>

        {/* Right Actions */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center", color: "rgba(240, 235, 225, 0.6)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" cursor="pointer"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" cursor="pointer"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </div>
      </div>

      {/* Browser Viewport */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "40px 8%", background: "#0a0a0a" }}>
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
    </div>
  );
}
