"use client";

import { type ReactNode } from "react";
import { motion, type TargetAndTransition } from "framer-motion";
import { useFocusTrap } from "./useFocusTrap";
import { useAdminA11y } from "./AdminA11yContext";

interface AccessibleModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  initial?: TargetAndTransition;
  animate?: TargetAndTransition;
  exit?: TargetAndTransition;
}

export function AccessibleModal({
  open,
  onClose,
  title,
  description,
  children,
  className = "aem-panel",
  style,
  initial = { opacity: 0, scale: 0.92 },
  animate = { opacity: 1, scale: 1 },
  exit = { opacity: 0, scale: 0.96 },
}: AccessibleModalProps) {
  const { reducedMotion } = useAdminA11y();
  const trapRef = useFocusTrap(open, onClose);

  if (!open) return null;

  const transition = reducedMotion ? { duration: 0.01 } : { type: "spring" as const, stiffness: 320, damping: 32 };

  return (
    <>
      <motion.div
        className="aem-overlay"
        role="presentation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={reducedMotion ? { duration: 0.01 } : { duration: 0.2 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="aem-modal-title"
        aria-describedby={description ? "aem-modal-desc" : undefined}
        className={className}
        style={{ position: "fixed", ...style }}
        initial={reducedMotion ? { opacity: 1, scale: 1 } : initial}
        animate={animate}
        exit={exit}
        transition={transition}
      >
        <h2 id="aem-modal-title" className="sr-only">
          {title}
        </h2>
        {description && (
          <p id="aem-modal-desc" className="sr-only">
            {description}
          </p>
        )}
        {children}
      </motion.div>
    </>
  );
}
