"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { AchievementId } from "@/data/interactionContent";
import { ACHIEVEMENTS } from "@/data/interactionContent";
import "@/components/desktop/DesktopOS.css";

interface AchievementToastProps {
  activeId: AchievementId | null;
  onDismiss: () => void;
}

export default function AchievementToast({ activeId, onDismiss }: AchievementToastProps) {
  const achievement = activeId ? ACHIEVEMENTS[activeId] : null;

  return (
    <AnimatePresence onExitComplete={onDismiss}>
      {achievement && (
        <motion.div
          key={activeId}
          className="reg-success-pop"
          initial={{ opacity: 0, x: -20, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -12, y: 6 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          style={{
            position: "fixed",
            bottom: 118,
            left: 24,
            zIndex: 190,
            maxWidth: 300,
            padding: "12px 14px",
            borderRadius: 14,
            background: "rgba(22, 22, 22, 0.88)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.45)",
            pointerEvents: "none",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <div className="achievement-toast-icon" aria-hidden>
            {achievement.icon ?? "★"}
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(240, 235, 225, 0.45)",
                marginBottom: 4,
              }}
            >
              Achievement Unlocked
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#F0EBE1", marginBottom: 2 }}>
              {achievement.title}
            </div>
            <div style={{ fontSize: 12, color: "rgba(240, 235, 225, 0.55)", lineHeight: 1.45 }}>
              {achievement.description}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
