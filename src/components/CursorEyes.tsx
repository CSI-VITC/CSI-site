"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CursorEyesProps {
  onHeroInteract?: () => void;
}

export default function CursorEyes({ onHeroInteract }: CursorEyesProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2 - 50;
      setIsNear(Math.hypot(e.clientX - cx, e.clientY - cy) < 120);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPos = (eyeX: number, eyeY: number) => {
    if (!mounted) return { x: 0, y: 0 };
    const dx = mousePos.x - eyeX;
    const dy = mousePos.y - eyeY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(isNear ? 14 : 12, Math.hypot(dx, dy) / 8);
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
    <motion.div
      onClick={onHeroInteract}
      animate={{ scale: isNear ? 1.02 : 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: "translateY(-50px)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "8px",
          pointerEvents: "auto",
          cursor: "default",
        }}
      >
        <Eye pupil={leftPupil} />
        <Eye pupil={rightPupil} />
      </div>
    </motion.div>
  );
}

function Eye({ pupil }: { pupil: { x: number; y: number } }) {
  return (
    <div
      style={{
        width: "55px",
        height: "80px",
        background: "#fff",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          width: "30px",
          height: "35px",
          background: "#000",
          borderRadius: "50%",
          position: "absolute",
          transform: `translate(${pupil.x}px, ${pupil.y}px)`,
          transition: "transform 0.08s linear",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            background: "#fff",
            borderRadius: "50%",
            position: "absolute",
            top: "4px",
            right: "6px",
          }}
        />
      </div>
    </div>
  );
}
