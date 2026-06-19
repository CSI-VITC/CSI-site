"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import "@/components/desktop/DesktopOS.css";

interface LoadingScreenProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  "CSI OS v2.0 — initializing…",
  "Loading Nova assistant…",
  "Syncing resources…",
  "Desktop ready.",
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerControls = useAnimation();
  const pupilControls = useAnimation();
  const lidControls = useAnimation();
  const [bootLine, setBootLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBootLine((i) => Math.min(i + 1, BOOT_LINES.length - 1));
    }, 380);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const sequence = async () => {
      await containerControls.start({ opacity: 1, transition: { duration: 0.3, ease: "linear" } });

      if (!isMounted) return;
      await new Promise((r) => setTimeout(r, 300));

      if (!isMounted) return;
      await pupilControls.start({ x: -10, transition: { duration: 0.2, ease: "easeInOut" } });

      if (!isMounted) return;
      await new Promise((r) => setTimeout(r, 400));

      if (!isMounted) return;
      await pupilControls.start({ x: 10, transition: { duration: 0.3, ease: "easeInOut" } });

      if (!isMounted) return;
      await new Promise((r) => setTimeout(r, 400));

      if (!isMounted) return;
      await pupilControls.start({ x: 0, transition: { duration: 0.2, ease: "easeInOut" } });

      if (!isMounted) return;
      await new Promise((r) => setTimeout(r, 200));

      if (!isMounted) return;
      await lidControls.start({ scaleY: 1, transition: { duration: 0.2, ease: "linear" } });

      if (!isMounted) return;
      onComplete();
    };

    sequence();

    return () => {
      isMounted = false;
    };
  }, [containerControls, pupilControls, lidControls, onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0a0a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={containerControls}
        style={{ display: "flex", gap: "8px", transform: "translateY(-50px)" }}
      >
        <Eye pupilControls={pupilControls} lidControls={lidControls} />
        <Eye pupilControls={pupilControls} lidControls={lidControls} />
      </motion.div>
      <motion.p
        key={bootLine}
        className="boot-sequence-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        {BOOT_LINES[bootLine]}
      </motion.p>
    </div>
  );
}

function Eye({
  pupilControls,
  lidControls,
}: {
  pupilControls: ReturnType<typeof useAnimation>;
  lidControls: ReturnType<typeof useAnimation>;
}) {
  return (
    <div
      style={{
        width: "55px",
        height: "80px",
        background: "#fff",
        borderRadius: "50%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <motion.div
        animate={pupilControls}
        style={{
          width: "30px",
          height: "35px",
          background: "#000",
          borderRadius: "50%",
          position: "relative",
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
      </motion.div>

      <motion.div
        initial={{ scaleY: 0 }}
        animate={lidControls}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "50%",
          background: "#0a0a0a",
          transformOrigin: "top",
        }}
      />

      <motion.div
        initial={{ scaleY: 0 }}
        animate={lidControls}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "50%",
          background: "#0a0a0a",
          transformOrigin: "bottom",
        }}
      />
    </div>
  );
}
