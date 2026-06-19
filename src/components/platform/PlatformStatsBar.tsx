"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { PLATFORM_STATS } from "@/data/platformContent";

export function PlatformStatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="csi-platform-stats" role="list" aria-label="CSI statistics">
      {PLATFORM_STATS.map((stat) => (
        <PlatformStat key={stat.label} {...stat} active={inView} />
      ))}
    </div>
  );
}

function PlatformStat({
  value,
  suffix,
  label,
  active,
}: {
  value: number;
  suffix: string;
  label: string;
  active: boolean;
}) {
  const count = useAnimatedCounter(value, active);
  return (
    <div className="csi-platform-stat" role="listitem">
      <strong>
        {count}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}
