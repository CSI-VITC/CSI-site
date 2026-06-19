"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Moon, Sun, Wifi, Battery, Volume2, Bluetooth, Share2, Info } from "lucide-react";

import { WallpaperType } from "./Wallpaper";

export default function ActionCenter({ 
  isOpen, 
  onClose,
  currentWallpaper,
  onWallpaperChange
}: { 
  isOpen: boolean; 
  onClose: () => void;
  currentWallpaper: WallpaperType;
  onWallpaperChange: (wallpaper: WallpaperType) => void;
}) {
  const [isDark, setIsDark] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop to close */}
          <div 
            onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 998 }} 
          />
          
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              position: "fixed",
              top: "48px",
              right: "12px",
              width: "320px",
              zIndex: 999,
              borderRadius: "24px",
              overflow: "hidden",
              backdropFilter: "blur(40px) saturate(200%) brightness(110%)",
              WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(110%)",
              background: "rgba(25, 25, 25, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.2)",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {/* Quick Settings Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              <motion.div 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.12)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{ 
                  gridColumn: "span 1", 
                  background: "rgba(255,255,255,0.08)", 
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "16px", 
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Wifi size={14} color="white" />
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 600 }}>Wi-Fi</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Bluetooth size={14} color="white" />
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 600 }}>Bluetooth</div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.12)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{ 
                  gridColumn: "span 1", 
                  background: "rgba(255,255,255,0.08)", 
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "16px", 
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer"
                }}
                onClick={() => setIsDark(!isDark)}
              >
                <motion.div
                  animate={{ rotate: isDark ? 360 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  {isDark ? <Moon size={20} color="#fbbf24" /> : <Sun size={20} color="#fbbf24" />}
                </motion.div>
                <div style={{ fontSize: "11px", fontWeight: 600 }}>{isDark ? "Dark Mode" : "Light Mode"}</div>
              </motion.div>
            </div>

            {/* Display and Sound Sliders */}
            <motion.div 
              whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              style={{ 
                background: "rgba(255,255,255,0.08)", 
                borderRadius: "16px", 
                padding: "12px",
                border: "1px solid rgba(255,255,255,0.05)",
                transition: "background-color 0.2s ease"
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 600, marginBottom: "8px", opacity: 0.6 }}>Display</div>
              <div style={{ height: "24px", background: "rgba(255,255,255,0.1)", borderRadius: "12px", position: "relative", overflow: "hidden", cursor: "pointer" }}>
                <div style={{ width: "70%", height: "100%", background: "white", transition: "width 0.3s ease" }} />
                <Sun size={12} style={{ position: "absolute", left: "8px", top: "6px", color: "rgba(0,0,0,0.4)" }} />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              style={{ 
                background: "rgba(255,255,255,0.08)", 
                borderRadius: "16px", 
                padding: "12px",
                border: "1px solid rgba(255,255,255,0.05)",
                transition: "background-color 0.2s ease"
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 600, marginBottom: "8px", opacity: 0.6 }}>Sound</div>
              <div style={{ height: "24px", background: "rgba(255,255,255,0.1)", borderRadius: "12px", position: "relative", overflow: "hidden", cursor: "pointer" }}>
                <div style={{ width: "45%", height: "100%", background: "white", transition: "width 0.3s ease" }} />
                <Volume2 size={12} style={{ position: "absolute", left: "8px", top: "6px", color: "rgba(0,0,0,0.4)" }} />
              </div>
            </motion.div>

            {/* Desktop Wallpaper Switcher */}
            <div 
              style={{ 
                background: "rgba(255, 255, 255, 0.08)", 
                borderRadius: "16px", 
                padding: "12px", 
                border: "1px solid rgba(255,255,255,0.05)" 
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 600, marginBottom: "8px", opacity: 0.6 }}>Wallpaper</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                {([
                  { id: "neural", label: "Neural Web" },
                  { id: "cyber", label: "Cyber Grid" },
                  { id: "aurora", label: "Aurora Flow" },
                  { id: "charcoal", label: "Charcoal" },
                  { id: "hologram", label: "3D VITC Campus" }
                ] as { id: WallpaperType; label: string }[]).map((wp) => {
                  const isActive = currentWallpaper === wp.id;
                  return (
                    <motion.button
                      key={wp.id}
                      whileHover={{ scale: 1.02, backgroundColor: isActive ? "rgba(59, 130, 246, 0.35)" : "rgba(255,255,255,0.15)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onWallpaperChange(wp.id)}
                      style={{
                        padding: "8px 6px",
                        borderRadius: "10px",
                        border: "1px solid " + (isActive ? "rgba(59, 130, 246, 0.4)" : "rgba(255,255,255,0.06)"),
                        background: isActive ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.04)",
                        color: isActive ? "#60a5fa" : "rgba(255,255,255,0.8)",
                        fontSize: "10px",
                        fontWeight: 600,
                        cursor: "pointer",
                        outline: "none",
                        gridColumn: wp.id === "hologram" ? "span 2" : "auto",
                        transition: "all 0.2s ease"
                      }}
                    >
                      {wp.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Club Info Widget */}
            <motion.div 
              whileHover={{ scale: 1.01, filter: "brightness(1.1)" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ 
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(147, 51, 234, 0.25))", 
                borderRadius: "16px", 
                padding: "14px", 
                border: "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700 }}>Club Status</div>
                <Info size={14} opacity={0.5} />
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800 }}>ACTIVE</div>
              <div style={{ fontSize: "10px", opacity: 0.7, marginTop: "4px" }}>3 Upcoming Events • 12 Projects Live</div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
