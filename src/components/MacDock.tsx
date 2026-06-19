"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface DockItemProps {
  id: string;
  label: string;
  iconSrc: string;
  bg?: string;
  isOpen?: boolean;
  onClick: () => void;
  mouseX: any;
}

function DockItem({ id, label, iconSrc, bg, isOpen, onClick, mouseX }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const prevIsOpen = useRef(isOpen);

  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 1500);
      return () => clearTimeout(timer);
    }
    prevIsOpen.current = isOpen;
  }, [isOpen]);

  const widthSync = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    const dist = val - bounds.x - bounds.width / 2;
    
    const baseSize = 50;
    const maxGrowth = 30; // Max icon size is 80px
    const range = 160;   // Magnification bubble radius in pixels
    
    if (Math.abs(dist) < range) {
      const progress = Math.abs(dist) / range;
      // Raised cosine (Hanning) window function for smooth slope transition at peak & edges
      const factor = 0.5 * (1 + Math.cos(progress * Math.PI));
      return baseSize + maxGrowth * factor;
    }
    
    return baseSize;
  });

  const width = useSpring(widthSync, { mass: 0.1, stiffness: 220, damping: 16 });

  return (
    <div 
      style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        ref={ref}
        style={{ width, height: width }}
        onClick={onClick}
        whileTap={{ scale: 0.9 }}
        animate={isBouncing ? {
          y: [0, -18, 0, -10, 0, -4, 0],
        } : {
          y: 0
        }}
        transition={isBouncing ? {
          duration: 1.5,
          times: [0, 0.22, 0.4, 0.6, 0.78, 0.9, 1],
          ease: "easeInOut",
        } : {
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        className="dock-item"
      >
        <div className="icon-inner" style={{ background: bg || "transparent" }}>
          <img src={iconSrc} alt={label} draggable={false} />
        </div>
      </motion.div>

      {/* Active Dot */}
      {isOpen && (
        <div style={{ width: "4px", height: "4px", background: "white", borderRadius: "50%", marginTop: "4px", position: "absolute", bottom: "-8px" }} />
      )}

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
          top: -65px;
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
  openApps, 
  isChallengeUnlocked 
}: { 
  onOpen: (id: string) => void; 
  openApps: string[]; 
  isChallengeUnlocked?: boolean;
}) {
  const mouseX = useMotionValue(Infinity);

  const pinnedItems: Array<{ id: string; label: string; iconSrc: string; bg?: string }> = [
    { id: "about", label: "About Us", iconSrc: "/icons/Readme_Doodle.svg" },
    { id: "projects", label: "Projects", iconSrc: "/icons/Projects_Doodle.svg" },
    { id: "terminal", label: "Terminal", iconSrc: "/icons/Terminal_Doodle.svg" },
    { id: "contact", label: "Contact", iconSrc: "/icons/Mail_Doodle.svg" },
   ];
 
   const dynamicItems: Array<{ id: string; label: string; iconSrc: string; bg?: string }> = [
    { id: "depts", label: "Domains", iconSrc: "/icons/Domains_Doodle.svg" },
    { id: "events", label: "Events", iconSrc: "/icons/Events_Doodle.svg" },
    { id: "arcade", label: "Arcade Game", iconSrc: "/icons/Arcade_Doodle.svg" },
    { id: "editor", label: "Code Editor", iconSrc: "/icons/Editor_Doodle.svg" },
    { id: "team", label: "Team", iconSrc: "/icons/Team_Doodle.svg" },
    { id: "neural", label: "Neural Hub", iconSrc: "/icons/Neural_Doodle.svg" },
    { id: "csi", label: "CSI Official", iconSrc: "/icons/CSI_Doodle.svg" },
    ...(isChallengeUnlocked ? [{ id: "ticket", label: "VIP Ticket", iconSrc: "/icons/Ticket_Doodle.svg" }] : []),
   ];
 
   const items = [
     ...pinnedItems,
     ...dynamicItems.filter(item => openApps.includes(item.id)),
    { id: "more", label: "Launchpad", iconSrc: "/icons/Launchpad_Doodle.svg" },
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
          isOpen={openApps.includes(item.id)}
          onClick={() => onOpen(item.id)} 
          mouseX={mouseX} 
        />
      ))}
    </div>
  );
}
