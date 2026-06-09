'use client';

import React, { useEffect, useState } from "react";

export default function BirdFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMovingLeft, setIsMovingLeft] = useState(false);

  useEffect(() => {
    let lastX = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Slight offset so the bird flies just above and to the side of the cursor
      const targetX = e.clientX + 15;
      const targetY = e.clientY - 25;
      
      setPosition({ x: targetX, y: targetY });
      
      // Determine flight direction to flip the sprite automatically
      if (e.clientX < lastX) {
        setIsMovingLeft(true);
      } else if (e.clientX > lastX) {
        setIsMovingLeft(false);
      }
      lastX = e.clientX;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-transform duration-500 ease-out will-change-transform"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) scaleX(${isMovingLeft ? -1 : 1})`,
      }}
    >
      {/* Custom Vector CSS/SVG Mini Red Bird with explicit fills */}
      <svg width="40" height="40" viewBox="0 0 100 100" className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
        {/* Main round bird body */}
        <circle cx="50" cy="50" r="35" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
        {/* Soft cream underbelly */}
        <path d="M 22 65 C 30 85, 70 85, 78 65 C 70 55, 30 55, 22 65 Z" fill="#fefcf0" />
        {/* Angry black thick eyebrows */}
        <path d="M 25 32 L 50 42 L 75 32 L 70 26 L 50 36 L 30 26 Z" fill="#171717" />
        {/* Giant curious eyes */}
        <circle cx="38" cy="44" r="9" fill="#ffffff" />
        <circle cx="39" cy="44" r="4" fill="#000000" />
        <circle cx="62" cy="44" r="9" fill="#ffffff" />
        <circle cx="61" cy="44" r="4" fill="#000000" />
        {/* Sharp orange beak */}
        <polygon points="40,48 60,48 50,65" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        {/* Black tail feathers */}
        <path d="M 15 50 L -2 45 L 5 52 L -5 55 L 15 58 Z" fill="#171717" />
      </svg>
    </div>
  );
}