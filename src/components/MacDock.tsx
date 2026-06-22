"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";

interface DockItemProps {
  id: string;
  label: string;
  iconSrc: string;
  bg?: string;
  onClick: () => void;
  mouseX: any;
}

function DockItem({ label, iconSrc, bg, onClick, mouseX }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [50, 80, 50]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 15 });

  return (
    <div 
      style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        ref={ref}
        style={{ width, height: width }}
        onClick={onClick}
        whileTap={{ scale: 0.9 }}
        className="dock-item"
      >
        <div className="icon-inner" style={{ background: bg || "transparent" }}>
          <img src={iconSrc} alt={label} draggable={false} />
        </div>
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
          margin: 0 4px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          transform-origin: bottom;
          background: transparent;
        }
        .icon-inner {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
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

export default function MacDock({ onOpen }: { onOpen: (id: string) => void }) {
  const mouseX = useMotionValue(Infinity);

  const items: Array<{ id: string; label: string; iconSrc: string; bg?: string }> = [
    { id: "about", label: "About", iconSrc: "/icons/Finder.png" },
    { id: "depts", label: "Domains", iconSrc: "/icons/Domains.jpg" },
    { id: "events", label: "Events", iconSrc: "/icons/Calendar.png" },
    { id: "projects", label: "Projects", iconSrc: "/icons/Terminal.png" },
    { id: "more", label: "Launchpad", iconSrc: "/icons/launchpad.png" },
    { id: "terminal", label: "CSI Terminal", iconSrc: "/icons/Terminal.png", bg: "#000000" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "flex-end",
        gap: "4px",
        padding: "10px",
        background: "rgba(30, 30, 30, 0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "28px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0,0,0,0.1)",
        zIndex: 100,
        height: "70px",
      }}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {items.map((item) => (
        <DockItem 
          key={item.id} 
          id={item.id}
          iconSrc={item.iconSrc} 
          label={item.label} 
          bg={item.bg}
          onClick={() => onOpen(item.id)} 
          mouseX={mouseX} 
        />
      ))}
    </div>
  );
}
