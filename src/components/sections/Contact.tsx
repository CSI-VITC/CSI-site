"use client";
import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export function Contact() {
  return (
    <div style={{ padding: "40px 8%", color: "#F0EBE1", fontFamily: "var(--font-inter), sans-serif", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100%", background: "#0a0a0a", overflowX: "hidden" }}>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: "60px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: "15vw", lineHeight: 0.8, margin: 0, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
          HELLO.
        </h1>
        <p style={{ fontSize: "1rem", letterSpacing: "2px", textTransform: "uppercase", marginTop: "20px", borderTop: "1px solid rgba(240, 235, 225, 0.2)", paddingTop: "20px", maxWidth: "600px", margin: "20px auto 0 auto", color: "rgba(240, 235, 225, 0.7)" }}>
          Whether you want to collaborate, speak at an event, or just say hi — our inbox is open.
        </p>
      </motion.div>
      
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
        
        <motion.div variants={fadeUp} style={{ border: "1px solid rgba(240, 235, 225, 0.2)", padding: "30px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 400, margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>Email Us</h3>
          <p style={{ color: "rgba(240, 235, 225, 0.6)", fontSize: "1rem", margin: 0 }}>csi@mku.edu.in</p>
        </motion.div>

        <motion.div variants={fadeUp} style={{ border: "1px solid rgba(240, 235, 225, 0.2)", padding: "30px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 400, margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>Visit Us</h3>
          <p style={{ color: "rgba(240, 235, 225, 0.6)", fontSize: "1rem", margin: 0, lineHeight: 1.5 }}>Room 204, CS Block,<br/>Madurai Kamaraj University</p>
        </motion.div>

        <motion.div variants={fadeUp} style={{ border: "1px solid rgba(240, 235, 225, 0.2)", padding: "30px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 400, margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>Socials</h3>
          <div style={{ display: "flex", gap: "15px", marginTop: "5px" }}>
            <a href="#" style={{ color: "rgba(240, 235, 225, 0.6)", textDecoration: "none", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid transparent", transition: "border-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = "rgba(240, 235, 225, 0.6)"} onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = "transparent"}>Instagram</a>
            <a href="#" style={{ color: "rgba(240, 235, 225, 0.6)", textDecoration: "none", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid transparent", transition: "border-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = "rgba(240, 235, 225, 0.6)"} onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = "transparent"}>LinkedIn</a>
            <a href="#" style={{ color: "rgba(240, 235, 225, 0.6)", textDecoration: "none", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid transparent", transition: "border-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = "rgba(240, 235, 225, 0.6)"} onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = "transparent"}>GitHub</a>
          </div>
        </motion.div>
        
      </motion.div>
    </div>
  );
}
