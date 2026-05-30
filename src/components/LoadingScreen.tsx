"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerControls = useAnimation();
  const pupilControls = useAnimation();
  const lidControls = useAnimation();

  useEffect(() => {
    let isMounted = true;

    const sequence = async () => {
      // 1. Fade in eyes cleanly over 0.3s
      await containerControls.start({ opacity: 1, transition: { duration: 0.3, ease: "linear" } });
      
      if (!isMounted) return;
      // Pause 0.3s
      await new Promise(r => setTimeout(r, 300));

      if (!isMounted) return;
      // 2. Shift left (subtle 12px)
      await pupilControls.start({ x: -12, transition: { duration: 0.2, ease: "easeInOut" } });
      
      if (!isMounted) return;
      // Pause
      await new Promise(r => setTimeout(r, 400));

      if (!isMounted) return;
      // 3. Shift right
      await pupilControls.start({ x: 12, transition: { duration: 0.3, ease: "easeInOut" } });

      if (!isMounted) return;
      // Pause
      await new Promise(r => setTimeout(r, 400));

      if (!isMounted) return;
      // 4. Return to center
      await pupilControls.start({ x: 0, transition: { duration: 0.2, ease: "easeInOut" } });

      if (!isMounted) return;
      // Pause before blink
      await new Promise(r => setTimeout(r, 200));

      if (!isMounted) return;
      // 5. Single slow blink (lids close) over 0.2s
      await lidControls.start({ scaleY: 1, transition: { duration: 0.2, ease: "linear" } });

      if (!isMounted) return;
      // 6. Hard cut
      onComplete();
    };

    sequence();

    return () => {
      isMounted = false;
    };
  }, [containerControls, pupilControls, lidControls, onComplete]);

  return (
    <div style={{ 
      position: "fixed", 
      inset: 0, 
      background: "#0a0a0a", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      zIndex: 99999 
    }}>
      <motion.div initial={{ opacity: 0 }} animate={containerControls} style={{ display: "flex", gap: "24px" }}>
        <Eye pupilControls={pupilControls} lidControls={lidControls} />
        <Eye pupilControls={pupilControls} lidControls={lidControls} />
      </motion.div>
    </div>
  );
}

function Eye({ pupilControls, lidControls }: { pupilControls: any, lidControls: any }) {
  return (
    <div style={{ 
      width: "80px", 
      height: "40px", 
      background: "#F0EBE1", 
      borderRadius: "50%", 
      position: "relative", 
      overflow: "hidden", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center" 
    }}>
      {/* Pupil */}
      <motion.div 
        animate={pupilControls} 
        style={{ width: "24px", height: "24px", background: "#0a0a0a", borderRadius: "50%" }} 
      />
      
      {/* Top Lid */}
      <motion.div 
        initial={{ scaleY: 0 }} 
        animate={lidControls} 
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "50%", background: "#0a0a0a", transformOrigin: "top" }} 
      />
      
      {/* Bottom Lid */}
      <motion.div 
        initial={{ scaleY: 0 }} 
        animate={lidControls} 
        style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "50%", background: "#0a0a0a", transformOrigin: "bottom" }} 
      />
    </div>
  );
}
