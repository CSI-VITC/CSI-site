"use client";

import { Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import "./Rbac.css";

interface MemberUnlockDialogProps {
  onContinueGuest: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
}

export function MemberUnlockDialog({ onContinueGuest, onSignIn, onSignUp }: MemberUnlockDialogProps) {
  return (
    <div className="rbac-unlock-wrap" role="dialog" aria-labelledby="unlock-title" aria-modal="true">
      <motion.div
        className="rbac-unlock-panel"
        initial={{ opacity: 0, y: 14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="rbac-unlock-icon" aria-hidden="true">
          <Sparkles size={26} strokeWidth={1.5} />
        </div>
        <h2 id="unlock-title" className="rbac-unlock-title">
          Unlock CSI Member Features
        </h2>
        <p className="rbac-unlock-sub">Sign in to:</p>
        <ul className="rbac-unlock-list">
          <li>Save resources</li>
          <li>Track registrations</li>
          <li>Access certificates</li>
          <li>Personalize your dashboard</li>
        </ul>
        <div className="rbac-unlock-actions">
          <button type="button" className="rbac-restricted-btn rbac-restricted-btn--primary" onClick={onSignIn}>
            Sign In
          </button>
          <button type="button" className="rbac-restricted-btn" onClick={onSignUp}>
            Create Account
          </button>
          <button type="button" className="rbac-unlock-ghost" onClick={onContinueGuest}>
            Continue as Guest
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/** Inline compact prompt for member actions inside public windows */
export function MemberFeaturePrompt({
  message = "Sign in to save resources and track events.",
  onSignIn,
}: {
  message?: string;
  onSignIn: () => void;
}) {
  return (
    <div className="rbac-member-prompt" role="note">
      <Lock size={14} aria-hidden="true" />
      <span>{message}</span>
      <button type="button" className="rbac-member-prompt-btn" onClick={onSignIn}>
        Sign In
      </button>
    </div>
  );
}
