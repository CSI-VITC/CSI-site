"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WINDOW_ICONS, WINDOW_TITLES } from "@/lib/rbac/navigation";
import type { WindowId } from "@/components/nova/types";

export const STRIP_LEFT = 14;
export const STRIP_TOP = 80;
export const STRIP_ITEM_SIZE = 56;
export const STRIP_GAP = 10;

export function getMinimizedSlotY(index: number) {
  return STRIP_TOP + index * (STRIP_ITEM_SIZE + STRIP_GAP);
}

const WINDOW_META: Record<string, { title: string; icon: string }> = Object.fromEntries(
  (Object.keys(WINDOW_TITLES) as WindowId[]).map((id) => [
    id,
    { title: WINDOW_TITLES[id], icon: WINDOW_ICONS[id] },
  ])
);

interface MinimizedWindowStripProps {
  windows: string[];
  onRestore: (id: string) => void;
}

export default function MinimizedWindowStrip({ windows, onRestore }: MinimizedWindowStripProps) {
  if (windows.length === 0) return null;

  return (
    <div
      aria-label="Minimized windows"
      style={{
        position: "fixed",
        left: STRIP_LEFT,
        top: STRIP_TOP,
        zIndex: 120,
        display: "flex",
        flexDirection: "column",
        gap: STRIP_GAP,
        pointerEvents: "auto",
      }}
    >
      <AnimatePresence mode="popLayout">
        {windows.map((id) => {
          const meta = WINDOW_META[id] ?? { title: id, icon: "/icons/Finder.png" };
          return (
            <motion.button
              key={id}
              type="button"
              layout
              initial={{ opacity: 0, x: -24, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -24, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              onClick={() => onRestore(id)}
              title={`Restore ${meta.title}`}
              aria-label={`Restore ${meta.title}`}
              style={{
                width: STRIP_ITEM_SIZE,
                padding: 0,
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                background: "rgba(20, 20, 20, 0.82)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
                cursor: "pointer",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: STRIP_ITEM_SIZE - 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 6,
                }}
              >
                <img
                  src={meta.icon}
                  alt=""
                  draggable={false}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  color: "rgba(240,235,225,0.75)",
                  textAlign: "center",
                  padding: "0 4px 6px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontFamily: "var(--font-inter), -apple-system, sans-serif",
                }}
              >
                {meta.title.split(" ")[0]}
              </span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
