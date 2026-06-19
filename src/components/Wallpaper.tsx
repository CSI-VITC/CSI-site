"use client";

import React from "react";
import { motion } from "framer-motion";
import NeuralNetwork from "./NeuralNetwork";
import CsiVitc3D from "./CsiVitc3D";

export type WallpaperType = "neural" | "cyber" | "aurora" | "charcoal" | "hologram";

interface WallpaperProps {
  type: WallpaperType;
}

export default function Wallpaper({ type }: WallpaperProps) {
  switch (type) {
    case "neural":
      return <NeuralNetwork />;

    case "hologram":
      return <CsiVitc3D />;

    case "cyber":
      return (
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#03080e",
            backgroundImage: `
              linear-gradient(rgba(0, 242, 254, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 242, 254, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "45px 45px",
            backgroundPosition: "center",
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          {/* Animated Sweeping Scan Line */}
          <motion.div
            animate={{
              y: ["0vh", "100vh"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              left: 0,
              width: "100%",
              height: "2px",
              background: "linear-gradient(90deg, rgba(0,242,254,0) 0%, rgba(0,242,254,0.8) 50%, rgba(0,242,254,0) 100%)",
              boxShadow: "0 0 15px rgba(0,242,254,0.8), 0 0 30px rgba(0,242,254,0.4)",
              pointerEvents: "none",
            }}
          />

          {/* Glowing HUD elements in background */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "5%",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              border: "1px dashed rgba(0, 242, 254, 0.15)",
              animation: "spin 30s linear infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "15%",
              right: "8%",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              border: "1px dashed rgba(168, 85, 247, 0.15)",
              animation: "spin-reverse 45s linear infinite",
              pointerEvents: "none",
            }}
          />

          {/* Dynamic glitch lines */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)",
              backgroundSize: "100% 4px",
              pointerEvents: "none",
            }}
          />

          <style jsx>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes spin-reverse {
              from { transform: rotate(360deg); }
              to { transform: rotate(0deg); }
            }
          `}</style>
        </div>
      );

    case "aurora":
      return (
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#05020a",
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          {/* Animated Blob 1 (Cyan/Blue) */}
          <motion.div
            animate={{
              x: ["0%", "30%", "-20%", "0%"],
              y: ["0%", "-40%", "20%", "0%"],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              top: "20%",
              left: "20%",
              width: "55vw",
              height: "55vw",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(0,0,0,0) 80%)",
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />

          {/* Animated Blob 2 (Purple) */}
          <motion.div
            animate={{
              x: ["0%", "-30%", "20%", "0%"],
              y: ["0%", "30%", "-20%", "0%"],
              scale: [1.1, 0.8, 1.2, 1.1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            style={{
              position: "absolute",
              bottom: "10%",
              right: "15%",
              width: "60vw",
              height: "60vw",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(236, 72, 153, 0.03) 50%, rgba(0,0,0,0) 70%)",
              filter: "blur(90px)",
              pointerEvents: "none",
            }}
          />

          {/* Animated Blob 3 (Indigo) */}
          <motion.div
            animate={{
              x: ["0%", "15%", "-15%", "0%"],
              y: ["0%", "20%", "10%", "0%"],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 6,
            }}
            style={{
              position: "absolute",
              top: "40%",
              left: "45%",
              width: "45vw",
              height: "45vw",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, rgba(0,0,0,0) 65%)",
              filter: "blur(70px)",
              pointerEvents: "none",
            }}
          />
        </div>
      );

    case "charcoal":
      return (
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#0d0e11",
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px)`,
            backgroundSize: "32px 32px",
            zIndex: 0,
          }}
        >
          {/* Subtle Ambient Radial Highlight */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, rgba(0, 0, 0, 0.6) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
      );

    default:
      return null;
  }
}
