"use client";

import React from "react";
import Book from "https://framer.com/m/Book-AFRs.js@mxOP9zughWqzCr7yH17p";

export function Departments() {
  const depts = [
    {
      leads: "Sudeep & Suyash",
      name: "Management",
      image: "/images/managemeent.jpg"
    },
    {
      leads: "Yeswanth & Syed",
      name: "Technical",
      image: "/images/technical.png"
    },
    {
      leads: "Janet",
      name: "Design",
      image: "/images/design.jpg"
    },
    {
      leads: "Nityasri",
      name: "Social & Content",
      image: "/images/social.jpg"
    }
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "#050505", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 20px", overflowY: "auto" }}>
      <h2 style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: "3.5rem", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "50px", color: "#F0EBE1", textAlign: "center" }}>
        DEPARTMENTS
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "50px", maxWidth: "1100px", width: "100%", paddingBottom: "20px" }}>
        {depts.map((d, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "200px", height: "305px", position: "relative" }}>
              <Book 
                image={d.image}
                title={d.name}
                author={d.leads}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
