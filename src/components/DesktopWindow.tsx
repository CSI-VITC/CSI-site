"use client";

import React, { useRef, useState } from "react";
import { motion, useDragControls, AnimatePresence, useMotionValue } from "framer-motion";
import { X, Minus, Maximize2 } from "lucide-react";

interface DesktopWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  isActive: boolean;
  isMinimized?: boolean;
  onFocus: () => void;
  defaultPosition?: { x: number; y: number };
}

export default function DesktopWindow({
  id,
  title,
  children,
  onClose,
  onMinimize,
  isActive,
  isMinimized = false,
  onFocus,
  defaultPosition = { x: 50, y: 50 },
}: DesktopWindowProps) {
  const dragControls = useDragControls();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const [pos, setPos] = useState(defaultPosition);

  // Resizable window dimensions state
  const [size, setSize] = useState({ 
    width: typeof window !== "undefined" ? Math.min(1000, window.innerWidth * 0.85) : 900, 
    height: typeof window !== "undefined" ? Math.min(650, window.innerHeight * 0.75) : 600 
  });

  // Motion values to track drag offset translation independently of absolute coordinates
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);

  const toggleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMaximized(!isMaximized);
  };

  // Drag-to-resize pointer event handler
  const handleResizeStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const startWidth = size.width;
    const startHeight = size.height;
    const startX = e.clientX;
    const startY = e.clientY;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const newWidth = Math.max(400, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(300, startHeight + (moveEvent.clientY - startY));
      setSize({ width: newWidth, height: newHeight });
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // High-acceleration, dampened spring for instant open/restore response
  const snappySpring = {
    type: "spring" as const,
    stiffness: 450,
    damping: 38,
    mass: 0.8,
  };

  // Smooth, premium spring for minimizing (looks like macOS slide & shrink)
  const minimizeSpring = {
    type: "spring" as const,
    stiffness: 140,
    damping: 25,
    mass: 1.1,
  };

  const genieParams = (() => {
    if (typeof window === "undefined") return { targetX: 0, targetY: 800, skew: 0 };
    const screenCenter = window.innerWidth / 2;
    const windowCenter = pos.x + size.width / 2;
    const deltaX = windowCenter - screenCenter;
    
    // Bottom-center of the window should land at dock center
    const targetX = screenCenter - (pos.x + size.width / 2);
    const targetY = window.innerHeight - 35 - (pos.y + size.height);
    
    // Skew is proportional to how far left/right the window is from the dock center
    const maxSkew = 24; 
    const skew = -Math.min(Math.max((deltaX / (window.innerWidth / 2)) * maxSkew, -maxSkew), maxSkew);
    
    return { targetX, targetY, skew };
  })();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ 
        opacity: isMinimized ? 0 : 1, 
        x: isMinimized ? genieParams.targetX : (isMaximized ? -pos.x : 0),
        y: isMinimized ? genieParams.targetY : (isMaximized ? -pos.y : 0),
        scaleX: isMinimized ? 0.05 : 1,
        scaleY: isMinimized ? 0.01 : 1,
        skewX: isMinimized ? genieParams.skew : 0,
        rotate: isMinimized ? genieParams.skew * 0.45 : 0,
        zIndex: isMinimized ? 8 : (isActive ? 110 : 10),
      }}
      transition={isMinimized ? minimizeSpring : snappySpring}
      drag={!isMaximized && !isMinimized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        x: mvX,
        y: mvY,
        width: isMaximized ? "100vw" : size.width,
        height: isMaximized ? "calc(100vh - 48px)" : size.height,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        pointerEvents: isMinimized ? "none" : "auto",
        transformOrigin: isMinimized ? "bottom center" : "center center",
        borderRadius: isMaximized ? "0px" : "22px",
        background: "transparent",
        willChange: "transform, opacity",
      }}
      onDragEnd={() => {
        // Commit drag offset into absolute coordinates, and reset translation values
        const dragX = mvX.get();
        const dragY = mvY.get();
        setPos(prev => ({ x: prev.x + dragX, y: prev.y + dragY }));
        mvX.set(0);
        mvY.set(0);
      }}
      onMouseDown={onFocus}
    >
      {/* Split / Solid Background Layer */}
      {(() => {
        const sidebarWidth = id === "about" ? 220 : id === "contact" ? 200 : 0;
        return (
          <div 
            style={{
              position: "absolute",
              inset: 0,
              zIndex: -1,
              borderRadius: "inherit",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: isActive 
                ? "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)" 
                : "0 10px 30px rgba(0,0,0,0.4)",
              overflow: "hidden",
              display: "flex",
            }}
          >
            {sidebarWidth > 0 ? (
              <>
                {/* Glassmorphic Left Sidebar Panel */}
                <div 
                  style={{
                    width: `${sidebarWidth}px`,
                    height: "100%",
                    backdropFilter: "blur(30px) saturate(160%) brightness(110%)",
                    WebkitBackdropFilter: "blur(30px) saturate(160%) brightness(110%)",
                    background: isActive 
                      ? "rgba(25, 25, 25, 0.55)" 
                      : "rgba(20, 20, 20, 0.45)",
                    borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                    flexShrink: 0,
                  }}
                />
                {/* Solid Right Content Panel */}
                <div 
                  style={{
                    flex: 1,
                    height: "100%",
                    background: isActive ? "#131316" : "#101012",
                  }}
                />
              </>
            ) : (
              /* Solid Full Window Panel */
              <div 
                style={{
                  width: "100%",
                  height: "100%",
                  background: isActive ? "#131316" : "#101012",
                }}
              />
            )}

            {/* Subtle Grain (Performance Optimized) */}
            <div style={{
              position: "absolute",
              inset: 0,
              opacity: 0.015,
              pointerEvents: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }} />
          </div>
        );
      })()}

      {/* Title Bar */}
      <div
        className="window-header"
        onPointerDown={(e) => !isMaximized && dragControls.start(e)}
        onDoubleClick={toggleMaximize}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: isMaximized ? "40px" : "44px",
          background: "transparent",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          position: "relative",
          cursor: isMaximized ? "default" : "grab",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            left: "16px",
            display: "flex",
            gap: "8px",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* Traffic Lights */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="traffic-light close"
            style={{
              width: "12px", height: "12px", borderRadius: "50%",
              background: "#ff5f56", border: "0.5px solid rgba(0,0,0,0.1)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "filter 0.2s"
            }}
          >
            <X size={8} strokeWidth={4} style={{ opacity: isHovered ? 1 : 0, color: "rgba(0,0,0,0.5)", transition: "opacity 0.2s" }} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="traffic-light minimize"
            style={{
              width: "12px", height: "12px", borderRadius: "50%",
              background: "#ffbd2e", border: "0.5px solid rgba(0,0,0,0.1)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "filter 0.2s"
            }}
          >
            <Minus size={8} strokeWidth={4} style={{ opacity: isHovered ? 1 : 0, color: "rgba(0,0,0,0.5)", transition: "opacity 0.2s" }} />
          </button>
          <button
            onClick={toggleMaximize}
            className="traffic-light maximize"
            style={{
              width: "12px", height: "12px", borderRadius: "50%",
              background: "#27c93f", border: "0.5px solid rgba(0,0,0,0.1)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "filter 0.2s"
            }}
          >
            <Maximize2 size={7} strokeWidth={4} style={{ opacity: isHovered ? 1 : 0, color: "rgba(0,0,0,0.5)", transition: "opacity 0.2s" }} />
          </button>
        </div>
        <div style={{ 
          fontSize: "13px", 
          fontWeight: 600, 
          color: isActive ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.4)", 
          letterSpacing: "0.2px", 
          userSelect: "none",
          transition: "color 0.2s"
        }}>
          {title}
        </div>
      </div>

      {/* Content Area */}
      <div
        style={{
          padding: 0,
          overflowY: "auto",
          flex: 1,
          background: "transparent",
          display: "flex",
          flexDirection: "column",
        }}
        className="window-content"
      >
        <div style={{ width: "100%", flex: 1 }}>
          {children}
        </div>
      </div>

      {/* Drag-to-Resize Handle */}
      {!isMaximized && !isMinimized && (
        <div
          onPointerDown={handleResizeStart}
          style={{
            position: "absolute",
            bottom: "0",
            right: "0",
            width: "16px",
            height: "16px",
            cursor: "se-resize",
            zIndex: 100,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            padding: "0 4px 4px 0",
          }}
        >
          {/* Diagonal lines pattern */}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2">
            <line x1="10" y1="0" x2="0" y2="10" />
            <line x1="10" y1="4" x2="4" y2="10" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}
