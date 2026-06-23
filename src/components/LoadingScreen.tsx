"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const HELLOS = [
  "hello",
  "hola",
  "bonjour",
  "ciao",
  "namaste",
  "konnichiwa",
  "annyeong",
  "salut",
  "halløj",
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [helloIndex, setHelloIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through languages at a readable pace
    const helloInterval = setInterval(() => {
      setHelloIndex((prev) => {
        if (prev >= HELLOS.length - 1) return prev; // Stay on last one before exit
        return prev + 1;
      });
    }, 350);

    // Progress bar increments smoothly to match the 3.2s duration
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + 1));
    }, 32);

    // End sequence after 3.2s
    const timeout = setTimeout(() => {
      setIsFinishing(true);
      setTimeout(onComplete, 600);
    }, 3200);

    return () => {
      clearInterval(helloInterval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isFinishing ? 0 : 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
        overflow: "hidden"
      }}
    >
      {/* Tahoe-style Vibrant Background Blur */}
      <div style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: -1,
        overflow: "hidden",
        filter: "blur(120px)",
        opacity: 0.5
      }}>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "80%",
            height: "80%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 60%)",
          }} 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -15, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            bottom: "0%",
            right: "0%",
            width: "70%",
            height: "70%",
            background: "radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, transparent 60%)",
          }} 
        />
      </div>

      <div style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={helloIndex}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ 
              duration: 0.5, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: "84px",
              color: "#fff",
              textAlign: "center",
              textShadow: "0 0 30px rgba(255,255,255,0.3)",
              letterSpacing: "-1px"
            }}
          >
            {HELLOS[helloIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle Progress Bar at the very bottom */}
      <div style={{
        position: "absolute",
        bottom: "80px",
        width: "200px",
        height: "2px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "4px",
        overflow: "hidden"
      }}>
        <motion.div 
          style={{ 
            width: `${progress}%`, 
            height: "100%", 
            background: "#fff",
            boxShadow: "0 0 10px #fff"
          }} 
        />
      </div>
    </motion.div>
  );
}
