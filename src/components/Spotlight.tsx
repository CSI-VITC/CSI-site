"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SpotlightItem {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
}

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: (id: string) => void;
}

const items: SpotlightItem[] = [
  { id: "about",    label: "About Us",        subtitle: "Who we are and what we believe",         icon: "/icons/Finder.png" },
  { id: "depts",    label: "Departments",     subtitle: "Our technical domains and divisions",     icon: "/icons/Domains.jpg" },
  { id: "events",   label: "Events",          subtitle: "Hackathons, workshops and more",          icon: "/icons/Calendar.png" },
  { id: "projects", label: "Projects",        subtitle: "What our members have built",             icon: "/icons/Terminal.png" },
  { id: "team",     label: "Team",            subtitle: "The people behind CSI VITC",             icon: "/icons/Notion.png" },
  { id: "contact",  label: "Contact",         subtitle: "Get in touch with us",                   icon: "/icons/Mail.png" },
  { id: "csi",      label: "CSI Official",    subtitle: "Visit the official CSI India website",   icon: "/icons/CSI.png" },
];

export default function Spotlight({ isOpen, onClose, onOpen }: SpotlightProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim() === ""
    ? items
    : items.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      );

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        if (filtered[selectedIndex]) {
          handleSelect(filtered[selectedIndex].id);
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, filtered, selectedIndex]);

  const handleSelect = (id: string) => {
    onOpen(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              zIndex: 200,
            }}
          />

          {/* Spotlight Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(580px, 90vw)",
              zIndex: 201,
              borderRadius: "16px",
              overflow: "hidden",
              background: "rgba(18, 18, 18, 0.85)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 32px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            {/* Search Input Row */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 20px",
              borderBottom: filtered.length > 0 ? "1px solid rgba(255, 255, 255, 0.07)" : "none",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(240,235,225,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search sections..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#F0EBE1",
                  fontSize: "1.05rem",
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  letterSpacing: "0.2px",
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "rgba(240,235,225,0.3)", display: "flex", alignItems: "center" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </button>
              )}
            </div>

            {/* Results */}
            <AnimatePresence mode="wait">
              {filtered.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ padding: "8px" }}
                >
                  {filtered.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => handleSelect(item.id)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        background: selectedIndex === i ? "rgba(255, 255, 255, 0.1)" : "transparent",
                        transition: "background 0.1s",
                      }}
                    >
                      <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        background: selectedIndex === i ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.1rem",
                        flexShrink: 0,
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}>
                        <img src={item.icon} alt={item.label} style={{ width: "22px", height: "22px", objectFit: "contain" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: "0.92rem",
                          fontWeight: 500,
                          color: selectedIndex === i ? "#F0EBE1" : "rgba(240,235,225,0.85)",
                          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                        }}>
                          {item.label}
                        </div>
                        <div style={{
                          fontSize: "0.78rem",
                          color: "rgba(240,235,225,0.4)",
                          marginTop: "2px",
                          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {item.subtitle}
                        </div>
                      </div>
                      {selectedIndex === i && (
                        <kbd style={{
                          fontSize: "0.7rem",
                          color: "rgba(240,235,225,0.35)",
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "5px",
                          padding: "2px 7px",
                          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                          flexShrink: 0,
                        }}>
                          ↵
                        </kbd>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    padding: "32px 20px",
                    textAlign: "center",
                    color: "rgba(240,235,225,0.3)",
                    fontSize: "0.9rem",
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  }}
                >
                  No results for "{query}"
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer hint */}
            <div style={{
              padding: "10px 20px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              gap: "16px",
              alignItems: "center",
            }}>
              {[
                { key: "↑↓", label: "navigate" },
                { key: "↵", label: "open" },
                { key: "esc", label: "close" },
              ].map(({ key, label }) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <kbd style={{
                    fontSize: "0.68rem",
                    color: "rgba(240,235,225,0.35)",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: "4px",
                    padding: "1px 6px",
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  }}>{key}</kbd>
                  <span style={{ fontSize: "0.7rem", color: "rgba(240,235,225,0.25)", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}