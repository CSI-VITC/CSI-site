"use client";

import { motion } from "framer-motion";
import type { QuickActionId } from "./types";
import { QUICK_ACTIONS } from "./novaKnowledge";

interface NovaQuickActionsProps {
  onSelect: (id: QuickActionId, label: string) => void;
  disabled?: boolean;
}

export default function NovaQuickActions({ onSelect, disabled }: NovaQuickActionsProps) {
  return (
    <div className="nova-quick-actions" role="group" aria-label="Quick actions">
      {QUICK_ACTIONS.map((action, i) => (
        <motion.button
          key={action.id}
          type="button"
          className="nova-chip"
          disabled={disabled}
          onClick={() => onSelect(action.id, action.label)}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.04 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
        >
          <span className="nova-chip-label">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
