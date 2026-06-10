"use client";

import { useId } from "react";
import { motion } from "framer-motion";

interface NovaRobotProps {
  size?: number;
  floating?: boolean;
  className?: string;
}

export default function NovaRobot({ size = 32, floating = false, className = "" }: NovaRobotProps) {
  const uid = useId().replace(/:/g, "");
  const headId = `nova-head-${uid}`;
  const bodyId = `nova-body-${uid}`;
  const shadowId = `nova-shadow-${uid}`;

  const svg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`nova-robot-svg ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={headId} x1="18" y1="14" x2="46" y2="38">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#eef1f6" />
          <stop offset="100%" stopColor="#d4dbe6" />
        </linearGradient>
        <linearGradient id={bodyId} x1="22" y1="38" x2="42" y2="56">
          <stop offset="0%" stopColor="#f8f9fb" />
          <stop offset="100%" stopColor="#c8d0dc" />
        </linearGradient>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.2" />
        </filter>
      </defs>

      <g filter={`url(#${shadowId})`}>
        {/* Head */}
        <rect x="16" y="18" width="32" height="24" rx="11" fill={`url(#${headId})`} />
        <rect x="16" y="18" width="32" height="24" rx="11" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
        <ellipse cx="24" cy="24" rx="5" ry="2.5" fill="rgba(255,255,255,0.5)" />

        {/* Eyes — friendly dark lenses with soft highlight */}
        <ellipse cx="25" cy="30" rx="4.5" ry="5" fill="#2a2a32" />
        <ellipse cx="39" cy="30" rx="4.5" ry="5" fill="#2a2a32" />
        <circle cx="26" cy="29" r="1.2" fill="rgba(255,255,255,0.85)" />
        <circle cx="40" cy="29" r="1.2" fill="rgba(255,255,255,0.85)" />
        <circle cx="25.5" cy="31" r="0.6" fill="rgba(96,165,250,0.35)" />

        {/* Smile */}
        <path
          d="M 27 36 Q 32 39 37 36"
          stroke="rgba(160,170,185,0.6)"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Neck */}
        <rect x="29" y="42" width="6" height="3" rx="1.5" fill="#b8c2d0" />

        {/* Body */}
        <rect x="21" y="44" width="22" height="12" rx="7" fill={`url(#${bodyId})`} />
        <rect x="21" y="44" width="22" height="12" rx="7" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" />
        <circle cx="32" cy="50" r="2.5" fill="rgba(200,210,225,0.5)" stroke="rgba(180,190,205,0.4)" strokeWidth="0.5" />

        {/* Arms */}
        <rect x="13" y="46" width="6" height="3.5" rx="1.75" fill="#d8dfe8" />
        <rect x="45" y="46" width="6" height="3.5" rx="1.75" fill="#d8dfe8" />
      </g>
    </svg>
  );

  if (!floating) return svg;

  return (
    <motion.div
      className="nova-robot-float"
      animate={{ y: [0, -2.5, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {svg}
    </motion.div>
  );
}
