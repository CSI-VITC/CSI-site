"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import VideoComponent from "https://framer.com/m/Video-Component-0Gti.js@rgRu2j7Rdo4wHbNub7OE";
import CardSwap, { Card } from "../CardSwap";
import { X } from "lucide-react";

const PROJECTS = [
  {
    name: "CampusOS",
    tag: "Platform",
    description: "A unified campus platform for navigation, services, and student utilities.",
    video: "https://framerusercontent.com/assets/MLWPbW1dUQawJLhhun3dBwpgJak.mp4",
  },
  {
    name: "SentinelX",
    tag: "Security",
    description: "Monitoring and security tooling built for real-world campus infrastructure.",
    video: "https://framerusercontent.com/assets/271QwsjeO0NMQpKWyYKrJkeWU.mp4",
  },
  {
    name: "LectureLens",
    tag: "AI / EdTech",
    description: "Smart lecture capture and summarization to help students learn faster.",
    video: "https://framerusercontent.com/assets/MLWPbW1dUQawJLhhun3dBwpgJak.mp4",
  },
  {
    name: "Aaroha",
    tag: "Community",
    description: "Mentorship and growth platform connecting CSI members with opportunities.",
    video: "https://framerusercontent.com/assets/271QwsjeO0NMQpKWyYKrJkeWU.mp4",
  },
];

export function Projects() {
  const [typedText, setTypedText] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const fullCommand = "./execute_projects.sh";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setTypedText(fullCommand.substring(0, i + 1));
      i++;
      if (i >= fullCommand.length) clearInterval(intervalId);
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ready = typedText === fullCommand;
  const expanded = expandedIndex !== null ? PROJECTS[expandedIndex] : null;

  return (
    <div
      style={{
        padding: "40px 8%",
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#050505",
      }}
    >
      <div
        style={{
          flex: 1,
          maxWidth: "500px",
          paddingRight: "40px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "30px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "15px",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
          <div
            style={{
              marginLeft: "15px",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "monospace",
            }}
          >
            bash - 80x24
          </div>
        </div>

        <div
          style={{
            color: "#27c93f",
            fontSize: "1.05rem",
            marginBottom: "20px",
            fontFamily: "monospace",
            textShadow: "0 0 5px rgba(39, 201, 63, 0.4)",
          }}
        >
          <span style={{ color: "#F0EBE1" }}>csi-admin@vitc</span>:
          <span style={{ color: "#3b82f6" }}>~/projects</span>$ {typedText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          >
            _
          </motion.span>
        </div>

        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1
              style={{
                fontSize: "5rem",
                color: "#F0EBE1",
                fontWeight: "bold",
                margin: 0,
                lineHeight: 1.1,
                fontFamily: "var(--font-anton), sans-serif",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              Our
              <br />
              Projects
            </h1>
            <p
              style={{
                color: "rgba(240, 235, 225, 0.7)",
                fontSize: "1.1rem",
                marginTop: "1.5rem",
                fontFamily: "var(--font-inter), sans-serif",
                lineHeight: 1.6,
              }}
            >
              Discover the innovative tools and platforms built by our community to elevate the
              technical landscape.
            </p>
            <div
              style={{
                marginTop: "30px",
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.9rem",
                fontFamily: "monospace",
              }}
            >
              &gt; Click a card to expand
            </div>
          </motion.div>
        )}
      </div>

      {ready && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <CardSwap
            width={380}
            height={450}
            cardDistance={36}
            verticalDistance={44}
            delay={5000}
            pauseOnHover
            paused={expandedIndex !== null}
            swapOnClick={false}
            easing="smooth"
            skewAmount={3}
            onCardClick={(i) => setExpandedIndex(i)}
          >
            {PROJECTS.map((p, i) => (
              <Card
                key={p.name}
                style={{ padding: 0, overflow: "hidden", border: "none", background: "transparent" }}
              >
                <VideoComponent
                  name1={p.name}
                  uRL={p.video}
                  source="URL"
                  style={{ width: "100%", height: "100%" }}
                />
              </Card>
            ))}
          </CardSwap>
        </motion.div>
      )}

      {/* Expanded project view — portaled so it centers on the viewport */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {expanded && expandedIndex !== null && (
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 1000,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px",
                }}
              >
                <motion.div
                  aria-hidden
                  onClick={() => setExpandedIndex(null)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.82)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                />
                <motion.div
                  key="panel"
                  role="dialog"
                  aria-label={`${expanded.name} project details`}
                  initial={{ opacity: 0, scale: 0.88, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 16 }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  style={{
                    position: "relative",
                    width: "min(720px, 92vw)",
                    maxHeight: "min(85vh, 640px)",
                    borderRadius: 20,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "#0a0a0a",
                    boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ position: "relative", flex: 1, minHeight: 320, background: "#111" }}>
                    <VideoComponent
                      name1={expanded.name}
                      uRL={expanded.video}
                      source="URL"
                      style={{ width: "100%", height: "100%", minHeight: 320 }}
                    />
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(null)}
                      aria-label="Close expanded view"
                      style={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.15)",
                        background: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(12px)",
                        color: "#F0EBE1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div style={{ padding: "20px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(240,235,225,0.45)",
                      }}
                    >
                      {expanded.tag}
                    </span>
                    <h2
                      style={{
                        fontFamily: "var(--font-anton), sans-serif",
                        fontSize: "2rem",
                        color: "#F0EBE1",
                        margin: "6px 0 10px",
                        letterSpacing: "1px",
                      }}
                    >
                      {expanded.name}
                    </h2>
                    <p
                      style={{
                        color: "rgba(240,235,225,0.7)",
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {expanded.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
