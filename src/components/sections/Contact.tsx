"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export function Contact() {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", background: "transparent", color: "#f0fdf4", fontFamily: "var(--font-inter), sans-serif", overflow: "hidden" }}>
      
      {/* Mail Sidebar */}
      <div style={{ width: "200px", background: "rgba(16, 185, 129, 0.04)", borderRight: "1px solid rgba(16, 185, 129, 0.15)", display: "flex", flexDirection: "column", padding: "20px 10px", flexShrink: 0 }}>
        <div style={{ fontSize: "0.75rem", color: "rgba(16, 185, 129, 0.6)", fontWeight: 700, padding: "0 10px", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Mailboxes</div>
        
        <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.18)", color: "#f0fdf4", fontSize: "0.85rem", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" fill="none"></polyline>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" fill="none"></path>
          </svg>
          Inbox <span style={{ marginLeft: "auto", fontSize: "0.75rem", background: "#10b981", color: "#051c17", padding: "2px 8px", borderRadius: "10px", fontWeight: 700, boxShadow: "0 0 8px rgba(16,185,129,0.4)" }}>1</span>
        </div>
        
        <div style={{ padding: "8px 12px", borderRadius: "8px", color: "rgba(220, 252, 231, 0.6)", fontSize: "0.85rem", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" fill="none"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2" fill="none"></polygon>
          </svg>
          Sent
        </div>
        
        <div style={{ padding: "8px 12px", borderRadius: "8px", color: "rgba(220, 252, 231, 0.6)", fontSize: "0.85rem", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none"></path>
            <polyline points="14 2 14 8 20 8" fill="none"></polyline>
            <line x1="16" y1="13" x2="8" y2="13" fill="none"></line>
            <line x1="16" y1="17" x2="8" y2="17" fill="none"></line>
            <polyline points="10 9 9 9 8 9" fill="none"></polyline>
          </svg>
          Drafts
        </div>
      </div>

      {/* Message List */}
      <div style={{ width: "260px", background: "rgba(16, 185, 129, 0.02)", borderRight: "1px solid rgba(16, 185, 129, 0.15)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "16px", borderBottom: "1px solid rgba(16, 185, 129, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(16, 185, 129, 0.01)" }}>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#f0fdf4", marginBottom: "4px" }}>Inbox</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(220, 252, 231, 0.5)" }}>1 Message</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="2" cursor="pointer">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" fill="none"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="none"></path>
          </svg>
        </div>
        
        <div style={{ padding: "16px", background: "rgba(16, 185, 129, 0.08)", borderLeft: "3px solid #10b981", cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#f0fdf4" }}>CSI Admin</div>
            <div style={{ fontSize: "0.75rem", color: "#fbbf24", textShadow: "0 0 8px rgba(251,191,36,0.3)" }}>09:41 AM</div>
          </div>
          <div style={{ fontSize: "0.85rem", fontWeight: 500, color: "#dcfce7", marginBottom: "4px" }}>Reach out to us</div>
          <div style={{ fontSize: "0.8rem", color: "rgba(220, 252, 231, 0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Whether you want to collaborate, speak...</div>
        </div>
      </div>

      {/* Main Mail Body */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "transparent" }}>
        
        {/* Mail Header */}
        <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(16, 185, 129, 0.15)", flexShrink: 0, background: "rgba(16, 185, 129, 0.01)" }}>
          <h2 style={{ margin: "0 0 16px 0", fontSize: "1.5rem", fontWeight: 600, color: "#f0fdf4" }}>Reach out to us</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.9rem" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontFamily: "var(--font-anton), sans-serif", fontSize: "1.2rem", paddingTop: "2px", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)" }}>C</div>
            <div>
              <div style={{ display: "flex", gap: "8px" }}>
                <span style={{ fontWeight: 600, color: "#f0fdf4" }}>CSI Admin</span>
                <span style={{ color: "rgba(220, 252, 231, 0.5)" }}>&lt;csi.vitc@gmail.com&gt;</span>
              </div>
              <div style={{ color: "rgba(220, 252, 231, 0.4)", fontSize: "0.8rem", marginTop: "2px" }}>To: You</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: "12px", color: "rgba(16, 185, 129, 0.6)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" cursor="pointer">
                <polyline points="9 17 4 12 9 7" fill="none"></polyline>
                <path d="M20 18v-2a4 4 0 0 0-4-4H4" fill="none"></path>
              </svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" cursor="pointer">
                <path d="M3 6h18" fill="none"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Mail Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: "60px", textAlign: "left" }}>
            <h1 style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: "7vw", lineHeight: 0.9, margin: 0, textTransform: "uppercase", letterSpacing: "-0.02em", color: "#f0fdf4", textShadow: "0 0 35px rgba(16,185,129,0.3)" }}>
              HELLO.
            </h1>
            <p style={{ fontSize: "1rem", letterSpacing: "2px", textTransform: "uppercase", marginTop: "20px", borderTop: "1px solid rgba(16, 185, 129, 0.25)", paddingTop: "20px", maxWidth: "600px", color: "rgba(220, 252, 231, 0.75)" }}>
              Whether you want to collaborate, speak at an event, or just say hi — our inbox is open.
            </p>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", width: "100%" }}>
            
            <motion.div variants={fadeUp} style={{ border: "1px solid rgba(16, 185, 129, 0.25)", padding: "30px", display: "flex", flexDirection: "column", gap: "10px", background: "rgba(16,185,129,0.02)", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 500, margin: 0, textTransform: "uppercase", letterSpacing: "1px", color: "#10b981" }}>Email Us</h3>
              <p style={{ color: "#dcfce7", fontSize: "1rem", margin: 0 }}>csi.vitc@gmail.com</p>
            </motion.div>

            <motion.div variants={fadeUp} style={{ border: "1px solid rgba(16, 185, 129, 0.25)", padding: "30px", display: "flex", flexDirection: "column", gap: "10px", background: "rgba(16,185,129,0.02)", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 500, margin: 0, textTransform: "uppercase", letterSpacing: "1px", color: "#10b981" }}>Visit Us</h3>
              <p style={{ color: "#dcfce7", fontSize: "1rem", margin: 0, lineHeight: 1.5 }}>VIT Chennai,<br/>Vandalur-Kelambakkam Road,<br/>Chennai - 600127</p>
            </motion.div>

            <motion.div variants={fadeUp} style={{ border: "1px solid rgba(16, 185, 129, 0.25)", padding: "30px", display: "flex", flexDirection: "column", gap: "10px", background: "rgba(16,185,129,0.02)", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 500, margin: 0, textTransform: "uppercase", letterSpacing: "1px", color: "#10b981" }}>Socials</h3>
              <div style={{ display: "flex", gap: "15px", marginTop: "5px" }}>
                <a href="https://www.instagram.com/csi.vitc/" target="_blank" rel="noopener noreferrer" style={{ color: "#fbbf24", textDecoration: "none", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid transparent", transition: "border-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = "#fbbf24"} onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = "transparent"}>Instagram</a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#fbbf24", textDecoration: "none", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid transparent", transition: "border-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = "#fbbf24"} onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = "transparent"}>LinkedIn</a>
                <a href="https://github.com/orgs/CSI-VITC/" target="_blank" rel="noopener noreferrer" style={{ color: "#fbbf24", textDecoration: "none", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid transparent", transition: "border-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = "#fbbf24"} onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = "transparent"}>GitHub</a>
              </div>
            </motion.div>
            
          </motion.div>
        </div>
      </div>
    </div>
  );
}
