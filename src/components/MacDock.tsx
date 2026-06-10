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
    const bounds = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: 0,
    };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [50, 80, 50]);

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 200,
    damping: 15,
  });

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        ref={ref}
        style={{
          width,
          height: width,
        }}
        onClick={onClick}
        whileHover={{
          y: -8,
          scale: 1.08,
        }}
        whileTap={{
          scale: 0.92,
          y: -12,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 18,
        }}
        className="dock-item"
      >
        <div
          className="icon-inner"
          style={{
            background: bg || "transparent",
          }}
        >
          <img src={iconSrc} alt={label} draggable={false} />
        </div>
      </motion.div>

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
          transform-origin: bottom;
          background: transparent;

          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

          transition:
            box-shadow 0.25s ease,
            filter 0.25s ease;
        }

        .dock-item:hover {
          box-shadow:
            0 12px 30px rgba(255, 255, 255, 0.12),
            0 8px 20px rgba(0, 0, 0, 0.45);

          filter: brightness(1.08);
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
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            sans-serif;
          font-weight: 500;
          pointer-events: none;
          white-space: nowrap;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
          z-index: 10;

          opacity: 0;
          transform: translateY(10px) scale(0.9);

          transition:
            opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dock-tooltip.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      `}</style>
    </div>
  );
}