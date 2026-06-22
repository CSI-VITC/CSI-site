"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import ElevatedCarousel from "https://framer.com/m/ElevatedCarousel-bCAMVC.js@srHp5fdPcJgdWmuZ09mr";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function Team() {
  const members = [
    { 
      title: "Arjun Selvam", 
      subheadline: "President", 
      tag: "Web Dev",
      image: { src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop" }
    },
    { 
      title: "Karthik Rajan", 
      subheadline: "Vice President", 
      tag: "AI/ML",
      image: { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop" }
    },
    { 
      title: "Meera Krishnan", 
      subheadline: "Design Lead", 
      tag: "UI/UX",
      image: { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop" }
    },
    { 
      title: "Vikram Anand", 
      subheadline: "Security Lead", 
      tag: "Cybersecurity",
      image: { src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1000&auto=format&fit=crop" }
    },
    { 
      title: "Priya Nair", 
      subheadline: "Tech Lead", 
      tag: "Web Dev",
      image: { src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop" }
    }
  ];

  const loopedMembers = Array(20).fill(members).flat();

  return (
    <div style={{ width: "100%", height: "100%", background: "#0a0a0a", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, width: "100%", position: "relative", overflow: "hidden" }}>
        <ElevatedCarousel 
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
        />
      </div>
    </div>
  );
}
