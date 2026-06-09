"use client";

import React, { useRef, useState } from "react";
import { motion, useDragControls } from "framer-motion";
import { ChevronLeft, ChevronRight, CornerDownLeft, Maximize2, Minimize2, X } from "lucide-react";

interface DesktopWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  isActive: boolean;
  onFocus: () => void;
  defaultPosition?: { x: number; y: number };
  isMinimized: boolean;
  onMinimize: () => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
}

export default function DesktopWindow({
  id,
  title,
  children,
  onClose,
  isActive,
  onFocus,
  defaultPosition = { x: 100, y: 100 },
  isMinimized,
  onMinimize,
  onNextPage,
  onPrevPage,
}: DesktopWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ 
        opacity: isMinimized ? 0 : (isActive ? 1 : 0.85), 
        scale: isMinimized ? 0.3 : 1,
        y: isMinimized ? 600 : 0,
        pointerEvents: isMinimized ? "none" : "auto",
        boxShadow: isActive 
          ? "0 30px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)" 
          : "0 15px 30px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)"
      }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      onMouseDown={onFocus}
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      style={{
        position: "fixed",
        top: isMaximized ? 0 : defaultPosition.y,
        left: isMaximized ? 0 : defaultPosition.x,
        width: isMaximized ? "100vw" : "min(900px, 90vw)",
        height: isMaximized ? "calc(100vh - 80px)" : "min(600px, 70vh)",
        zIndex: isActive ? 110 : 10,
        display: "flex",
        flexDirection: "column",
        borderRadius: isMaximized ? "0px" : "16px",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        background: "rgba(10, 10, 10, 0.8)",
      }}
    >
      {/* Title Bar (Drag Handle) */}
      <div
        className="window-header"
        onPointerDown={(e) => !isMaximized && dragControls.start(e)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "14px 20px",
          background: "rgba(255, 255, 255, 0.03)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          position: "relative",
          cursor: isMaximized ? "default" : "grab",
          userSelect: "none",
        }}
      >
        {/* macOS Style Traffic Lights */}
        <div
          style={{
            position: "absolute",
            left: "16px",
            display: "flex",
            gap: "8px",
          }}
        >
          {/* Close */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            style={{
              width: "12px", height: "12px", borderRadius: "50%",
              background: "#ff5f56", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          />
          {/* Minimize */}
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            style={{
              width: "12px", height: "12px", borderRadius: "50%",
              background: "#ffbd2e", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          />
          {/* Maximize */}
          <button
            onClick={(e) => { e.stopPropagation(); handleMaximize(); }}
            style={{
              width: "12px", height: "12px", borderRadius: "50%",
              background: "#27c93f", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          />
        </div>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "rgba(240, 235, 225, 0.9)", letterSpacing: "0.5px" }}>
          {title}
        </div>
      </div>

      {/* Content Area */}
      <div
        style={{
          padding: 0,
          overflowY: "auto",
          flex: 1,
          background: "rgba(5, 5, 5, 0.95)",
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
        className="window-content"
      >
        <div style={{ width: "100%", height: "100%", paddingBottom: "70px" }}>
          {children}
        </div>

        {/* Floating Page Navigation & Back Button */}
        {isActive && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 120,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 16px",
              background: "rgba(20, 20, 20, 0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Previous Page */}
            {onPrevPage && (
              <button
                onClick={(e) => { e.stopPropagation(); onPrevPage(); }}
                style={{
                  background: "transparent", border: "none", color: "rgba(240, 235, 225, 0.6)",
                  cursor: "pointer", display: "flex", alignItems: "center", padding: "4px"
                }}
                title="Previous Page"
              >
                <ChevronLeft size={18} />
              </button>
            )}

            {/* Back to Desktop */}
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                color: "#F0EBE1",
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")}
            >
              <CornerDownLeft size={12} />
              Back to Desktop
            </button>

            {/* Next Page */}
            {onNextPage && (
              <button
                onClick={(e) => { e.stopPropagation(); onNextPage(); }}
                style={{
                  background: "transparent", border: "none", color: "rgba(240, 235, 225, 0.6)",
                  cursor: "pointer", display: "flex", alignItems: "center", padding: "4px"
                }}
                title="Next Page"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
