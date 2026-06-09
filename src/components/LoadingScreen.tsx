"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

// ─── ASCII Art Assets ───
const ASCII_LOGO = [
  "   ____  ____  __     __ ",
  "  / ___|/ ___| \\ \\   / / ",
  "  \\___ \\___ \\ \\ \\ / /  ",
  "   ___) |___) | \\ V /   ",
  "  |____/____/   \\_/    ",
];

const ASCII_SKULL = [
  "      .---.",
  "    /       \\",
  "   |  O   O  |",
  "   |    <    |",
  "   |  \\___/  |",
  "    \\_______/",
  "     ||   ||",
  "    _||   ||_",
];

// ─── Boot Log Messages ───
const BOOT_LOGS = [
  { text: "BIOS DATE 01/14/2026 14:22:51 VER 1.0.8", color: "#888" },
  { text: "CPU: QUANTUM NEURAL PROCESSOR QNP-X9 @ 8.4GHz", color: "#00ff66" },
  { text: "DETECTING PRIMARY MASTER ... SUCCESS", color: "#00ff66" },
  { text: "DETECTING PRIMARY SLAVE  ... NONE", color: "#888" },
  { text: "DETECTING SECONDARY MASTER ... NVMe M.2 4TB", color: "#00ff66" },
  { text: "CHECKING NVRAM .......................... OK", color: "#00cc44" },
  { text: "LOADING KERNEL MODULES ..................", color: "#00ff66" },
  { text: "  [eth_qnp] Quantum Network Protocol ... OK", color: "#00cc44" },
  { text: "  [gfx_matrix] Matrix Rendering Engine . OK", color: "#00cc44" },
  { text: "  [sec_vault] Secure Vault Module ...... OK", color: "#00cc44" },
  { text: "  [ai_core] Neural Inference Engine .... OK", color: "#00cc44" },
  { text: "MOUNTING VIRTUAL FILESYSTEMS .......... OK", color: "#00cc44" },
  { text: "STARTING SYSTEM DAEMONS ...............", color: "#00ff66" },
  { text: "  [CRON] Task Scheduler ............... ACTIVE", color: "#00cc44" },
  { text: "  [SSH] Secure Shell .................. PORT 22", color: "#00cc44" },
  { text: "  [HTTP] Web Server ................... PORT 443", color: "#00cc44" },
  { text: "  [WS] WebSocket Hub .................. PORT 8080", color: "#00cc44" },
  { text: "ESTABLISHING SECURE QUANTUM LINK ......", color: "#00ff66" },
  { text: "  Handshake complete. Cipher: AES-4096-Q", color: "#00cc44" },
  { text: "  Tunnel established to 192.168.88.254", color: "#00cc44" },
  { text: "LOADING MATRIX CODE RAIN GRID .........", color: "#00ff66" },
  { text: "  Initializing character pool: KATAKANA+ASCII", color: "#00cc44" },
  { text: "  Grid resolution: 3840x2160 @ 144Hz", color: "#00cc44" },
  { text: "  Mouse interaction handler ........... BINDING", color: "#00cc44" },
  { text: "COMPILING UI COMPONENT TREE ...........", color: "#00ff66" },
  { text: "  Glassmorphism engine .............. READY", color: "#00cc44" },
  { text: "  Parallax controller ............... READY", color: "#00cc44" },
  { text: "  Dock spring physics ............... READY", color: "#00cc44" },
  { text: "BYPASSING FIREWALL .................... DONE", color: "#00ff66" },
  { text: "  Rules injected: 0x7F3A, 0x2B91, 0x4E0C", color: "#00cc44" },
  { text: "MOUNTING CYBERSPACE DESKTOP ...........", color: "#00ff66" },
  { text: "  Loading background layers ......... 3/3", color: "#00cc44" },
  { text: "  Spawning interactive elements ..... DONE", color: "#00cc44" },
  { text: "  Activating golem guardian ......... ONLINE", color: "#00cc44" },
  { text: "SYSTEM READY. DECRYPTING INTERFACE ....", color: "#00ff66" },
  { text: "", color: "#00ff66" },
  { text: "> INITIALIZING CSI VITC MAINFRAME...", color: "#00ff66" },
];

