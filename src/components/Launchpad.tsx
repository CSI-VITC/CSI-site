"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LaunchpadItem {
  id: string;
  label: string;
  iconSrc: string;
}

interface LaunchpadProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (id: string) => void;
  items: LaunchpadItem[];
}

export default function Launchpad({ isOpen, onClose, onOpenApp, items }: LaunchpadProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 50,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(25px)",
            WebkitBackdropFilter: "blur(25px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={onClose}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(100px, 1fr))",
              gap: "40px",
              padding: "40px",
              maxWidth: "800px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.1, duration: 0.3 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: "12px",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onOpenApp(item.id);
                  onClose();
                }}
              >
                <div style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
                  background: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <img
                    src={item.iconSrc}
                    alt={item.label}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    draggable={false}
                  />
                </div>
                <span style={{
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 500,
                  textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                }}>
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
