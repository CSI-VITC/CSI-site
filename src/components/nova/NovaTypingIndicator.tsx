"use client";

import { motion } from "framer-motion";
import NovaRobot from "./NovaRobot";

export default function NovaTypingIndicator() {
  return (
    <motion.div
      className="nova-typing"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="nova-message-avatar">
        <NovaRobot size={26} />
      </div>
      <div className="nova-typing-bubble" aria-label="CSI Nova is typing">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="nova-typing-dot"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
