"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
}

export default function StatCounter({ value, suffix = "", label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const count = useAnimatedCounter(value, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ flex: "1 1 150px" }}
    >
      <div
        style={{
          fontFamily: "var(--font-anton), sans-serif",
          fontSize: "5rem",
          lineHeight: 1,
          color: "#F0EBE1",
        }}
      >
        {count}
        {suffix}
      </div>
      <div
        style={{
          fontSize: "0.9rem",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginTop: "15px",
          color: "rgba(240, 235, 225, 0.5)",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}
