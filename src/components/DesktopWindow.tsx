"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useDragControls } from "framer-motion";
import TrafficLights from "@/components/TrafficLights";
import { STRIP_LEFT, getMinimizedSlotY } from "@/components/MinimizedWindowStrip";

export const WINDOW_WIDTH = 920;
export const WINDOW_HEIGHT = 620;
export const MENU_BAR_INSET = 28;

interface DesktopWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  isActive: boolean;
  isMinimized: boolean;
  onFocus: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  stackIndex: number;
  position: { x: number; y: number };
  minimizedSlotIndex?: number;
}

function clampY(value: number) {
  return Math.max(8, value);
}

export default function DesktopWindow({
  title,
  children,
  onClose,
  onMinimize,
  isActive,
  isMinimized,
  onFocus,
  onPositionChange,
  stackIndex,
  position,
  minimizedSlotIndex = 0,
}: DesktopWindowProps) {
  const [isImmersive, setIsImmersive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useDragControls();
  const savedPosition = useRef({ x: position.x, y: clampY(position.y) });

  const x = useMotionValue(position.x);
  const y = useMotionValue(clampY(position.y));

  useEffect(() => {
    if (!isActive) setIsImmersive(false);
  }, [isActive]);

  useEffect(() => {
    if (!isDragging && !isImmersive) {
      const safeY = clampY(position.y);
      x.set(position.x);
      y.set(safeY);
      savedPosition.current = { x: position.x, y: safeY };
    }
  }, [position.x, position.y, isDragging, isImmersive, x, y, position]);

  const minimizedY = getMinimizedSlotY(minimizedSlotIndex) - MENU_BAR_INSET;

  const restoreWindowPosition = () => {
    const target = savedPosition.current;
    const safeY = clampY(target.y);
    x.set(target.x);
    y.set(safeY);
    savedPosition.current = { x: target.x, y: safeY };
  };

  const handleExpand = () => {
    onFocus();
    if (!isImmersive) {
      savedPosition.current = { x: x.get(), y: clampY(y.get()) };
      setIsImmersive(true);
      return;
    }
    restoreWindowPosition();
    setIsImmersive(false);
  };

  const handleMinimize = () => {
    setIsImmersive(false);
    onMinimize();
  };

  const handleClose = () => {
    setIsImmersive(false);
    onClose();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const nextX = x.get();
    const nextY = clampY(y.get());
    x.set(nextX);
    y.set(nextY);
    const next = { x: nextX, y: nextY };
    savedPosition.current = next;
    onPositionChange(next);
  };

  const immersive = isImmersive && isActive && !isMinimized;
  const draggable = !immersive && !isMinimized;

  return (
    <motion.div
      layout={false}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={
        isMinimized
          ? {
              opacity: 0,
              scale: 0.08,
              x: STRIP_LEFT,
              y: minimizedY,
            }
          : {
              opacity: isActive ? 1 : 0.92,
              scale: 1,
            }
      }
      exit={{ opacity: 0, scale: 0.85 }}
      transition={
        isMinimized
          ? { duration: 0.5, ease: [0.32, 0.72, 0, 1] }
          : isDragging
            ? { duration: 0 }
            : { type: "spring", stiffness: 340, damping: 32 }
      }
      drag={draggable}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        x: immersive ? 0 : x,
        y: immersive ? 0 : y,
        width: isMinimized ? WINDOW_WIDTH : immersive ? "100%" : WINDOW_WIDTH,
        height: isMinimized ? WINDOW_HEIGHT : immersive ? "100%" : WINDOW_HEIGHT,
        borderRadius: isMinimized ? 12 : immersive ? 0 : 14,
        zIndex: isActive && !isMinimized ? 110 + stackIndex : 100 + stackIndex,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        pointerEvents: isMinimized ? "none" : "auto",
        transformOrigin: "top left",
        boxShadow: isActive
          ? "0 28px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)"
          : "0 16px 40px rgba(0,0,0,0.42), 0 0 0 1px rgba(255,255,255,0.05)",
      }}
      className="glass-panel"
    >
      <div
        className={`window-header${isActive ? " window-header--active" : ""}`}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          if (immersive) return;
          onFocus();
          dragControls.start(e);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 20px",
          background: "rgba(255, 255, 255, 0.05)",
          borderBottom: "1px solid var(--color-border-tertiary)",
          position: "relative",
          flexShrink: 0,
          cursor: immersive ? "default" : isDragging ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none",
          zIndex: 5,
        }}
      >
        <div className="window-traffic-lights">
          <TrafficLights
            onClose={handleClose}
            onMinimize={handleMinimize}
            onMaximize={handleExpand}
            isExpanded={immersive}
          />
        </div>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            letterSpacing: "0.5px",
            pointerEvents: "none",
            maxWidth: "calc(100% - 120px)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </div>
      </div>

      <div
        onMouseDown={() => {
          if (!isMinimized) onFocus();
        }}
        style={{
          padding: 0,
          overflowY: "auto",
          flex: 1,
          background: "rgba(5, 5, 5, 0.95)",
          display: "flex",
          justifyContent: "center",
        }}
        className="window-content"
      >
        <div style={{ width: "100%", height: "100%" }}>{children}</div>
      </div>
    </motion.div>
  );
}