// ─── Terminal Command Simulation ───
const COMMANDS = [
  { cmd: "whoami", output: "root@csi-vitc:~#" },
  { cmd: "uname -a", output: "CSI-OS 8.4.1-qnp #1 SMP QUANTUM x86_64 GNU/Linux" },
  { cmd: "cat /etc/motd", output: "WELCOME TO THE COMPUTER SOCIETY OF INDIA - VIT CHENNAI" },
  { cmd: "ls -la /sys/", output: "drwxr-xr-x  8 root root 4096 Jan 14 14:22 .\ndrwxr-xr-x 18 root root 4096 Jan 14 14:22 ..\n-rw-r--r--  1 root root  14K Jan 14 14:22 .env\ndrwxr-xr-x  2 root root 4.0K Jan 14 14:22 modules\ndrwxr-xr-x  3 root root 4.0K Jan 14 14:22 protocols\ndrwxr-xr-x  2 root root 4.0K Jan 14 14:22 neural-net\ndrwxr-xr-x  2 root root 4.0K Jan 14 14:22 quantum-link\n-rwxr-xr-x  1 root root 2.1M Jan 14 14:22 golem-core" },
  { cmd: "./golem-core --status", output: "[GOLEM] Forest Guardian Protocol v3.2\n[GOLEM] Status: ACTIVE\n[GOLEM] Tracking: ENABLED\n[GOLEM] Neural sync: 99.7%" },
];

// ─── Glitch Text Component ───
function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`glitch-text ${className}`} data-text={text}>
      {text}
    </span>
  );
}

// ─── Scan Line Effect ───
function ScanLines() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 102, 0.03) 2px, rgba(0, 255, 102, 0.03) 4px)",
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
}

