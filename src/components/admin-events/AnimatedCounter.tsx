"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useOptionalAdminA11y } from "./a11y/AdminA11yContext";

export function AnimatedCounter({ value }: { value: number }) {
  const a11y = useOptionalAdminA11y();
  const reduced = a11y?.reducedMotion ?? false;
  const spring = useSpring(reduced ? value : 0, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }
    spring.set(value);
  }, [value, spring, reduced]);

  useEffect(() => {
    if (reduced) return;
    return display.on("change", (v) => setShown(v));
  }, [display, reduced]);

  return <span className="aem-analytic-value">{shown}</span>;
}

export function AnimatedProgress({ percent }: { percent: number }) {
  const a11y = useOptionalAdminA11y();
  const reduced = a11y?.reducedMotion ?? false;
  const clamped = Math.min(100, percent);

  return (
    <div
      className="aem-progress-track"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {reduced ? (
        <div className="aem-progress-fill" style={{ width: `${clamped}%` }} />
      ) : (
        <motion.div
          className="aem-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </div>
  );
}
