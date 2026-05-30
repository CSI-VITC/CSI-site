"use client";
import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function Team() {
  const members = [
    { name: "Arjun Selvam", role: "President", subRole: "Web Dev" },
    { name: "Karthik Rajan", role: "Vice President", subRole: "AI/ML" },
    { name: "Meera Krishnan", role: "Design Lead", subRole: "UI/UX" },
    { name: "Vikram Anand", role: "Security Lead", subRole: "Cybersecurity" },
    { name: "Priya Nair", role: "Tech Lead", subRole: "Web Dev" },
    { name: "Divya Mohan", role: "AI/ML Lead", subRole: "Research" },
    { name: "Rohan Das", role: "Events Head", subRole: "UI/UX" },
    { name: "Sneha Pillai", role: "Community Manager", subRole: "Cybersecurity" }
  ];

  return (
    <div style={{ padding: "40px 8%", color: "#F0EBE1", fontFamily: "var(--font-inter), sans-serif", background: "#0a0a0a", minHeight: "100%", overflowX: "hidden" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: "60px" }}>
        <h1 style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: "15vw", lineHeight: 0.8, margin: 0, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
          CREW.
        </h1>
        <p style={{ fontSize: "1rem", letterSpacing: "2px", textTransform: "uppercase", marginTop: "20px", borderTop: "1px solid rgba(240, 235, 225, 0.2)", paddingTop: "20px" }}>
          Meet The Team
        </p>
      </motion.div>
      
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.05 } } }} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
        {members.map((m, i) => (
          <motion.div key={i} variants={fadeUp} style={{ border: "1px solid rgba(240, 235, 225, 0.2)", padding: "30px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", transition: "background 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(240, 235, 225, 0.05)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <div style={{ width: "80px", height: "80px", border: "1px solid rgba(240, 235, 225, 0.4)", color: "#F0EBE1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: 700, marginBottom: "20px", fontFamily: "var(--font-anton), sans-serif" }}>
              {m.name.split(" ").map(n => n[0]).join("")}
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 500, margin: "0 0 5px 0" }}>{m.name}</h3>
            <p style={{ color: "rgba(240, 235, 225, 0.6)", fontSize: "0.9rem", margin: 0, fontWeight: 400 }}>{m.role}</p>
            <p style={{ color: "rgba(240, 235, 225, 0.9)", fontSize: "0.8rem", margin: "10px 0 0 0", fontWeight: 600, borderTop: "1px solid rgba(240, 235, 225, 0.2)", paddingTop: "10px", width: "100%", textTransform: "uppercase", letterSpacing: "1px" }}>{m.subRole}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
