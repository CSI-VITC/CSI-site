"use client";

import React, { useEffect, useRef } from "react";

/**
 * TechBackground - A multi-layered tech-themed background with:
 * - Animated grid patterns
 * - Floating particles
 * - Subtle gradient shifts
 * - Hexagonal grid overlay
 * - Corner decorations
 */

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  pulsePhase: number;
}

interface GridNode {
  x: number;
  y: number;
  active: boolean;
  activationTime: number;
}

export default function TechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const gridNodesRef = useRef<GridNode[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
      initGridNodes();
    };

    // Initialize floating particles
    const initParticles = () => {
      const particles: Particle[] = [];
      const count = Math.floor((width * height) / 25000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.3 + 0.1,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = particles;
    };

    // Initialize grid nodes for hexagonal pattern
    const initGridNodes = () => {
      const nodes: GridNode[] = [];
      const spacing = 60;
      for (let x = 0; x < width + spacing; x += spacing) {
        for (let y = 0; y < height + spacing; y += spacing) {
          if (Math.random() > 0.7) {
            nodes.push({
              x,
              y,
              active: false,
              activationTime: 0,
            });
          }
        }
      }
      gridNodesRef.current = nodes;
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Activate nearby grid nodes
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      gridNodesRef.current.forEach((node) => {
        const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
        if (dist < 100 && !node.active) {
          node.active = true;
          node.activationTime = timeRef.current;
        }
      });
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Draw hexagon
    const drawHexagon = (x: number, y: number, radius: number, strokeColor: string, lineWidth: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const hx = x + radius * Math.cos(angle);
        const hy = y + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    // Animation loop
    const animate = (timestamp: number) => {
      timeRef.current = timestamp / 1000;
      const t = timeRef.current;

      ctx.clearRect(0, 0, width, height);

      // Layer 1: Deep gradient base
      const gradient = ctx.createRadialGradient(
        width * 0.5 + Math.sin(t * 0.2) * width * 0.1,
        height * 0.3 + Math.cos(t * 0.15) * height * 0.1,
        0,
        width * 0.5,
        height * 0.3,
        width * 0.8
      );
      gradient.addColorStop(0, "rgba(15, 76, 62, 0.08)");
      gradient.addColorStop(0.5, "rgba(5, 28, 23, 0.05)");
      gradient.addColorStop(1, "rgba(2, 7, 6, 0.02)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Layer 2: Fine grid pattern
      ctx.strokeStyle = "rgba(16, 185, 129, 0.04)";
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      
      // Vertical lines
      const offsetX = (t * 2) % gridSize;
      for (let x = -gridSize + offsetX; x < width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Horizontal lines
      const offsetY = (t * 1.5) % gridSize;
      for (let y = -gridSize + offsetY; y < height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Layer 3: Hexagonal nodes
      gridNodesRef.current.forEach((node) => {
        const distFromMouse = Math.hypot(node.x - mouseRef.current.x, node.y - mouseRef.current.y);
        const isNearMouse = distFromMouse < 120;
        
        if (node.active) {
          const age = t - node.activationTime;
          if (age > 3) {
            node.active = false;
          } else {
            const fadeIn = Math.min(1, age * 3);
            const fadeOut = Math.max(0, 1 - (age - 1) / 2);
            const alpha = fadeIn * fadeOut * 0.3;
            
            drawHexagon(
              node.x,
              node.y,
              8 + age * 4,
              `rgba(0, 242, 254, ${alpha})`,
              0.5
            );
          }
        }

        // Draw base node
        const baseAlpha = isNearMouse ? 0.25 : 0.08;
        const nodeRadius = isNearMouse ? 2.5 : 1.5;
        
        ctx.fillStyle = `rgba(16, 185, 129, ${baseAlpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby nodes
        if (isNearMouse) {
          gridNodesRef.current.forEach((other) => {
            const dist = Math.hypot(node.x - other.x, node.y - other.y);
            if (dist < 80 && dist > 0) {
              ctx.strokeStyle = `rgba(0, 242, 254, ${0.1 * (1 - dist / 80)})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          });
        }
      });

      // Layer 4: Floating particles
      particlesRef.current.forEach((particle) => {
        particle.y -= particle.speed;
        particle.pulsePhase += 0.02;
        
        if (particle.y < -10) {
          particle.y = height + 10;
          particle.x = Math.random() * width;
        }

        const pulseOpacity = particle.opacity * (0.7 + 0.3 * Math.sin(particle.pulsePhase));
        const isNearMouse = Math.hypot(particle.x - mouseRef.current.x, particle.y - mouseRef.current.y) < 100;
        const finalOpacity = isNearMouse ? pulseOpacity * 2 : pulseOpacity;

        ctx.fillStyle = `rgba(52, 211, 153, ${Math.min(1, finalOpacity)})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow for larger particles
        if (particle.size > 1.5) {
          ctx.fillStyle = `rgba(0, 242, 254, ${finalOpacity * 0.3})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Layer 5: Corner decorations
      const cornerSize = 30;
      const cornerAlpha = 0.15;
      
      // Top-left corner
      ctx.strokeStyle = `rgba(0, 242, 254, ${cornerAlpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, cornerSize);
      ctx.lineTo(0, 0);
      ctx.lineTo(cornerSize, 0);
      ctx.stroke();

      // Top-right corner
      ctx.beginPath();
      ctx.moveTo(width - cornerSize, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, cornerSize);
      ctx.stroke();

      // Bottom-left corner
      ctx.beginPath();
      ctx.moveTo(0, height - cornerSize);
      ctx.lineTo(0, height);
      ctx.lineTo(cornerSize, height);
      ctx.stroke();

      // Bottom-right corner
      ctx.beginPath();
      ctx.moveTo(width - cornerSize, height);
      ctx.lineTo(width, height);
      ctx.lineTo(width, height - cornerSize);
      ctx.stroke();

      // Layer 6: Scan line effect at top
      const scanY = (t * 30) % (height + 100) - 50;
      ctx.fillStyle = "rgba(0, 242, 254, 0.02)";
      ctx.fillRect(0, scanY, width, 2);

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
