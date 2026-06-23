"use client";

import React, { useState, useRef, useEffect, startTransition } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

export default function ElevatedCarousel(props: any) {
  const {
    items = [],
    cardWidth = 400,
    cardHeight = 500,
    cardGap = 32,
    elevationOffset = 60,
    backgroundColor = "transparent",
    cardRadius = 16,
    titleColor = "#F0EBE1",
    subheadlineColor = "rgba(240, 235, 225, 0.6)",
    ctaSize = 56,
    contentGap = 20,
    titleDescriptionGap = 0,
    tagBackgroundColor = "rgba(240, 235, 225, 0.1)",
    tagTextColor = "#F0EBE1",
  } = props;

  const [activeIndex, setActiveIndex] = useState(() => Math.floor(items.length / 2));
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const totalWidth = items.length * (cardWidth + cardGap);
  const centerOffset = containerRef.current ? containerRef.current.offsetWidth / 2 - cardWidth / 2 : 0;

  useEffect(() => {
    if (!containerRef.current) return;
    const calculatedCenterOffset = containerRef.current.offsetWidth / 2 - cardWidth / 2;
    const targetX = -activeIndex * (cardWidth + cardGap) + calculatedCenterOffset;
    animate(x, targetX, { type: "spring", stiffness: 300, damping: 30 });
  }, [activeIndex, cardWidth, cardGap, x]);

  useEffect(() => {
    const checkMobile = () => {
      startTransition(() => setIsMobile(window.innerWidth < 768));
    };
    if (typeof window !== "undefined") {
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  const handlePrevious = () => {
    if (activeIndex > 0) {
      startTransition(() => setActiveIndex(activeIndex - 1));
    }
  };

  const handleNext = () => {
    if (activeIndex < items.length - 1) {
      startTransition(() => setActiveIndex(activeIndex + 1));
    }
  };

  const handleDragEnd = () => {
    const currentX = x.get();
    const cardTotalWidth = cardWidth + cardGap;
    const newIndex = Math.round((-currentX + centerOffset) / cardTotalWidth);
    const clampedIndex = Math.max(0, Math.min(items.length - 1, newIndex));
    startTransition(() => {
      setActiveIndex(clampedIndex);
      setIsDragging(false);
    });
  };

  const handleCardClick = (index: number) => {
    if (!isDragging) {
      if (index !== activeIndex) {
        startTransition(() => setActiveIndex(index));
      } else if (items[index].link) {
        window.open(items[index].link, "_blank");
      }
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", backgroundColor, overflow: "hidden", position: "relative" }}>
      <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
        <motion.div
          drag="x"
          dragConstraints={{ left: -(totalWidth - (containerRef.current?.offsetWidth || 0)), right: 0 }}
          dragElastic={0.1}
          onDragStart={() => startTransition(() => setIsDragging(true))}
          onDragEnd={handleDragEnd}
          style={{ display: "flex", gap: cardGap, x, cursor: isDragging ? "grabbing" : "grab" }}
        >
          {items.map((item: any, index: number) => {
            const isActive = index === activeIndex;
            const itemImage = item.image || { src: "" };
            return (
              <motion.div key={index} onClick={() => handleCardClick(index)} style={{ width: cardWidth, flexShrink: 0, cursor: "pointer", position: "relative" }}>
                <motion.div animate={{ y: isActive ? -elevationOffset : 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} style={{ width: "100%", height: cardHeight, borderRadius: cardRadius, overflow: "hidden", position: "relative", zIndex: 2, backgroundColor: backgroundColor }}>
                  <img src={itemImage.src} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none", userSelect: "none" }} draggable={false} />
                  {item.tag && (
                    <div style={{ position: "absolute", top: 16, left: 16, backgroundColor: tagBackgroundColor, backdropFilter: "blur(10px)", color: tagTextColor, padding: "8px 16px", borderRadius: 100, whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none", fontSize: "14px", fontWeight: 500 }}>
                      {item.tag}
                    </div>
                  )}
                </motion.div>
                <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: contentGap, paddingTop: 32, zIndex: 1, pointerEvents: "none", opacity: isActive ? 1 : 0, transition: "opacity 0.3s ease" }}>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: titleDescriptionGap }}>
                    <h2 style={{ margin: 0, color: titleColor, fontSize: "28px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.title}</h2>
                    <p style={{ margin: 0, color: subheadlineColor, fontSize: "15px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.subheadline}</p>
                  </div>
                  <button style={{ width: ctaSize, height: ctaSize, border: "none", backgroundColor: "transparent", display: "flex", alignItems: "flex-start", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "transform 0.2s ease", pointerEvents: "auto", padding: 0 }} onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }} aria-label="View details" onClick={(e) => { e.stopPropagation(); if (item.link) window.open(item.link, "_blank"); }}>
                    <svg width={ctaSize * 0.5} height={ctaSize * 0.5} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <title>Arrow</title>
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      {isMobile && (
        <>
          <button onClick={handlePrevious} disabled={activeIndex === 0} style={{ position: "absolute", left: 16, top: `calc(50% - ${elevationOffset / 2}px)`, transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", backgroundColor: "rgba(255, 255, 255, 0.9)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)", opacity: activeIndex === 0 ? 0.3 : 1, transition: "opacity 0.2s ease" }} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={handleNext} disabled={activeIndex === items.length - 1} style={{ position: "absolute", right: 16, top: `calc(50% - ${elevationOffset / 2}px)`, transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", backgroundColor: "rgba(255, 255, 255, 0.9)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)", opacity: activeIndex === items.length - 1 ? 0.3 : 1, transition: "opacity 0.2s ease" }} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </>
      )}
    </div>
  );
}
