"use client";

import { useEffect, useState } from "react";

export default function CursorEyes() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPos = (eyeX: number, eyeY: number) => {
    if (!mounted) return { x: 0, y: 0 };
    const dx = mousePos.x - eyeX;
    const dy = mousePos.y - eyeY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(12, Math.hypot(dx, dy) / 8); 
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  };

  const centerX = mounted ? window.innerWidth / 2 : 500;
  const centerY = mounted ? window.innerHeight / 2 : 500;

  const leftEyeCenter = { x: centerX - 35, y: centerY - 50 };
  const rightEyeCenter = { x: centerX + 35, y: centerY - 50 };

  const leftPupil = calculatePupilPos(leftEyeCenter.x, leftEyeCenter.y);
  const rightPupil = calculatePupilPos(rightEyeCenter.x, rightEyeCenter.y);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", transform: "translateY(-50px)" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        {/* Left Eye */}
        <div style={{
          width: "55px", height: "80px",
          background: "#fff",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            width: "30px", height: "35px",
            background: "#000",
            borderRadius: "50%",
            position: "absolute",
            transform: `translate(${leftPupil.x}px, ${leftPupil.y}px)`,
            transition: "transform 0.05s linear",
          }}>
             <div style={{ width: "8px", height: "8px", background: "#fff", borderRadius: "50%", position: "absolute", top: "4px", right: "6px" }} />
          </div>
        </div>
        
        {/* Right Eye */}
        <div style={{
          width: "55px", height: "80px",
          background: "#fff",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            width: "30px", height: "35px",
            background: "#000",
            borderRadius: "50%",
            position: "absolute",
            transform: `translate(${rightPupil.x}px, ${rightPupil.y}px)`,
            transition: "transform 0.05s linear",
          }}>
             <div style={{ width: "8px", height: "8px", background: "#fff", borderRadius: "50%", position: "absolute", top: "4px", right: "6px" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
