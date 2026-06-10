"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";

export default function LiquidBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 50,
    damping: 20,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 50,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { innerWidth, innerHeight } = window;

    mouseX.set((e.clientX - innerWidth / 2) * 0.08);
    mouseY.set((e.clientY - innerHeight / 2) * 0.08);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#050505",
      }}
    >
      {/* Blue Blob */}
      <motion.div
        style={{
          position: "absolute",
          width: "60vw",
          height: "60vw",
          x: smoothX,
          y: smoothY,
          background:
            "radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(70px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          borderRadius: ["40%", "60%", "40%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Purple Blob */}
      <motion.div
        style={{
          position: "absolute",
          width: "50vw",
          height: "50vw",
          x: useSpring(mouseX, {
            stiffness: 30,
            damping: 25,
          }),
          y: useSpring(mouseY, {
            stiffness: 30,
            damping: 25,
          }),
          background:
            "radial-gradient(circle, rgba(147,51,234,0.15) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(90px)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
          borderRadius: ["60%", "40%", "60%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Mouse Glow */}
      <motion.div
        style={{
          position: "absolute",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          x: smoothX,
          y: smoothY,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Liquid Image */}
      <motion.div
        animate={{
          borderRadius: [
            "60% 40% 30% 70% / 60% 30% 70% 40%",
            "30% 70% 70% 30% / 30% 30% 70% 70%",
            "60% 40% 30% 70% / 60% 30% 70% 40%",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.03,
        }}
        style={{
          width: "40vw",
          height: "40vw",
          maxWidth: "500px",
          maxHeight: "500px",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 0 80px rgba(59,130,246,0.25)",
          border: "2px solid rgba(255,255,255,0.05)",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
          alt="CSI Group"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </motion.div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          maskImage:
            "radial-gradient(circle at center, transparent 15%, black 40%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}