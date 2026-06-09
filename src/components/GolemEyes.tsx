'use client';

import React, { useEffect, useState, useRef } from "react";

export default function GolemEyes() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const leftEyeRef = useRef<SVGCircleElement>(null);
  const rightEyeRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Track vector distances and offset pupils cleanly
  const calculatePupilOffset = (eyeRef: React.RefObject<SVGCircleElement | null>) => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    const rect = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(mousePos.y - eyeCenterY, mousePos.x - eyeCenterX);
    const maxOffsetLimit = 8; // Max movement inside stone sockets
    
    return {
      x: Math.cos(angle) * maxOffsetLimit,
      y: Math.sin(angle) * maxOffsetLimit
    };
  };

  const leftOffset = calculatePupilOffset(leftEyeRef);
  const rightOffset = calculatePupilOffset(rightEyeRef);

  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-35 pointer-events-none select-none z-0">
      <div className="relative w-full max-w-lg aspect-video flex flex-col items-center justify-center">
        
        {/* Mystical Forest Golem Vector Art */}
        <svg 
          viewBox="0 0 400 300" 
          className="w-full h-full text-emerald-500/20 fill-none stroke-current stroke-[3] filter drop-shadow-[0_0_20px_rgba(16,185,129,0.25)]"
        >
          {/* Cracked Stone Head Outline */}
          <path 
            d="M 120 70 C 120 70, 200 40, 280 70 L 310 120 L 300 230 C 300 230, 200 270, 100 230 L 90 120 Z" 
            strokeLinecap="round" 
            strokeWidth="4"
            fill="none"
          />
          
          {/* Moss & Cracked details */}
          <path d="M 150 52 L 155 90 L 140 105" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 270 218 L 255 190 L 265 170" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Aggressive Eyebrows / Ridge */}
          <path d="M 100 115 L 185 135 L 200 150 L 215 135 L 300 115" strokeWidth="5" strokeLinecap="round" fill="none" />

          {/* Left Eye Socket */}
          <circle 
            ref={leftEyeRef} 
            cx="150" 
            cy="165" 
            r="28" 
            className="stroke-emerald-400/40"
            fill="none"
          />
          {/* Left Pupil - Glowing Golem Rune (Amber/Gold Core) */}
          <circle 
            cx={150 + leftOffset.x} 
            cy={165 + leftOffset.y} 
            r="10" 
            fill="#fbbf24"
            stroke="none"
            className="animate-pulse filter drop-shadow-[0_0_12px_#fbbf24]" 
          />

          {/* Right Eye Socket */}
          <circle 
            ref={rightEyeRef} 
            cx="250" 
            cy="165" 
            r="28" 
            className="stroke-emerald-400/40"
            fill="none"
          />
          {/* Right Pupil - Glowing Golem Rune (Amber/Gold Core) */}
          <circle 
            cx={250 + rightOffset.x} 
            cy={165 + rightOffset.y} 
            r="10" 
            fill="#fbbf24"
            stroke="none"
            className="animate-pulse filter drop-shadow-[0_0_12px_#fbbf24]" 
          />

          {/* Stone Nose and Mouth Grits */}
          <path d="M 190 170 L 200 195 L 210 170" strokeWidth="3" fill="none" />
          <path d="M 160 220 L 240 220" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 180 210 L 180 230" strokeWidth="2" fill="none" />
          <path d="M 220 210 L 220 230" strokeWidth="2" fill="none" />
        </svg>

        {/* Overlay ancient text label */}
        <div className="absolute bottom-4 font-mono text-[11px] uppercase tracking-[0.6em] text-emerald-400/40 font-bold">
          Forest Guardian Protocol
        </div>
      </div>
    </div>
  );
}