"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import ElevatedCarousel from "../ElevatedCarousel";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function Team() {
  const members: any[] = [
    { 
      title: "Yeswanth Ram", 
      subheadline: "Tech Lead", 
      tag: "Technical",
      image: { src: "/images/yeswanth.png" },
      link: "https://www.linkedin.com/in/yeswanth-ram-jp/",
      url: "https://www.linkedin.com/in/yeswanth-ram-jp/"
    }
  ];

  const loopedMembers = members;

  return (
    <div style={{ width: "100%", height: "100%", background: "#0a0a0a", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, width: "100%", position: "relative", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* <ElevatedCarousel 
          items={loopedMembers}
          cardWidth={400}
          cardHeight={500}
          cardGap={32}
          elevationOffset={60}
          ctaSize={56}
          cardRadius={16}
          backgroundColor="transparent"
          titleColor="#F0EBE1"
          subheadlineColor="rgba(240, 235, 225, 0.6)"
          ctaColor="#F0EBE1"
          tagBackgroundColor="rgba(240, 235, 225, 0.1)"
          tagTextColor="#F0EBE1"
          style={{ width: "100%", height: "100%" }}
        /> */}
        <p style={{ color: "rgba(240, 235, 225, 0.4)", fontFamily: "var(--font-inter), sans-serif", letterSpacing: "2px" }}>UPDATING ROSTER...</p>
      </div>
    </div>
  );
}
