"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAnimationFrame } from "framer-motion";

export default function ForestBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Bird references and states for performant physics
  const bird1Ref = useRef<SVGGElement>(null);
  const bird2Ref = useRef<SVGGElement>(null);
  const bird3Ref = useRef<SVGGElement>(null);

  const birdStates = useRef([
    { isFlying: false, x: 280, y: 760, startX: 280, startY: 760, vx: 0, vy: 0, angle: 0 },
    { isFlying: false, x: 1620, y: 640, startX: 1620, startY: 640, vx: 0, vy: 0, angle: 0 },
    { isFlying: false, x: 960, y: 350, startX: 960, startY: 350, vx: 0, vy: 0, angle: 0 },
  ]);

  // Actual screen mouse coords mapped for the bird trajectory
  const rawMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      rawMousePos.current = { x: e.clientX, y: e.clientY };

      // Parallax ratio [-0.5, 0.5]
      setMousePosition({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Frame loop for high-performance physics of launching birds
  useAnimationFrame(() => {
    if (!svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    if (!svgRect.width || !svgRect.height) return;

    // Convert screen mouse coordinates to SVG coordinate system (viewBox is 1920x1080)
    const svgMouseX = ((rawMousePos.current.x - svgRect.left) / svgRect.width) * 1920;
    const svgMouseY = ((rawMousePos.current.y - svgRect.top) / svgRect.height) * 1080;

    const refs = [bird1Ref, bird2Ref, bird3Ref];

    birdStates.current.forEach((bird, index) => {
      const el = refs[index].current;
      if (!el) return;

      if (bird.isFlying) {
        // Apply velocity
        bird.x += bird.vx;
        bird.y += bird.vy;
        // Gravity effect
        bird.vy += 0.35;

        // Angle aligned with flight path
        const flightAngle = Math.atan2(bird.vy, bird.vx) * (180 / Math.PI);
        
        el.setAttribute(
          "transform",
          `translate(${bird.x}, ${bird.y}) rotate(${flightAngle})`
        );

        // Reset bird if it leaves screen boundaries
        if (
          bird.y > 1200 || 
          bird.x < -100 || 
          bird.x > 2020
        ) {
          bird.isFlying = false;
          bird.x = bird.startX;
          bird.y = bird.startY;
          bird.vx = 0;
          bird.vy = 0;
          bird.angle = 0;
          el.setAttribute("transform", `translate(${bird.startX}, ${bird.startY})`);
        }
      } else {
        // Non-flying, tilt slightly towards the cursor to look interactive
        const dx = svgMouseX - bird.startX;
        const dy = svgMouseY - bird.startY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 400) {
          const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
          bird.angle += (targetAngle - bird.angle) * 0.12;
        } else {
          bird.angle += (0 - bird.angle) * 0.08;
        }

        el.setAttribute(
          "transform",
          `translate(${bird.startX}, ${bird.startY}) rotate(${bird.angle})`
        );
      }
    });
  });

  // Launch bird logic
  const launchBird = (index: number) => {
    if (!svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const bird = birdStates.current[index];
    if (bird.isFlying) return;

    const svgMouseX = ((rawMousePos.current.x - svgRect.left) / svgRect.width) * 1920;
    const svgMouseY = ((rawMousePos.current.y - svgRect.top) / svgRect.height) * 1080;

    const dx = svgMouseX - bird.startX;
    const dy = svgMouseY - bird.startY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const maxVelocity = 28;
    const speedFactor = 0.075;
    const launchSpeed = Math.min(dist * speedFactor, maxVelocity);
    
    const angle = Math.atan2(dy, dx);
    bird.vx = Math.cos(angle) * launchSpeed;
    bird.vy = Math.sin(angle) * launchSpeed;
    bird.isFlying = true;
  };

  const layerX = (multiplier: number) => mousePosition.x * multiplier;
  const layerY = (multiplier: number) => mousePosition.y * multiplier;

  return (
    <div 
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      style={{
        background: "radial-gradient(circle at 50% 30%, #0f4c3e 0%, #051c17 55%, #020706 100%)"
      }}
    >
      {/* Inject encapsulated animations for clouds, river flow, ripples, and falling leaves */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cloud-drift-slow {
          0% { transform: translate(-50px, 0); }
          50% { transform: translate(50px, 0); }
          100% { transform: translate(-50px, 0); }
        }
        @keyframes cloud-drift-fast {
          0% { transform: translate(-80px, 0); }
          50% { transform: translate(80px, 0); }
          100% { transform: translate(-80px, 0); }
        }
        @keyframes flow-lines {
          from { stroke-dashoffset: 150; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes ripple-wave {
          0% { r: 5px; opacity: 0.8; }
          100% { r: 60px; opacity: 0; }
        }
        @keyframes leaf-fall-left {
          0% { transform: translate(0px, -20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.75; }
          90% { opacity: 0.75; }
          100% { transform: translate(180px, 950px) rotate(540deg); opacity: 0; }
        }
        @keyframes leaf-fall-right {
          0% { transform: translate(0px, -20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.75; }
          90% { opacity: 0.75; }
          100% { transform: translate(-180px, 980px) rotate(-480deg); opacity: 0; }
        }
        .cloud-slow { animation: cloud-drift-slow 35s ease-in-out infinite; }
        .cloud-fast { animation: cloud-drift-fast 24s ease-in-out infinite; }
        .flow-line { stroke-dasharray: 25, 45; animation: flow-lines 3.5s linear infinite; }
        .ripple-circle { animation: ripple-wave 4s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; }
        .leaf-anim-1 { animation: leaf-fall-left 12s linear infinite; }
        .leaf-anim-2 { animation: leaf-fall-right 15s linear infinite; }
        .leaf-anim-3 { animation: leaf-fall-left 18s linear infinite; }
        .leaf-anim-4 { animation: leaf-fall-right 14s linear infinite; }
      `}} />

      {/* Atmospheric God-Rays */}
      <div 
        className="absolute inset-0 opacity-35 mix-blend-screen"
        style={{
          background: "repeating-linear-gradient(65deg, transparent, transparent 50px, #10b981 100px, transparent 150px)",
          maskImage: "radial-gradient(circle at 50% 0%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 0%, black 30%, transparent 80%)",
          filter: "blur(20px)",
          transform: `translate3d(${layerX(6)}px, ${layerY(4)}px, 0)`,
          willChange: "transform"
        }}
      />

      <svg
        ref={svgRef}
        viewBox="0 0 1920 1080"
        className="absolute inset-0 w-full h-full"
        style={{ minWidth: "100%", minHeight: "100%" }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Glowing Filters */}
          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Sky Gradient */}
          <linearGradient id="sky-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#082822" />
            <stop offset="45%" stopColor="#051a16" />
            <stop offset="100%" stopColor="#020807" />
          </linearGradient>

          {/* Mountains Gradients */}
          <linearGradient id="mountains-distant-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5a6b6f" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#051a16" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="mountains-far-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3a4f4d" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#051a16" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="mountains-mid-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a605a" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#2c3f39" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#03120e" stopOpacity="0.55" />
          </linearGradient>

          <linearGradient id="mountains-foreground-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b6f47" /> {/* Warm Earth brown */}
            <stop offset="35%" stopColor="#654321" />
            <stop offset="100%" stopColor="#03120e" />
          </linearGradient>

          {/* River Water Gradients */}
          <linearGradient id="river-water-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87ceeb" stopOpacity="0.75" />  {/* Sky reflection */}
            <stop offset="50%" stopColor="#00f2fe" stopOpacity="0.85" /> {/* Cyan deep flow */}
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.75" /> {/* Moss green edge */}
          </linearGradient>

          <linearGradient id="river-shadow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#063229" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#020807" stopOpacity="0.4" />
          </linearGradient>

          {/* Foam & Wave Patterns */}
          <linearGradient id="wave-foam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Birds Gradients */}
          <linearGradient id="bird-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          <linearGradient id="bird-red-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>

          <linearGradient id="bird-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="1920" height="1080" fill="url(#sky-grad)" />

        {/* Clouds & Atmospheres */}
        <g id="clouds" opacity="0.3">
          {/* Cloud 1 */}
          <path 
            className="cloud-slow" 
            d="M200,150 Q280,120 350,150 T500,150 T600,180 L600,220 L200,220 Z" 
            fill="#d4e8f1" 
            opacity="0.3" 
          />
          {/* Cloud 2 */}
          <path 
            className="cloud-fast" 
            d="M1300,100 Q1360,70 1420,100 T1550,100 T1650,120 L1650,160 L1300,160 Z" 
            fill="#d4e8f1" 
            opacity="0.25" 
          />
        </g>

        {/* LAYER 1: Distant Mountains (Faintest silhouette) */}
        <g 
          style={{ 
            transform: `translate3d(${layerX(4)}px, ${layerY(3)}px, 0)`,
            transition: "transform 0.1s ease-out"
          }}
        >
          <polygon 
            points="0,600 250,450 400,500 600,380 800,480 1000,400 1200,520 1400,420 1600,500 1800,380 1920,500 1920,1080 0,1080"
            fill="url(#mountains-distant-grad)"
          />
        </g>

        {/* LAYER 2: Far Mountains */}
        <g 
          style={{ 
            transform: `translate3d(${layerX(8)}px, ${layerY(6)}px, 0)`,
            transition: "transform 0.1s ease-out"
          }}
        >
          <polygon 
            points="0,650 200,500 350,550 500,450 650,520 850,400 1000,480 1200,420 1400,500 1600,450 1800,520 1920,450 1920,1080 0,1080"
            fill="url(#mountains-far-grad)"
          />
          {/* Ridge shadows for definition */}
          <path d="M 400,500 L 350,550 L 400,550 Z" fill="#031411" opacity="0.25" />
          <path d="M 850,400 L 800,480 L 900,480 Z" fill="#031411" opacity="0.2" />
        </g>

        {/* LAYER 3: Mid Mountains (Primary range with Snow Peak hints) */}
        <g 
          style={{ 
            transform: `translate3d(${layerX(14)}px, ${layerY(11)}px, 0)`,
            transition: "transform 0.1s ease-out"
          }}
        >
          <polygon 
            points="0,650 150,520 300,480 450,420 600,500 750,380 900,460 1050,400 1200,480 1350,420 1500,500 1650,450 1800,520 1920,480 1920,1080 0,1080"
            fill="url(#mountains-mid-grad)"
          />
          {/* Snow Peaks */}
          <polygon points="450,420 430,440 470,440" fill="#e8f8f5" opacity="0.5" />
          <polygon points="750,380 720,410 780,410" fill="#e8f8f5" opacity="0.45" />
          <polygon points="1050,400 1020,430 1080,430" fill="#e8f8f5" opacity="0.5" />
          
          {/* Valleys */}
          <path d="M 300,480 Q 350,500 400,480" stroke="#041f1a" strokeWidth="2.5" fill="none" opacity="0.3" />
          <path d="M 900,460 Q 950,490 1000,460" stroke="#041f1a" strokeWidth="2.5" fill="none" opacity="0.25" />
        </g>

        {/* LAYER 4: Foreground Mountains (Earth/Brown tones, crevasses, shadowing) */}
        <g 
          style={{ 
            transform: `translate3d(${layerX(22)}px, ${layerY(17)}px, 0)`,
            transition: "transform 0.1s ease-out"
          }}
        >
          <polygon 
            points="0,620 100,480 200,520 350,350 500,480 650,400 800,520 950,380 1100,500 1250,420 1400,520 1550,400 1700,520 1850,450 1920,520 1920,1080 0,1080"
            fill="url(#mountains-foreground-grad)"
          />
          {/* Major Crevasses and Valleys */}
          <polygon points="350,350 330,420 380,420 380,380" fill="#20150b" opacity="0.45" />
          <polygon points="950,380 920,480 1000,480 1000,420" fill="#20150b" opacity="0.4" />
          {/* Peak Highlights */}
          <polygon points="350,350 320,380 380,380" fill="#c4b5a0" opacity="0.65" />
          <polygon points="950,380 915,430 985,430" fill="#c4b5a0" opacity="0.6" />
        </g>

        {/* LAYER 5: Winding River System (Water flow foam, ripple animations) */}
        <g 
          style={{ 
            transform: `translate3d(${layerX(30)}px, ${layerY(24)}px, 0)`,
            transition: "transform 0.1s ease-out"
          }}
        >
          {/* Main Water Body */}
          <path 
            id="river-curve-main"
            d="M 960,460 Q 820,550 620,670 Q 420,790 200,980 L 320,1080 Q 550,910 780,780 Q 980,680 960,560 Z"
            fill="url(#river-water-grad)"
            filter="url(#glow-cyan)"
          />
          {/* Left Bank Shadow */}
          <path 
            d="M 960,460 Q 820,550 620,670 Q 420,790 200,980 L 180,1000 Q 400,810 600,690 Q 800,570 960,480 Z"
            fill="url(#river-shadow-grad)"
            opacity="0.35"
          />

          {/* Water Flow lines */}
          <g opacity="0.5">
            <path d="M 960,470 Q 820,560 620,680" stroke="url(#wave-foam)" strokeWidth="6" fill="none" className="flow-line" />
            <path d="M 950,510 Q 800,605 590,730" stroke="url(#wave-foam)" strokeWidth="4.5" fill="none" className="flow-line" style={{ animationDelay: "0.8s" }} />
            <path d="M 970,540 Q 830,630 650,760" stroke="url(#wave-foam)" strokeWidth="4" fill="none" className="flow-line" style={{ animationDelay: "1.6s" }} />
          </g>

          {/* Water Ripple Circles */}
          <g opacity="0.4">
            <circle cx="680" cy="720" r="15" stroke="#ffffff" strokeWidth="1.5" fill="none" className="ripple-circle" />
            <circle cx="450" cy="850" r="12" stroke="#ffffff" strokeWidth="1" fill="none" className="ripple-circle" style={{ animationDelay: "1.2s" }} />
            <circle cx="820" cy="620" r="18" stroke="#ffffff" strokeWidth="2" fill="none" className="ripple-circle" style={{ animationDelay: "2.4s" }} />
          </g>
        </g>

        {/* LAYER 6: Symmetrical Side Tree Frameworks */}
        <g 
          style={{ 
            transform: `translate3d(${layerX(35)}px, ${layerY(28)}px, 0)`,
            transition: "transform 0.1s ease-out"
          }}
        >
          {/* Left Pine Trees Structure (Frames the window left boundary) */}
          <g fill="#02120e">
            {/* Tree 1 */}
            <path d="M0,450 L60,520 L40,520 L90,580 L60,580 L120,660 L80,660 L160,780 L50,780 L50,1080 L0,1080 Z" />
            {/* Tree 2 */}
            <path d="M120,530 L160,590 L145,590 L185,650 L165,650 L215,730 L185,730 L255,840 L130,840 L130,1080 L100,1080 Z" />
          </g>

          {/* Right Pine Trees Structure (Frames the window right boundary) */}
          <g fill="#02120e">
            {/* Tree 1 */}
            <path d="M1920,380 L1860,450 L1880,450 L1830,510 L1860,510 L1800,590 L1840,590 L1760,710 L1870,710 L1870,1080 L1920,1080 Z" />
            {/* Tree 2 */}
            <path d="M1800,470 L1750,535 L1765,535 L1715,600 L1735,600 L1675,690 L1710,690 L1630,810 L1770,810 L1770,1080 L1800,1080 Z" />
          </g>
        </g>

        {/* LAYER 7: Perching Branches & Seasonal Floating Leaves */}
        <g 
          style={{ 
            transform: `translate3d(${layerX(40)}px, ${layerY(32)}px, 0)`,
            transition: "transform 0.1s ease-out"
          }}
        >
          {/* Left Branch for Bird 1 */}
          <path d="M 0,720 Q 140,790 320,770" stroke="#020d0a" strokeWidth="15" strokeLinecap="round" fill="none" />
          <path d="M 160,755 Q 230,715 270,720" stroke="#020d0a" strokeWidth="7" strokeLinecap="round" fill="none" />
          {/* Left Leaves */}
          <ellipse cx="230" cy="735" rx="10" ry="5" fill="#10b981" transform="rotate(-20 230 735)" />
          <ellipse cx="270" cy="720" rx="12" ry="6" fill="#34d399" transform="rotate(-10 270 720)" />
          <ellipse cx="320" cy="770" rx="14" ry="7" fill="#10b981" transform="rotate(15 320 770)" />
          <ellipse cx="350" cy="780" rx="12" ry="6" fill="#00f2fe" filter="url(#glow-cyan)" />

          {/* Right Branch for Bird 2 */}
          <path d="M 1920,590 Q 1750,670 1620,650" stroke="#020d0a" strokeWidth="13" strokeLinecap="round" fill="none" />
          <path d="M 1740,630 Q 1680,580 1620,590" stroke="#020d0a" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Right Leaves */}
          <ellipse cx="1680" cy="600" rx="11" ry="5" fill="#10b981" transform="rotate(25 1680 600)" />
          <ellipse cx="1620" cy="590" rx="12" ry="6" fill="#34d399" transform="rotate(35 1620 590)" />
          <ellipse cx="1580" cy="655" rx="13" ry="6" fill="#fbbf24" transform="rotate(-15 1580 655)" filter="url(#glow-gold)" />

          {/* Fireflies floating around */}
          <circle cx="180" cy="670" r="3" fill="#fbbf24" className="animate-pulse" style={{ animationDuration: "1.8s" }} />
          <circle cx="410" cy="730" r="2.5" fill="#10b981" className="animate-ping" style={{ animationDuration: "2.5s" }} />
          <circle cx="1500" cy="580" r="3" fill="#fbbf24" className="animate-pulse" style={{ animationDuration: "3s" }} />
          <circle cx="1780" cy="510" r="2" fill="#00f2fe" className="animate-ping" style={{ animationDuration: "1.5s" }} />

          {/* Floating Leaves (Animated across screen) */}
          <g opacity="0.6">
            <path d="M 50,0 Q 80,10 60,30 Q 30,20 50,0 Z" fill="#10b981" className="leaf-anim-1" style={{ transformOrigin: "50px 0" }} />
            <path d="M 1800,0 Q 1830,10 1810,30 Q 1780,20 1800,0 Z" fill="#fbbf24" className="leaf-anim-2" style={{ transformOrigin: "1800px 0" }} />
            <path d="M 700,-50 Q 730,-40 710,-20 Q 680,-30 700,-50 Z" fill="#34d399" className="leaf-anim-3" style={{ transformOrigin: "700px -50" }} />
            <path d="M 1100,-50 Q 1130,-40 1110,-20 Q 1080,-30 1100,-50 Z" fill="#00f2fe" filter="url(#glow-cyan)" className="leaf-anim-4" style={{ transformOrigin: "1100px -50" }} />
          </g>
        </g>

        {/* LAYER 8: Interactive Slingshot Birds */}
        {/* Bird 1: Golden Eagle (Left branch) */}
        <g
          ref={bird1Ref}
          className="interactive-bird"
          onClick={() => launchBird(0)}
          style={{ pointerEvents: "auto", cursor: "pointer" }}
        >
          <ellipse cx="0" cy="0" rx="20" ry="18" fill="url(#bird-gold-grad)" />
          <circle cx="14" cy="-10" r="11" fill="url(#bird-gold-grad)" />
          <circle cx="18" cy="-12" r="3.5" fill="#000" />
          <circle cx="19" cy="-13" r="1" fill="#fff" />
          {/* Angry Brow */}
          <polygon points="10,-17 21,-15 14,-13" fill="#1e1b4b" />
          {/* Beak */}
          <polygon points="23,-12 30,-9 23,-7" fill="#d97706" />
          {/* Wings */}
          <ellipse cx="-10" cy="2" rx="16" ry="8" fill="url(#bird-gold-grad)" opacity="0.9" transform="rotate(-30 -10 2)" />
          <ellipse cx="8" cy="4" rx="14" ry="7" fill="url(#bird-gold-grad)" opacity="0.9" transform="rotate(20 8 4)" />
          {/* Tail */}
          <path d="M-18,6 L-30,12 L-26,4 Z" fill="#d97706" />
        </g>

        {/* Bird 2: Red Cardinal (Right branch) */}
        <g
          ref={bird2Ref}
          className="interactive-bird"
          onClick={() => launchBird(1)}
          style={{ pointerEvents: "auto", cursor: "pointer" }}
        >
          <ellipse cx="0" cy="0" rx="18" ry="16" fill="url(#bird-red-grad)" />
          <circle cx="12" cy="-9" r="10" fill="url(#bird-red-grad)" />
          {/* Crest */}
          <polygon points="4,-17 12,-21 9,-16" fill="url(#bird-red-grad)" />
          <circle cx="16" cy="-11" r="3" fill="#000" />
          <circle cx="17" cy="-12" r="0.8" fill="#fff" />
          {/* Angry Brow */}
          <polygon points="12,-15 19,-14 14,-12" fill="#171717" />
          {/* Beak */}
          <polygon points="21,-10 27,-8 21,-6" fill="#fbbf24" />
          {/* Wings */}
          <ellipse cx="-8" cy="2" rx="14" ry="7" fill="url(#bird-red-grad)" opacity="0.95" transform="rotate(-25 -8 2)" />
          {/* Tail */}
          <path d="M-16,4 L-28,8 L-24,1 Z" fill="#7f1d1d" />
        </g>

        {/* Bird 3: Cyan Hummingbird (Hovering mid-sky) */}
        <g
          ref={bird3Ref}
          className="interactive-bird"
          onClick={() => launchBird(2)}
          style={{ pointerEvents: "auto", cursor: "pointer" }}
        >
          <ellipse cx="0" cy="0" rx="14" ry="11" fill="url(#bird-cyan-grad)" />
          <circle cx="10" cy="-6" r="7.5" fill="url(#bird-cyan-grad)" />
          <circle cx="13" cy="-8" r="2.5" fill="#000" />
          <circle cx="14" cy="-9" r="0.6" fill="#fff" />
          {/* Long Beak */}
          <polygon points="16,-7 26,-7 16,-5" fill="#00f2fe" filter="url(#glow-cyan)" />
          {/* Wings flutter (scale animation simulated in SVG) */}
          <ellipse cx="-4" cy="-8" rx="5" ry="14" fill="url(#bird-cyan-grad)" opacity="0.85" className="animate-pulse" style={{ transformOrigin: "-4px -8px", animationDuration: "0.1s" }} />
          {/* Tail */}
          <path d="M-12,2 L-22,4 L-18,-1 Z" fill="#0891b2" />
        </g>
      </svg>
    </div>
  );
}
