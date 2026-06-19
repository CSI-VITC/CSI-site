"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef, useState } from "react";

interface DockItemProps {
  id: string;
  label: string;
  iconSrc: string;
  bg?: string;
  onClick: (origin?: { x: number; y: number }) => void;
  mouseX: MotionValue<number>;
}

function DockItem({ id, label, iconSrc, bg, onClick, mouseX, isRunning, isActive }: DockItemProps & { isRunning?: boolean; isActive?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    const rect = ref.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : undefined;
    onClick(origin);
  };

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-120, 0, 120], [44, 54, 44]);
  const width = useSpring(widthSync, { mass: 0.12, stiffness: 180, damping: 18 });

  return (
    <div 
      style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        ref={ref}
        style={{ width, height: width }}
        onClick={handleClick}
        whileTap={{ scale: 0.94 }}
        whileHover={{ y: -1 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className={`dock-item${isActive ? " dock-item--active" : ""}`}
        aria-label={isActive ? `${label} (active)` : label}
        aria-current={isActive ? "true" : undefined}
      >
        <div className="icon-inner" style={{ background: bg || "transparent" }}>
          <img src={iconSrc} alt={label} draggable={false} />
        </div>
        {isRunning && (
          <span
            className={`dock-running-dot${isActive ? " dock-running-dot--active" : ""}`}
            aria-hidden={!isActive}
          />
        )}
      </motion.div>

      {/* Tooltip */}
      <div className={`dock-tooltip ${isHovered ? "visible" : ""}`}>
        {label}
      </div>

      <style jsx>{`
        .dock-item {
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin: 0 5px;
          overflow: visible;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.22);
          transform-origin: bottom;
          background: transparent;
          position: relative;
        }
        .dock-running-dot {
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.45);
        }
        .dock-running-dot--active {
          background: rgba(255, 255, 255, 0.85);
        }
        .icon-inner {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          overflow: hidden;
        }
        .icon-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 14px;
        }
        .dock-tooltip {
          position: absolute;
          top: -55px;
          background: rgba(20, 20, 20, 0.7);
          color: rgba(255, 255, 255, 0.95);
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 500;
          pointer-events: none;
          white-space: nowrap;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
          z-index: 10;
          opacity: 0;
          transform: translateY(10px) scale(0.9);
          transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .dock-tooltip.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      `}</style>
    </div>
  );
}

export default function MacDock({
  onOpen,
  openApps = [],
  activeApp = null,
  items,
  onOpenSpotlight,
}: {
  onOpen: (id: string, origin?: { x: number; y: number }) => void;
  openApps?: string[];
  activeApp?: string | null;
  items?: Array<{ id: string; label: string; iconSrc: string; bg?: string }>;
  onOpenSpotlight?: () => void;
}) {
  const mouseX = useMotionValue(Infinity);

  const dockItems: Array<{ id: string; label: string; iconSrc: string; bg?: string }> = items ?? [
    { id: "about", label: "About", iconSrc: "/icons/Finder.png" },
    { id: "depts", label: "Domains", iconSrc: "/icons/Domains.jpg" },
    { id: "events", label: "Events", iconSrc: "/icons/Calendar.png" },
    { id: "projects", label: "Projects", iconSrc: "/icons/Terminal.png" },
    { id: "resources", label: "Resources", iconSrc: "/icons/Notion.png" },
    { id: "more", label: "Launchpad", iconSrc: "/icons/launchpad.png" },
  ];

  return (
    <div
      className="csi-mac-dock"
      style={{
        position: "fixed",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "flex-end",
        gap: "4px",
        padding: "8px 12px",
        background: "rgba(24, 24, 24, 0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: "24px",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        boxShadow: "0 12px 28px -8px rgba(0, 0, 0, 0.65)",
        zIndex: 100,
        height: "62px",
      }}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {onOpenSpotlight && (
        <button
          type="button"
          className="csi-dock-search"
          onClick={onOpenSpotlight}
          aria-label="Open Spotlight Search"
          title="Search (⌘K)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
      {dockItems.map((item) => (
        <DockItem
          key={item.id}
          id={item.id}
          iconSrc={item.iconSrc}
          label={item.label}
          bg={item.bg}
          onClick={(origin) => onOpen(item.id, origin)}
          mouseX={mouseX}
          isRunning={item.id !== "more" && openApps.includes(item.id)}
          isActive={activeApp === item.id}
        />
      ))}
    </div>
  );
}
