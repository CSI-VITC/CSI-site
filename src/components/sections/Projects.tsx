"use client";

import React, { useState, useEffect } from "react";
import VideoComponent from "https://framer.com/m/Video-Component-0Gti.js@rgRu2j7Rdo4wHbNub7OE";
import CardSwap, { Card } from "../CardSwap";
import { motion } from "framer-motion";

export function Projects() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [randomIp, setRandomIp] = useState("169.254.83.107");

  useEffect(() => {
    // Generate a random IP on mount so it's consistent during the animation
    setRandomIp(`192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`);
  }, []);

  useEffect(() => {
    const terminalLog = [
      "PS D:\\Projects\\CSI-site> npm run dev",
      "",
      "- Local:         http://localhost:3000",
      `- Network:       http://${randomIp}:3000`,
      "✓ Ready in 724ms",
      "- Experiments (use with caution):",
      "  · urlImports",
      "",
      "Cooking....",
      "GET / 2026"
    ];

    let i = 0;
    const intervalId = setInterval(() => {
      setTerminalLines(terminalLog.slice(0, i + 1));
      i++;
      if (i >= terminalLog.length) {
        clearInterval(intervalId);
      }
    }, 400);
    return () => clearInterval(intervalId);
  }, [randomIp]);

  return (
    <div style={{ padding: 0, width: "100%", height: "100%", position: "relative", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", background: "transparent" }}>
      <div style={{ flex: 1, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        
        {/* VS Code Window */}
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#1e1e1e", overflow: "hidden", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
          
          {/* Title Bar */}
          <div style={{ height: "30px", background: "#181818", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px", borderBottom: "1px solid #2b2b2b", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: "12px", fontSize: "0.75rem", color: "#cccccc" }}>
              <span style={{ cursor: "default" }}>File</span>
              <span style={{ cursor: "default" }}>Edit</span>
              <span style={{ cursor: "default" }}>Selection</span>
              <span style={{ cursor: "default" }}>View</span>
              <span style={{ cursor: "default" }}>Go</span>
              <span style={{ cursor: "default" }}>Run</span>
              <span style={{ cursor: "default" }}>Terminal</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#cccccc" }}>
              page.tsx - CSI-site
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#333" }}></div>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#333" }}></div>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#333" }}></div>
            </div>
          </div>

          {/* Main Body */}
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            
            {/* Activity Bar */}
            <div style={{ width: "48px", background: "#181818", borderRight: "1px solid #2b2b2b", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "15px", gap: "20px", flexShrink: 0 }}>
              <div style={{ width: "24px", height: "24px", border: "2px solid #858585", borderRadius: "4px", opacity: 0.8 }}></div>
              <div style={{ width: "24px", height: "24px", border: "2px solid #858585", borderRadius: "50%", opacity: 0.4 }}></div>
              <div style={{ width: "24px", height: "4px", background: "#858585", opacity: 0.4, marginTop: "4px" }}></div>
            </div>

            {/* Explorer */}
            <div style={{ width: "220px", background: "#1e1e1e", borderRight: "1px solid #2b2b2b", display: "flex", flexDirection: "column", flexShrink: 0 }}>
              <div style={{ padding: "10px 15px", fontSize: "0.7rem", color: "#ccc", textTransform: "uppercase", letterSpacing: "1px" }}>Explorer</div>
              <div style={{ flex: 1, padding: "5px 0", fontSize: "0.8rem", color: "#ccc", overflowY: "auto" }}>
                <div style={{ padding: "3px 15px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px", cursor: "default" }}>
                  <span style={{ fontSize: "0.6rem" }}>▼</span> projects
                </div>
                <div style={{ padding: "3px 15px 3px 25px", display: "flex", alignItems: "center", gap: "6px", color: "#ccc", cursor: "default", fontWeight: "bold" }}><span style={{ fontSize: "0.6rem" }}>▼</span> CSI-site</div>
                <div style={{ padding: "3px 15px 3px 45px", display: "flex", alignItems: "center", gap: "6px", color: "#858585", cursor: "default" }}>▶ .next</div>
                <div style={{ padding: "3px 15px 3px 45px", display: "flex", alignItems: "center", gap: "6px", color: "#858585", cursor: "default" }}>▶ node_modules</div>
                <div style={{ padding: "3px 15px 3px 45px", display: "flex", alignItems: "center", gap: "6px", color: "#858585", cursor: "default" }}>▶ public</div>
                <div style={{ padding: "3px 15px 3px 45px", display: "flex", alignItems: "center", gap: "6px", color: "#ccc", cursor: "default" }}><span style={{ fontSize: "0.6rem" }}>▼</span> src</div>
                <div style={{ padding: "3px 15px 3px 65px", display: "flex", alignItems: "center", gap: "6px", color: "#ccc", cursor: "default" }}><span style={{ fontSize: "0.6rem" }}>▼</span> app</div>
                <div style={{ padding: "3px 15px 3px 85px", display: "flex", alignItems: "center", gap: "6px", background: "#37373d", color: "#fff", cursor: "default" }}>
                  <span style={{ color: "#519aba", fontSize: "0.7rem" }}>TS</span> page.tsx
                </div>
                <div style={{ padding: "3px 15px 3px 65px", display: "flex", alignItems: "center", gap: "6px", color: "#858585", cursor: "default" }}>▶ components</div>
                <div style={{ padding: "3px 15px 3px 45px", display: "flex", alignItems: "center", gap: "6px", color: "#858585", cursor: "default" }}>≡ package.json</div>
              </div>
            </div>

            {/* Editor & Terminal */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#1e1e1e", overflow: "hidden" }}>
              
              {/* Editor Tabs */}
              <div style={{ display: "flex", background: "#252526", overflowX: "hidden", flexShrink: 0 }}>
                <div style={{ padding: "8px 16px", background: "#1e1e1e", color: "#fff", fontSize: "0.8rem", borderTop: "2px solid #007acc", display: "flex", alignItems: "center", gap: "6px", minWidth: "120px" }}>
                  <span style={{ color: "#519aba", fontWeight: "bold", fontSize: "0.7rem" }}>TS</span> page.tsx <span style={{ marginLeft: "auto", fontSize: "0.8rem", opacity: 0.5 }}>×</span>
                </div>
              </div>

              {/* Editor Content */}
              <div style={{ flex: 1, padding: "12px 0", color: "#d4d4d4", fontSize: "0.9rem", fontFamily: "'JetBrains Mono', Consolas, monospace", display: "flex", overflow: "hidden" }}>
                {/* Line Numbers */}
                <div style={{ color: "#858585", padding: "0 15px", textAlign: "right", userSelect: "none", lineHeight: "1.6", opacity: 0.5 }}>
                  1<br />2<br />3<br />4<br />5<br />6<br />7
                </div>
                {/* Code Area */}
                <div style={{ lineHeight: "1.6", flex: 1, overflowY: "auto" }}>
                  <div><span style={{ color: "#c586c0" }}>import</span> <span style={{ color: "#9cdcfe" }}>React</span> <span style={{ color: "#c586c0" }}>from</span> <span style={{ color: "#ce9178" }}>"react"</span>;</div>
                  <div><span style={{ color: "#c586c0" }}>import</span> {'{'} <span style={{ color: "#9cdcfe" }}>DesktopWindow</span> {'}'} <span style={{ color: "#c586c0" }}>from</span> <span style={{ color: "#ce9178" }}>"@/components/DesktopWindow"</span>;</div>
                  <div style={{ height: "1.6em" }}></div>
                  <div><span style={{ color: "#569cd6" }}>export default function</span> <span style={{ color: "#dcdcaa" }}>Desktop</span>() {'{'}</div>
                  <div style={{ paddingLeft: "20px" }}>
                    <span style={{ color: "#c586c0" }}>return</span> (
                  </div>
                  <div style={{ paddingLeft: "40px" }}>
                    <span style={{ color: "#808080" }}>// Currently under active development</span>
                  </div>
                  <div style={{ paddingLeft: "40px" }}>
                    <span style={{ color: "#808080" }}>// More projects coming soon!</span>
                  </div>
                  <div style={{ paddingLeft: "20px" }}>
                    );
                  </div>
                  <div>{'}'}</div>
                </div>
              </div>

              {/* Integrated Terminal */}
              <div style={{ height: "250px", borderTop: "1px solid #2b2b2b", background: "#1e1e1e", display: "flex", flexDirection: "column", flexShrink: 0 }}>
                {/* Terminal Tabs */}
                <div style={{ display: "flex", gap: "20px", padding: "8px 15px 0", fontSize: "0.75rem", color: "#858585", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <div style={{ cursor: "default" }}>Problems</div>
                  <div style={{ cursor: "default" }}>Output</div>
                  <div style={{ cursor: "default" }}>Debug Console</div>
                  <div style={{ color: "#e7e7e7", borderBottom: "1px solid #e7e7e7", paddingBottom: "6px", cursor: "default" }}>Terminal</div>
                </div>
                {/* Terminal Content */}
                <div style={{ padding: "10px 15px", fontSize: "0.85rem", fontFamily: "'JetBrains Mono', Consolas, monospace", color: "#ccc", overflowY: "auto", flex: 1, whiteSpace: "pre-wrap", lineHeight: "1.4" }}>
                  {terminalLines.map((line, idx) => (
                    <div key={idx} style={{ 
                      color: line.startsWith("✓") ? "#27c93f" : (line.startsWith("PS") ? "#519aba" : "#d4d4d4"),
                      marginBottom: "2px" 
                    }}>
                      {line}
                    </div>
                  ))}
                  {terminalLines.length < 10 && (
                    <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} style={{ display: "inline-block", marginTop: "2px", width: "8px", height: "15px", background: "#d4d4d4" }} />
                  )}
                </div>
              </div>
              
            </div>
          </div>
          
          {/* Status Bar */}
          <div style={{ height: "24px", background: "#007acc", color: "#fff", fontSize: "0.7rem", display: "flex", alignItems: "center", padding: "0 12px", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: "15px" }}>
              <span><span style={{ fontSize: "0.8rem", marginRight: "4px" }}>⎇</span>main*</span>
              <span>⊗ 0 ⚠ 0</span>
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
              <span>UTF-8</span>
              <span>TypeScript React</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