// ─── CRT Flicker Overlay ───
function CRTOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0, 20, 0, 0.4) 100%)",
        pointerEvents: "none",
        zIndex: 3,
        animation: "crtFlicker 0.15s infinite",
      }}
    />
  );
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [logs, setLogs] = useState<Array<{ text: string; color: string }>>([]);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"boot" | "commands" | "ascii" | "final">("boot");
  const [commandOutput, setCommandOutput] = useState<Array<{ type: "cmd" | "out"; text: string }>>([]);
  const [showGlitch, setShowGlitch] = useState(false);
  const [decryptText, setDecryptText] = useState("DECRYPTING");
  const logContainerRef = useRef<HTMLDivElement>(null);
  const hasCompletedRef = useRef(false);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, commandOutput]);

  // ─── Phase 1: Boot logs ───
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < BOOT_LOGS.length) {
        setLogs((prev) => [...prev, BOOT_LOGS[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase("commands"), 400);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // ─── Phase 2: Terminal commands ───
  useEffect(() => {
    if (phase !== "commands") return;
    let cmdIndex = 0;
    const runCommand = () => {
      if (cmdIndex >= COMMANDS.length) {
        setTimeout(() => setPhase("ascii"), 500);
        return;
      }
      const { cmd, output } = COMMANDS[cmdIndex];
      setCommandOutput((prev) => [...prev, { type: "cmd", text: `$ ${cmd}` }]);
      setTimeout(() => {
        output.split("\n").forEach((line, i) => {
          setTimeout(() => {
            setCommandOutput((prev) => [...prev, { type: "out", text: line }]);
          }, i * 40);
        });
        cmdIndex++;
        setTimeout(runCommand, output.split("\n").length * 40 + 300);
      }, 200);
    };
    runCommand();
  }, [phase]);

  // ─── Phase 3: ASCII art reveal ───
  useEffect(() => {
    if (phase !== "ascii") return;
    setShowGlitch(true);
    const glitchInterval = setInterval(() => {
      const variants = ["DECRYPTING", "D3CRYP71NG", "D€CR¥PT1πG", "D£CRYP71NG", "DECRYPTING"];
      setDecryptText(variants[Math.floor(Math.random() * variants.length)]);
    }, 80);
    setTimeout(() => {
      clearInterval(glitchInterval);
      setDecryptText("DECRYPT COMPLETE");
      setPhase("final");
    }, 1500);
    return () => clearInterval(glitchInterval);
  }, [phase]);

  // ─── Progress Bar ───
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Non-linear progress
        const increment = prev < 30 ? 2 : prev < 60 ? 1.5 : prev < 85 ? 1 : 0.5;
        return Math.min(100, prev + increment);
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // ─── Completion ───
  const handleComplete = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    // Final glitch flash
    setShowGlitch(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  }, [onComplete]);

  useEffect(() => {
    if (phase === "final" && progress >= 100) {
      const timer = setTimeout(handleComplete, 600);
      return () => clearTimeout(timer);
    }
  }, [phase, progress, handleComplete]);

  return (
    <div className="loading-screen-container">
      <style>{`
        .loading-screen-container {
          position: fixed;
          inset: 0;
          background: #000000;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 99999;
          font-family: "Courier New", Courier, monospace;
          padding: 20px;
          overflow: hidden;
        }
        
        @keyframes crtFlicker {
          0% { opacity: 0.97; }
          50% { opacity: 1; }
          100% { opacity: 0.98; }
        }
        
        @keyframes glitch-1 {
          0%, 100% { clip-path: inset(0 0 90% 0); transform: translate(-2px, 0); }
          10% { clip-path: inset(20% 0 60% 0); transform: translate(2px, 0); }
          20% { clip-path: inset(40% 0 40% 0); transform: translate(-2px, 0); }
          30% { clip-path: inset(60% 0 20% 0); transform: translate(2px, 0); }
          40% { clip-path: inset(80% 0 0% 0); transform: translate(-2px, 0); }
          50% { clip-path: inset(0% 0 80% 0); transform: translate(2px, 0); }
          60% { clip-path: inset(20% 0 60% 0); transform: translate(-2px, 0); }
          70% { clip-path: inset(40% 0 40% 0); transform: translate(2px, 0); }
          80% { clip-path: inset(60% 0 20% 0); transform: translate(-2px, 0); }
          90% { clip-path: inset(80% 0 0% 0); transform: translate(2px, 0); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(0, 255, 102, 0.3); }
          50% { box-shadow: 0 0 20px rgba(0, 255, 102, 0.6), 0 0 40px rgba(0, 255, 102, 0.2); }
        }
        
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes matrix-fade-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .glitch-text {
          position: relative;
          display: inline-block;
        }
        
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch-text::before {
          color: #ff0040;
          animation: glitch-1 0.3s infinite linear alternate-reverse;
          clip-path: inset(0 0 50% 0);
        }
        
        .glitch-text::after {
          color: #00ff66;
          animation: glitch-1 0.3s infinite linear alternate-reverse;
          animation-delay: 0.15s;
          clip-path: inset(50% 0 0 0);
        }
        
        .scan-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 102, 0.8), transparent);
          animation: scan-line 3s linear infinite;
          pointer-events: none;
          z-index: 4;
        }
        
        .cursor-blink::after {
          content: "_";
          animation: blink 1s step-end infinite;
        }
        
        .terminal-window {
          border: 1px solid rgba(0, 255, 102, 0.3);
          border-radius: 8px;
          background: rgba(0, 10, 0, 0.95);
          box-shadow: 
            0 0 20px rgba(0, 255, 102, 0.1),
            inset 0 0 60px rgba(0, 255, 102, 0.03);
          overflow: hidden;
          position: relative;
        }
        
        .terminal-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(0, 255, 102, 0.2);
          background: rgba(0, 255, 102, 0.05);
        }
        
        .terminal-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .terminal-body {
          padding: 14px;
          height: 280px;
          overflow-y: auto;
          font-size: 12px;
          line-height: 1.6;
        }
        
        .progress-container {
          margin-top: 16px;
          padding: 0 14px 14px;
        }
        
        .progress-bar {
          width: 100%;
          height: 14px;
          background: rgba(0, 255, 102, 0.1);
          border: 1px solid rgba(0, 255, 102, 0.3);
          border-radius: 7px;
          overflow: hidden;
          position: relative;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #00ff66);
          box-shadow: 0 0 10px rgba(0, 255, 102, 0.5);
          transition: width 0.3s ease;
          position: relative;
        }
        
        .progress-fill::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 30px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3));
        }
        
        .ascii-art {
          font-size: 10px;
          line-height: 1.3;
          letter-spacing: 1px;
          white-space: pre;
          color: #00ff66;
          opacity: 0.7;
        }
        
        @media (max-width: 640px) {
          .ascii-art {
            font-size: 7px;
          }
          .terminal-body {
            height: 200px;
            font-size: 10px;
          }
        }
      `}</style>

      {/* Scanning bar */}
      <div className="scan-bar" />

      {/* CRT Effects */}
      <ScanLines />
      <CRTOverlay />

      <div style={{ width: "100%", maxWidth: "720px", position: "relative", zIndex: 5 }}>
        {/* Phase: ASCII Art Header (shown in final phase) */}
        <AnimatePresence>
          {(phase === "ascii" || phase === "final") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ 
                display: "flex", 
                justifyContent: "center", 
                marginBottom: "20px",
                gap: "30px",
                alignItems: "center",
                flexWrap: "wrap"
              }}
            >
              <pre className="ascii-art">{ASCII_LOGO.join("\n")}</pre>
              <pre className="ascii-art" style={{ color: "#fbbf24", opacity: 0.5 }}>{ASCII_SKULL.join("\n")}</pre>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal Window */}
        <div className="terminal-window">
          {/* Terminal Header */}
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: "#ff5f56" }} />
            <div className="terminal-dot" style={{ background: "#ffbd2e" }} />
            <div className="terminal-dot" style={{ background: "#00ff66" }} />
            <span style={{ color: "#00ff66", fontSize: "11px", marginLeft: "10px", letterSpacing: "0.1em" }}>
              SYS_BOOT_SEQUENCE // KERNEL v8.4.1-qnp // BUILD 2026.01.14
            </span>
          </div>

          {/* Terminal Body */}
          <div className="terminal-body" ref={logContainerRef}>
            {/* Boot Logs */}
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div
                  key={`log-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1 }}
                  style={{ 
                    display: "flex", 
                    gap: "8px", 
                    marginBottom: "3px",
                    color: log.color,
                  }}
                >
                  <span style={{ color: "#00ff66", opacity: 0.6, minWidth: "14px" }}>
                    {i < 9 ? `0${i + 1}` : i + 1}
                  </span>
                  <span style={{ color: "#00ff66", opacity: 0.4 }}>&gt;</span>
                  <span>{log.text}</span>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Command Outputs */}
            <AnimatePresence>
              {commandOutput.map((entry, i) => (
                <motion.div
                  key={`cmd-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.08 }}
                  style={{
                    marginBottom: "2px",
                    color: entry.type === "cmd" ? "#fbbf24" : "#a7f3d0",
                    marginLeft: entry.type === "out" ? "16px" : "0",
                  }}
                  className={entry.type === "cmd" ? "cursor-blink" : ""}
                >
                  {entry.text}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Final glitch text */}
            {(phase === "ascii" || phase === "final") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ 
                  marginTop: "16px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  letterSpacing: "0.15em",
                }}
              >
                {showGlitch ? (
                  <GlitchText text={decryptText} />
                ) : (
                  <span style={{ color: "#00ff66" }}>{decryptText}</span>
                )}
              </motion.div>
            )}

            {/* Blinking cursor at bottom */}
            <div style={{ color: "#00ff66", marginTop: "8px" }} className="cursor-blink" />
          </div>

          {/* Progress Section */}
          <div className="progress-container">
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              color: "#00ff66", 
              fontSize: "11px",
              marginBottom: "6px",
              letterSpacing: "0.08em"
            }}>
              <span>PROGRESS: {Math.floor(progress)}%</span>
              <span>
                {progress < 30 && "INITIALIZING..."}
                {progress >= 30 && progress < 60 && "LOADING MODULES..."}
                {progress >= 60 && progress < 85 && "MOUNTING SYSTEM..."}
                {progress >= 85 && progress < 100 && "FINALIZING..."}
                {progress >= 100 && "COMPLETE"}
              </span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                style={{ width: `${progress}%` }}
                animate={progress >= 100 ? { 
                  boxShadow: [
                    "0 0 10px rgba(0, 255, 102, 0.5)",
                    "0 0 30px rgba(0, 255, 102, 0.8)",
                    "0 0 10px rgba(0, 255, 102, 0.5)"
                  ]
                } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </div>

            {/* Hex dump decoration */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "8px",
              fontSize: "9px",
              color: "rgba(0, 255, 102, 0.25)",
              fontFamily: "monospace",
              letterSpacing: "0.05em"
            }}>
              <span>0x{Math.floor(progress * 2.55).toString(16).toUpperCase().padStart(2, "0")}F3A</span>
              <span>MEM: {(progress * 16.7).toFixed(1)}MB</span>
              <span>CPU: {(progress * 0.84).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "12px",
          fontSize: "10px",
          color: "rgba(0, 255, 102, 0.4)",
          letterSpacing: "0.1em",
        }}>
          <span>CSI-OS v8.4.1-qnp</span>
          <span style={{ animation: "blink 2s step-end infinite" }}>■ LIVE</span>
          <span>x86_64 | QUANTUM MODE</span>
        </div>
      </div>
    </div>
  );
}