"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import "./CursorEyes.css";

interface CursorEyesProps {
  onHeroInteract?: () => void;
}

export default function CursorEyes({ onHeroInteract }: CursorEyesProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [isNear, setIsNear] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

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

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleBlink = () => {
      const delay = 3200 + Math.random() * 4500;
      timeoutId = setTimeout(() => {
        if (cancelled) return;
        setIsBlinking(true);
        setTimeout(() => {
          if (!cancelled) setIsBlinking(false);
        }, 160);
        scheduleBlink();
      }, delay);
    };

    scheduleBlink();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  const handleClick = () => {
    onHeroInteract?.();
  };

  const centerX = mounted ? window.innerWidth / 2 : 500;
  const centerY = mounted ? window.innerHeight / 2 : 500;
  const leftEyeCenter = { x: centerX - 35, y: centerY - 50 };
  const rightEyeCenter = { x: centerX + 35, y: centerY - 50 };

  const calcPupil = (eyeX: number, eyeY: number) => {
    if (!mounted) return { x: 0, y: 0 };
    const dx = mousePos.x - eyeX;
    const dy = mousePos.y - eyeY;
    const angle = Math.atan2(dy, dx);
    const maxDist = isNear || isHovered ? 14 : 11;
    const dist = Math.min(maxDist, Math.hypot(dx, dy) / 9);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  };

  const leftPupil = calcPupil(leftEyeCenter.x, leftEyeCenter.y);
  const rightPupil = calcPupil(rightEyeCenter.x, rightEyeCenter.y);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: "translateY(-50px)",
        opacity: 0.88,
      }}
    >
      <div
        className="csi-eyes-wrap"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="CSI easter egg"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
      >
        <Eye pupil={leftPupil} blink={isBlinking} />
        <Eye pupil={rightPupil} blink={isBlinking} />
      </div>
    </div>
  );
}

function Eye({ pupil, blink }: { pupil: { x: number; y: number }; blink: boolean }) {
  const springX = useSpring(pupil.x, { stiffness: 420, damping: 28, mass: 0.35 });
  const springY = useSpring(pupil.y, { stiffness: 420, damping: 28, mass: 0.35 });

  useEffect(() => {
    springX.set(pupil.x);
    springY.set(pupil.y);
  }, [pupil.x, pupil.y, springX, springY]);

  return (
    <div className="csi-eye-shell">
      <motion.div
        style={{
          width: 30,
          height: 35,
          background: "#000",
          borderRadius: "50%",
          position: "absolute",
          x: springX,
          y: springY,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            background: "#fff",
            borderRadius: "50%",
            position: "absolute",
            top: 4,
            right: 6,
          }}
        />
      </motion.div>
      <motion.div
        className="csi-eye-lid csi-eye-lid--top"
        animate={{ scaleY: blink ? 1 : 0 }}
        transition={{ duration: 0.1, ease: "easeIn" }}
      />
      <motion.div
        className="csi-eye-lid csi-eye-lid--bottom"
        animate={{ scaleY: blink ? 1 : 0 }}
        transition={{ duration: 0.1, ease: "easeIn" }}
      />
    </div>
  );
}
