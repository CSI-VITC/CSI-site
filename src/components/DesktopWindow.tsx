"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useDragControls, useSpring } from "framer-motion";
import TrafficLights from "@/components/TrafficLights";
import { STRIP_LEFT, getMinimizedSlotY } from "@/components/MinimizedWindowStrip";

export const WINDOW_WIDTH = 920;
export const WINDOW_HEIGHT = 620;
export const MENU_BAR_INSET = 28;

interface LaunchOrigin {
  x: number;
  y: number;
}

interface DesktopWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  isActive: boolean;
  isMinimized: boolean;
  isBackground?: boolean;
  onFocus: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  stackIndex: number;
  position: { x: number; y: number };
  minimizedSlotIndex?: number;
  launchOrigin?: LaunchOrigin | null;
  onLaunchComplete?: () => void;
  isRestoring?: boolean;
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
  isBackground = false,
  onFocus,
  onPositionChange,
  stackIndex,
  position,
  minimizedSlotIndex = 0,
  launchOrigin,
  onLaunchComplete,
  isRestoring,
}: DesktopWindowProps) {
  const [isImmersive, setIsImmersive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLaunching, setIsLaunching] = useState(!!launchOrigin);
  const dragControls = useDragControls();
  const savedPosition = useRef({ x: position.x, y: clampY(position.y) });

  const x = useMotionValue(position.x);
  const y = useMotionValue(clampY(position.y));
  const springX = useSpring(x, { stiffness: 380, damping: 32 });
  const springY = useSpring(y, { stiffness: 380, damping: 32 });

  useEffect(() => {
    if (!isActive) setIsImmersive(false);
  }, [isActive]);

  useEffect(() => {
    if (!launchOrigin || isMinimized) return;
    const startX = launchOrigin.x - WINDOW_WIDTH / 2;
    const startY = launchOrigin.y - WINDOW_HEIGHT - 24;
    x.set(startX);
    y.set(startY);
    const t = setTimeout(() => {
      x.set(position.x);
      y.set(position.y);
      setIsLaunching(false);
      onLaunchComplete?.();
    }, 40);
    return () => clearTimeout(t);
  }, [launchOrigin, isMinimized, position.x, position.y, x, y, onLaunchComplete]);

  useEffect(() => {
    if (!isDragging && !isImmersive && !isLaunching) {
      const safeY = clampY(position.y);
      x.set(position.x);
      y.set(safeY);
      savedPosition.current = { x: position.x, y: safeY };
    }
  }, [position.x, position.y, isDragging, isImmersive, isLaunching, x, y, position]);

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
  const receded = !isActive && !isMinimized && isBackground;

  return (
    <motion.div
      layout={false}
      initial={isRestoring ? { opacity: 0, scale: 0.96 } : { opacity: 0, scale: 0.98 }}
      animate={
        isMinimized
          ? {
              opacity: 0,
              scale: 0.06,
              x: STRIP_LEFT,
              y: minimizedY,
            }
          : {
              opacity: isActive ? 1 : receded ? 0.28 : 0.48,
              scale: isActive ? 1 : receded ? 0.86 : 0.92,
              filter: isActive
                ? "blur(0px) brightness(1)"
                : receded
                  ? "blur(12px) brightness(0.72)"
                  : "blur(6px) brightness(0.84)",
            }
      }
      exit={{ opacity: 0, scale: 0.94, filter: "blur(4px)" }}
      transition={
        isMinimized
          ? { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
          : isDragging
            ? { duration: 0 }
            : { duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }
      }
      drag={draggable}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum
      dragTransition={{ power: 0.15, timeConstant: 220 }}
      dragElastic={0.08}
      dragConstraints={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        x: immersive ? 0 : isLaunching || isDragging ? x : springX,
        y: immersive ? 0 : isLaunching || isDragging ? y : springY,
        width: isMinimized ? WINDOW_WIDTH : immersive ? "100%" : WINDOW_WIDTH,
        height: isMinimized ? WINDOW_HEIGHT : immersive ? "100%" : WINDOW_HEIGHT,
        borderRadius: isMinimized ? 12 : immersive ? 0 : 14,
        zIndex: isActive && !isMinimized ? 240 + stackIndex : 30 + stackIndex,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        pointerEvents: isMinimized ? "none" : "auto",
        transformOrigin: "top left",
        boxShadow: isActive
          ? "0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1)"
          : receded
            ? "0 4px 16px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.02)"
            : "0 8px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.03)",
      }}
      className={`glass-panel${!isActive && !isMinimized ? " glass-panel--inactive" : ""}`}
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
          background: isActive ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.03)",
          borderBottom: "1px solid var(--color-border-tertiary)",
          position: "relative",
          flexShrink: 0,
          cursor: immersive ? "default" : isDragging ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none",
          zIndex: 5,
          transition: "background 0.3s ease",
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
            color: isActive ? "var(--color-text-primary)" : "rgba(240,235,225,0.55)",
            letterSpacing: "0.5px",
            pointerEvents: "none",
            maxWidth: "calc(100% - 120px)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            transition: "color 0.3s ease",
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
          opacity: isActive ? 1 : receded ? 0.62 : 0.72,
          transition: "opacity 0.3s ease",
        }}
        className="window-content"
      >
        <div style={{ width: "100%", height: "100%" }}>{children}</div>
      </div>
    </motion.div>
  );
}
