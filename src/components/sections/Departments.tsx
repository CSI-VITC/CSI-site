"use client";

import React from "react";
import FxSlider from "https://framer.com/m/fx-Slider-GVGv.js@hPSDV5WrI84HI4IP5wb3";

export function Departments() {
  const mockCategories = [
    {
      artist: "Sudeep & Suyash",
      category: "Management",
      featured: "Department",
      image: { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop", alt: "Management" }
    },
    {
      artist: "Yeswanth & Syed",
      category: "Technical",
      featured: "Department",
      image: { src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop", alt: "Technical" }
    },
    {
      artist: "Janet",
      category: "Design",
      featured: "Department",
      image: { src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop", alt: "Design" }
    },
    {
      artist: "Nityasri",
      category: "Social Media and Content",
      featured: "Department",
      image: { src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop", alt: "Social Media" }
    }
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
      <FxSlider 
        style={{ width: "100%", height: "100%" }} 
        categories={mockCategories}
        headerText="DEPARTMENTS"
        footerText="DISCOVER"
      />
    </div>
  );
}
