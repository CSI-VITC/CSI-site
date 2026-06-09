'use client';

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface MightyEagleStrikeProps {
  onComplete: () => void;
}

export default function MightyEagleStrike({ onComplete }: MightyEagleStrikeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const eagleRef = useRef<SVGSVGElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP master cinematic timeline
    const tl = gsap.timeline({
      onComplete: onComplete
    });

    // 1. Initial configuration
    gsap.set(containerRef.current, { backgroundColor: "rgba(0, 0, 0, 0)" });
    gsap.set(eagleRef.current, { scale: 8, opacity: 0, x: -300, y: -400, rotate: -30 });
    gsap.set(flashRef.current, { opacity: 0 });

    // 2. Darkness sets in rapidly
    tl.to(containerRef.current, {
      backgroundColor: "rgba(5, 12, 5, 0.85)",
      duration: 0.25,
      ease: "power2.out"
    })
    
    // 3. Mighty Eagle sweeps through with devastating force
    .to(eagleRef.current, {
      opacity: 0.6,
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0,
      duration: 0.45,
      ease: "power4.in"
    })
    
    // 4. Heavy camera shake on impact
    .to(containerRef.current, {
      x: () => (Math.random() - 0.5) * 30,
      y: () => (Math.random() - 0.5) * 30,
      duration: 0.05,
      repeat: 6,
      yoyo: true,
      ease: "none"
    })
    
    // 5. White screen flash of raw impact power
    .to(flashRef.current, {
      opacity: 1,
      duration: 0.1,
      ease: "power2.out"
    })
    
    // Reset screen shake positions
    .set(containerRef.current, { x: 0, y: 0 })
    
    // 6. Dissolve flash and container cleanly
    .to(flashRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power3.inOut"
    })
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power1.in"
    });

  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none overflow-hidden"
    >
      {/* High-Impact Flash Layer */}
      <div 
        ref={flashRef}
        className="absolute inset-0 bg-white z-[100000] pointer-events-none mix-blend-overlay"
      />

      {/* Cinematic Eagle Vector Shadow */}
      <svg
        ref={eagleRef}
        className="w-[85vw] h-[85vh] text-[#030803] pointer-events-none filter drop-shadow-[0_0_35px_rgba(16,185,129,0.3)]"
        viewBox="0 0 100 100"
      >
        {/* Curved, aggressive silhouette of a diving giant eagle with explicit fill */}
        <path 
          d="M 50 15 
             C 40 28, 15 32, 2 52 
             C 15 50, 32 46, 42 38 
             C 40 48, 38 58, 30 78 
             C 38 72, 45 62, 48 50 
             C 49 53, 49 56, 50 58 
             C 51 56, 51 53, 52 50 
             C 55 62, 62 72, 70 78 
             C 62 58, 60 48, 58 38 
             C 68 46, 85 50, 98 52 
             C 85 32, 60 28, 50 15 Z" 
          fill="#030803"
        />
                 
        {/* Glow-highlighted eyes inside the eagle shadow */}
        <polygon points="46,32 48,34 45,35" fill="#fbbf24" />
        <polygon points="54,32 52,34 55,35" fill="#fbbf24" />
      </svg>
    </div>
  );
}