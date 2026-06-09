'use client';

import React, { useEffect, useState, useRef } from "react";

interface RobotFollowerProps {
  size?: number;
}

export default function RobotFollower({ size = 44 }: RobotFollowerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [eyeBlink, setEyeBlink] = useState(false);
  const [scanBeam, setScanBeam] = useState(false);
  const lastMouseTime = useRef(Date.now());
  const lastX = useRef(0);

  // Eye blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Scan beam animation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanBeam(true);
      setTimeout(() => setScanBeam(false), 800);
    }, 6000 + Math.random() * 4000);
    return () => clearInterval(scanInterval);
  }, []);

  // Mouse tracking
  useEffect(() => {
    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseTime.current = Date.now();
      setIsIdle(false);
      
      // Offset so robot follows slightly beside cursor
      targetX = e.clientX + 20;
      targetY = e.clientY - 20;

      // Determine movement direction
      if (e.clientX < lastX.current - 2) {
        setIsMovingLeft(true);
      } else if (e.clientX > lastX.current + 2) {
        setIsMovingLeft(false);
      }
      lastX.current = e.clientX;
    };

    // Smooth animation loop
    const animate = () => {
      const now = Date.now();
      
      // Check for idle state
      if (now - lastMouseTime.current > 2000) {
        setIsIdle(true);
      }

      // Smooth follow with lerp
      const lerpFactor = 0.12;
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;

      setPosition({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const robotScale = isIdle ? 0.95 : 1;
  const hoverY = isIdle ? -3 : 0;

  return (
    <div
      className="robot-follower"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        transform: `translate3d(${position.x}px, ${position.y}px, 0) scaleX(${isMovingLeft ? -1 : 1}) scale(${robotScale})`,
        willChange: "transform",
        transition: "transform 0.15s ease-out",
      }}
    >
      <style>{`
        @keyframes robot-hover {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes eye-glow {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(0, 242, 254, 0.6)); }
          50% { filter: drop-shadow(0 0 6px rgba(0, 242, 254, 1)); }
        }
        @keyframes scan-beam {
          0% { opacity: 0; transform: scaleX(0) translateY(0); }
          30% { opacity: 0.7; transform: scaleX(1) translateY(0); }
          70% { opacity: 0.4; transform: scaleX(1) translateY(40px); }
          100% { opacity: 0; transform: scaleX(0.5) translateY(60px); }
        }
        @keyframes antenna-pulse {
          0%, 100% { r: 2; fill: #00f2fe; }
          50% { r: 3; fill: #34d399; }
        }
        @keyframes leg-move {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        .robot-body {
          animation: robot-hover 2s ease-in-out infinite;
          animation-play-state: ${isIdle ? 'running' : 'paused'};
        }
        .robot-eye {
          animation: eye-glow 2s ease-in-out infinite;
        }
        .scan-beam {
          animation: scan-beam 0.8s ease-out forwards;
        }
        .antenna-bulb {
          animation: antenna-pulse 1.5s ease-in-out infinite;
        }
      `}</style>

      <div 
        className="robot-body"
        style={{ transform: `translateY(${hoverY}px)` }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          className="filter drop-shadow-[0_4px_10px_rgba(0,242,254,0.3)]"
        >
          <defs>
            <linearGradient id="robotMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a3a3e" />
              <stop offset="50%" stopColor="#0d2528" />
              <stop offset="100%" stopColor="#06181a" />
            </linearGradient>
            <linearGradient id="robotAccent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
            <linearGradient id="eyeGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <filter id="robotGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Shadow */}
          <ellipse cx="50" cy="95" rx="18" ry="4" fill="rgba(0,0,0,0.4)" />

          {/* Left Leg */}
          <rect x="36" y="78" width="6" height="14" rx="2" fill="url(#robotMetal)" stroke="#00f2fe" strokeWidth="0.5" />
          <rect x="34" y="90" width="10" height="4" rx="2" fill="#0d2528" stroke="#00f2fe" strokeWidth="0.5" />

          {/* Right Leg */}
          <rect x="58" y="78" width="6" height="14" rx="2" fill="url(#robotMetal)" stroke="#00f2fe" strokeWidth="0.5" />
          <rect x="56" y="90" width="10" height="4" rx="2" fill="#0d2528" stroke="#00f2fe" strokeWidth="0.5" />

          {/* Body */}
          <rect x="28" y="42" width="44" height="40" rx="10" fill="url(#robotMetal)" stroke="#00f2fe" strokeWidth="1" />
          
          {/* Body detail lines */}
          <line x1="35" y1="52" x2="65" y2="52" stroke="#00f2fe" strokeWidth="0.5" opacity="0.4" />
          <line x1="35" y1="58" x2="65" y2="58" stroke="#00f2fe" strokeWidth="0.5" opacity="0.3" />
          <line x1="35" y1="64" x2="55" y2="64" stroke="#00f2fe" strokeWidth="0.5" opacity="0.3" />

          {/* Chest Panel - LED */}
          <circle cx="62" cy="68" r="4" fill="#00f2fe" opacity="0.8">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="62" cy="68" r="2" fill="#34d399" opacity="0.9" />

          {/* Left Arm */}
          <rect x="18" y="48" width="10" height="22" rx="5" fill="url(#robotMetal)" stroke="#00f2fe" strokeWidth="0.5" />
          <circle cx="23" cy="72" r="5" fill="#0d2528" stroke="#00f2fe" strokeWidth="0.5" />

          {/* Right Arm */}
          <rect x="72" y="48" width="10" height="22" rx="5" fill="url(#robotMetal)" stroke="#00f2fe" strokeWidth="0.5" />
          <circle cx="77" cy="72" r="5" fill="#0d2528" stroke="#00f2fe" strokeWidth="0.5" />

          {/* Head */}
          <rect x="30" y="14" width="40" height="30" rx="12" fill="url(#robotMetal)" stroke="#00f2fe" strokeWidth="1" filter="url(#robotGlow)" />
          
          {/* Head top detail */}
          <rect x="38" y="10" width="24" height="6" rx="3" fill="#0d2528" stroke="#00f2fe" strokeWidth="0.5" />

          {/* Antenna */}
          <line x1="50" y1="10" x2="50" y2="2" stroke="#00f2fe" strokeWidth="1.5" />
          <circle cx="50" cy="2" r="2.5" className="antenna-bulb" />

          {/* Left Eye */}
          <rect x="35" y="24" width="12" height="10" rx="4" fill="#0a1a1c" stroke="#00f2fe" strokeWidth="0.8" />
          <circle 
            cx="41" 
            cy="29" 
            r={eyeBlink ? 1 : 3.5} 
            className="robot-eye"
            fill="url(#eyeGlow)" 
          />
          {!eyeBlink && (
            <circle cx="42.5" cy="27.5" r="1" fill="#ffffff" opacity="0.8" />
          )}

          {/* Right Eye */}
          <rect x="53" y="24" width="12" height="10" rx="4" fill="#0a1a1c" stroke="#00f2fe" strokeWidth="0.8" />
          <circle 
            cx="59" 
            cy="29" 
            r={eyeBlink ? 1 : 3.5} 
            className="robot-eye"
            fill="url(#eyeGlow)" 
          />
          {!eyeBlink && (
            <circle cx="60.5" cy="27.5" r="1" fill="#ffffff" opacity="0.8" />
          )}

          {/* Mouth / Speaker grille */}
          <rect x="42" y="38" width="16" height="3" rx="1.5" fill="#0a1a1c" />
          <line x1="44" y1="39.5" x2="56" y2="39.5" stroke="#00f2fe" strokeWidth="0.5" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
          </line>

          {/* Scanning Beam (conditional) */}
          {scanBeam && (
            <>
              <polygon 
                points="30,42 20,80 40,80" 
                fill="url(#eyeGlow)" 
                className="scan-beam"
                opacity="0.3"
              />
              <polygon 
                points="70,42 60,80 80,80" 
                fill="url(#eyeGlow)" 
                className="scan-beam"
                opacity="0.3"
                style={{ animationDelay: "0.1s" }}
              />
            </>
          )}

          {/* Circuit pattern overlay */}
          <g opacity="0.15">
            <circle cx="32" cy="46" r="2" fill="#00f2fe" />
            <line x1="32" y1="46" x2="32" y2="56" stroke="#00f2fe" strokeWidth="0.5" />
            <circle cx="32" cy="56" r="1.5" fill="#00f2fe" />
            <line x1="68" y1="46" x2="68" y2="52" stroke="#00f2fe" strokeWidth="0.5" />
            <circle cx="68" cy="52" r="2" fill="#00f2fe" />
            <line x1="68" y1="52" x2="60" y2="52" stroke="#00f2fe" strokeWidth="0.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}
