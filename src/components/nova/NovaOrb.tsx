"use client";

import { motion } from "framer-motion";
import NovaRobot from "./NovaRobot";

interface NovaOrbProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function NovaOrb({ isOpen, onClick }: NovaOrbProps) {
  return (
    <div className={`nova-orb-wrap${isOpen ? " nova-orb-wrap--active" : ""}`}>
      <motion.button
        type="button"
        className="nova-orb"
        onClick={onClick}
        aria-label={isOpen ? "Close CSI Nova assistant" : "Open CSI Nova assistant"}
        aria-expanded={isOpen}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <NovaRobot size={28} floating={false} />
      </motion.button>
    </div>
  );
}
