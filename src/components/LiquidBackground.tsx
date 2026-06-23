"use client";

import { motion } from "framer-motion";

export default function LiquidBackground() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#050505" }}>
      {/* Dynamic Liquid Gradients Behind */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          borderRadius: ["40%", "60%", "40%"]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: "60vw",
          height: "60vw",
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(60px)",
        }}
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
          borderRadius: ["60%", "40%", "60%"]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute",
          width: "50vw",
          height: "50vw",
          background: "radial-gradient(circle, rgba(147,51,234,0.1) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* The Central Group Photo with Liquid Mask */}
      <motion.div
        animate={{
          borderRadius: [
            "60% 40% 30% 70% / 60% 30% 70% 40%",
            "30% 70% 70% 30% / 30% 30% 70% 70%",
            "60% 40% 30% 70% / 60% 30% 70% 40%"
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: "40vw",
          height: "40vw",
          maxWidth: "500px",
          maxHeight: "500px",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 0 50px rgba(0,0,0,0.5)",
          border: "2px solid rgba(255,255,255,0.05)"
        }}
      >
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
          alt="CSI Group"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </motion.div>
      
      {/* Liquid Glass Overlay Effect */}
      <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", maskImage: "radial-gradient(circle at center, transparent 15%, black 40%)", pointerEvents: "none" }} />
    </div>
  );
}
