"use client";

import { motion } from "framer-motion";
import NovaRobot from "./NovaRobot";

interface NovaOrbProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function NovaOrb({ isOpen, onClick }: NovaOrbProps) {
  return (
    <div className="nova-orb-wrap">
      <motion.button
        type="button"
        className="nova-orb"
        onClick={onClick}
        aria-label={isOpen ? "Close CSI Nova assistant" : "Open CSI Nova assistant"}
        aria-expanded={isOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: isOpen ? 0 : [0, -3, 0] }}
        transition={
          isOpen
            ? { duration: 0.2 }
            : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <NovaRobot size={36} floating={!isOpen} />
        {!isOpen && <span className="nova-orb-badge" aria-hidden="true" />}
      </motion.button>
    </div>
  );
}
