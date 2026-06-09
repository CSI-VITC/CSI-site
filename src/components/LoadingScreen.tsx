"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const bootMessages = [
    "INITIALIZING CORE SYSTEM PROTOCOLS...",
    "ESTABLISHING SECURE QUANTUM LINK...",
    "IP STATUS: [192.168.88.254] SECURE",
    "LOADING MATRIX CODE RAIN GRID...",
    "CONNECTING TO TECHNICAL HUB APPS...",
    "COMPILING MONOSPACE TYPOGRAPHY ENGINE...",
    "BYPASSING SECURE FIREWALL...",
    "MOUNTING CYBERSPACE DESKTOP WINDOWS...",
    "SYSTEM READY."
  ];

  useEffect(() => {
    let currentLogIndex = 0;
    const logInterval = setInterval(() => {
      if (currentLogIndex < bootMessages.length) {
        setLogs((prev) => [...prev, bootMessages[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 250);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 120);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#000000",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 99999,
      fontFamily: "monospace",
      padding: "20px",
      boxSizing: "border-box"
    }}>
      <div style={{ width: "100%", maxWidth: "600px", display: "flex", flexDirection: "column", gap: "10px" }}>
        
        {/* Terminal Header */}
        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid rgba(0, 255, 102, 0.3)", paddingBottom: "8px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f56" }}></div>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }}></div>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#00ff66" }}></div>
          <span style={{ color: "#00ff66", fontSize: "12px", marginLeft: "10px" }}>SYS_BOOT_SEQUENCE // KERNEL v8.4.1</span>
        </div>

        {/* Boot Logs */}
        <div style={{ height: "240px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#34d399", padding: "10px 0" }}>
          {logs.map((log, i) => (
            <div key={i} style={{ display: "flex", gap: "8px" }}>
              <span style={{ color: "#00ff66" }}>&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>

        {/* Loading Bar */}
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#00ff66", fontSize: "12px", marginBottom: "8px" }}>
            <span>PROGRESS: {progress}%</span>
            <span>{progress === 100 ? "DECRYPT COMPLETE" : "DECRYPTING SYSTEM..."}</span>
          </div>
          <div style={{ width: "100%", height: "12px", background: "rgba(0, 255, 102, 0.1)", border: "1px solid #00ff66", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
            <motion.div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #10b981 0%, #00ff66 100%)",
                boxShadow: "0 0 10px #00ff66",
                width: `${progress}%`
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
