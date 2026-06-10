"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

export function NovaAdminInsights({ insights }: { insights: string[] }) {
  return (
    <aside className="aem-nova-insights" aria-label="Nova admin insights" aria-live="polite">
      <AnimatePresence>
        {insights.map((text, i) => (
          <motion.div
            key={text}
            className="aem-nova-chip"
            initial={{ opacity: 0, x: 24, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ delay: i * 0.15, type: "spring", stiffness: 340, damping: 28 }}
          >
            <Bot size={16} style={{ flexShrink: 0, color: "rgba(100,180,255,0.85)", marginTop: 2 }} />
            <span>{text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </aside>
  );
}
