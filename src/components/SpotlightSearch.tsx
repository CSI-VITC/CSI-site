"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Terminal, User, Folder, AppWindow } from "lucide-react";

interface SearchItem {
  id: string;
  name: string;
  category: "Applications" | "Members" | "Projects";
  description: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  // Apps
  { id: "about", name: "About Us", category: "Applications", description: "Learn about the CSI Chapter structure, beliefs, and statistics." },
  { id: "depts", name: "Departments", category: "Applications", description: "View specialized domains (Management, Tech, Design, Social)." },
  { id: "events", name: "Events", category: "Applications", description: "Explore photos and highlights of previous hackathons and workshops." },
  { id: "projects", name: "Projects", category: "Applications", description: "Terminal registry of CampusOS, SentinelX, and other builds." },
  { id: "team", name: "Team", category: "Applications", description: "View the core members list and hierarchy." },
  { id: "contact", name: "Contact Mail", category: "Applications", description: "Get in touch or check mailboxes for administrative inbox." },
  { id: "csi", name: "CSI Official Site", category: "Applications", description: "Explore the national body portal in a browser." },
  { id: "neural", name: "Interactive Neural Hub", category: "Applications", description: "Interactive network canvas of CSI VITC members." },
  { id: "terminal", name: "Terminal App", category: "Applications", description: "Interactive unix command shell console." },
  { id: "arcade", name: "Arcade Game", category: "Applications", description: "Play retro neon matrix Snake game." },

  // Members
  { id: "team", name: "Arjun Selvam", category: "Members", description: "President • Web Dev" },
  { id: "team", name: "Karthik Rajan", category: "Members", description: "Vice President • AI/ML" },
  { id: "team", name: "Meera Krishnan", category: "Members", description: "Design Lead • UI/UX" },
  { id: "team", name: "Vikram Anand", category: "Members", description: "Security Lead • Cybersecurity" },
  { id: "team", name: "Priya Nair", category: "Members", description: "Tech Lead • Web Dev" },

  // Projects
  { id: "projects", name: "CampusOS", category: "Projects", description: "Centralized student workflows & management utility." },
  { id: "projects", name: "SentinelX", category: "Projects", description: "Autonomous threat detection laboratory." },
  { id: "projects", name: "LectureLens", category: "Projects", description: "Computer vision live transcript analysis." },
  { id: "projects", name: "Aaroha", category: "Projects", description: "Platform for tech fest registration operations." },
];

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export default function SpotlightSearch({ isOpen, onClose, onSelect }: SpotlightSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter items
  const filtered = SEARCH_ITEMS.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Key listeners
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0));
          break;
        case "Enter":
          if (filtered[selectedIndex]) {
            onSelect(filtered[selectedIndex].id);
            onClose();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, onSelect]);

  const getIcon = (category: string) => {
    switch (category) {
      case "Applications": return <AppWindow size={16} className="text-blue-400" />;
      case "Members": return <User size={16} className="text-green-400" />;
      case "Projects": return <Folder size={16} className="text-yellow-400" />;
      default: return <Terminal size={16} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            zIndex: 1999,
            display: "flex",
            justifyContent: "center",
            paddingTop: "15vh"
          }}
        >
          {/* Main search box */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "600px",
              maxHeight: "420px",
              background: "rgba(25, 25, 25, 0.8)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              borderRadius: "18px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 30px 60px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            {/* Input bar */}
            <div 
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 20px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
              }}
            >
              <Search size={20} color="rgba(255, 255, 255, 0.4)" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Spotlight Search..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#F0EBE1",
                  fontSize: "1.1rem",
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                }}
              />
              <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.3)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", padding: "2px 6px" }}>ESC</span>
            </div>

            {/* Results list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {filtered.length > 0 ? (
                filtered.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <motion.div
                      layout
                      key={item.name + "-" + item.id}
                      onClick={() => {
                        onSelect(item.id);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      style={{
                        padding: "10px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        background: isSelected ? "rgba(255, 255, 255, 0.1)" : "transparent",
                        cursor: "pointer",
                        transition: "background 0.15s ease-out"
                      }}
                    >
                      <div style={{ 
                        width: "32px", 
                        height: "32px", 
                        borderRadius: "8px", 
                        background: "rgba(255, 255, 255, 0.05)", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center" 
                      }}>
                        {getIcon(item.category)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.95rem", fontWeight: 600, color: isSelected ? "#fff" : "#F0EBE1" }}>{item.name}</div>
                        <div style={{ fontSize: "0.8rem", color: isSelected ? "rgba(255,255,255,0.7)" : "rgba(240, 235, 225, 0.4)", marginTop: "2px" }}>{item.description}</div>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{item.category}</span>
                    </motion.div>
                  );
                })
              ) : (
                <div style={{ padding: "40px 0", textAlign: "center", color: "rgba(255, 255, 255, 0.4)", fontSize: "0.95rem" }}>
                  No results found for "{query}"
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
