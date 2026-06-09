"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface MatrixRainProps {
  opacity?: number;
  className?: string;
}

// ─── Character Pools ───
const KATAKANA = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ";
const LATIN = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
const ALL_CHARS = KATAKANA + LATIN + DIGITS + SYMBOLS;

// ─── ASCII Human Figure ───
// Positioned center-right of the canvas
const ASCII_FIGURE = [
  "      .-.",
  "     (o o)",
  "      |O| ",
  "     /| |\\",
  "    / | | \\",
  "     /   \\ ",
  "    /     \\ ",
  "   /       \\ ",
  "  (___/ \\___)",
];

const FIGURE_COL = 0.65; // Relative X position (0-1)
const FIGURE_ROW = 0.35; // Relative Y position (0-1)

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  length: number;
  brightness: number;
  paused: boolean;
}

interface RipplePoint {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export default function MatrixRain({ opacity = 0.15, className = "" }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<Column[]>([]);
  const ripplesRef = useRef<RipplePoint[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const figurePixelsRef = useRef<Set<string>>(new Set());

  // Initialize ASCII figure pixel positions
  const initFigurePixels = useCallback((cols: number, rows: number, fontSize: number) => {
    const set = new Set<string>();
    const startCol = Math.floor(cols * FIGURE_COL);
    const startRow = Math.floor(rows * FIGURE_ROW);
    
    ASCII_FIGURE.forEach((line, rowIdx) => {
      for (let i = 0; i < line.length; i++) {
        if (line[i] !== " ") {
          set.add(`${startCol + i},${startRow + rowIdx}`);
        }
      }
    });
    figurePixelsRef.current = set;
  }, []);

  // Get random character
  const getRandomChar = () => ALL_CHARS[Math.floor(Math.random() * ALL_CHARS.length)];

  // Initialize columns
  const initColumns = useCallback((width: number, height: number, fontSize: number) => {
    const cols = Math.ceil(width / fontSize);
    const rows = Math.ceil(height / fontSize);
    const columns: Column[] = [];

    for (let i = 0; i < cols; i++) {
      const length = Math.floor(Math.random() * rows * 0.6) + rows * 0.15;
      const chars: string[] = [];
      for (let j = 0; j < length; j++) {
        chars.push(getRandomChar());
      }
      columns.push({
        x: i,
        y: Math.random() * -rows, // Start above screen
        speed: Math.random() * 0.8 + 0.2,
        chars,
        length,
        brightness: Math.random() * 0.5 + 0.5,
        paused: false,
      });
    }

    initFigurePixels(cols, rows, fontSize);
    columnsRef.current = columns;
  }, [initFigurePixels]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 14;
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      initColumns(width, height, fontSize);
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Add ripple on movement
      if (Math.random() > 0.7) {
        ripplesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: 0,
          maxRadius: 80 + Math.random() * 60,
          alpha: 0.3,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Drawing
    const draw = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimeRef.current) / 16.67, 3);
      lastTimeRef.current = timestamp;

      // Semi-transparent clear for trail effect
      ctx.fillStyle = `rgba(0, 0, 0, ${0.08 * dt})`;
      ctx.fillRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const mouseCol = Math.floor(mouse.x / fontSize);
      const mouseRow = Math.floor(mouse.y / fontSize);
      const mouseRadius = 6; // Radius in grid cells

      // Draw and update columns
      ctx.font = `${fontSize}px "Courier New", monospace`;

      columnsRef.current.forEach((col) => {
        const colIsFigure = figurePixelsRef.current.has(`${col.x},${Math.floor(col.y)}`);
        
        col.chars.forEach((char, charIdx) => {
          const row = Math.floor(col.y) - charIdx;
          if (row < 0 || row * fontSize > height + fontSize) return;

          const posX = col.x * fontSize;
          const posY = row * fontSize;

          // Distance from mouse
          const distFromMouse = Math.hypot(col.x - mouseCol, row - mouseRow);
          const isNearMouse = distFromMouse < mouseRadius;
          const isMousePass = isNearMouse && distFromMouse < mouseRadius * 0.6;

          // Check if this position is part of the ASCII figure
          const isFigurePixel = figurePixelsRef.current.has(`${col.x},${row}`);

          if (isFigurePixel) {
            // ASCII figure rendering - static, elegant
            ctx.fillStyle = "rgba(16, 185, 129, 0.45)";
            ctx.shadowColor = "rgba(16, 185, 129, 0.6)";
            ctx.shadowBlur = 8;
            ctx.fillText(char, posX, posY);
            ctx.shadowBlur = 0;
            return;
          }

          if (isMousePass) {
            // Characters part around mouse (don't render)
            return;
          }

          // Determine character color based on position in column
          const isLeading = charIdx === 0;
          const isNearLeading = charIdx < 3;

          if (isLeading) {
            // Leading character - bright white-green
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
            ctx.shadowBlur = 10;
          } else if (isNearLeading) {
            // Near leading - bright green
            const fade = 1 - charIdx / 5;
            ctx.fillStyle = `rgba(52, 211, 153, ${fade})`;
            ctx.shadowColor = "rgba(52, 211, 153, 0.5)";
            ctx.shadowBlur = 6;
          } else {
            // Trailing characters - dimmer green
            const fade = Math.max(0, 1 - charIdx / col.length) * 0.4 * col.brightness;
            ctx.fillStyle = `rgba(16, 185, 129, ${fade})`;
            ctx.shadowBlur = 0;
          }

          // If near mouse, brighten and push away slightly
          if (isNearMouse) {
            const pushFactor = 1 - distFromMouse / mouseRadius;
            ctx.fillStyle = `rgba(52, 211, 153, ${0.3 + pushFactor * 0.5})`;
            ctx.shadowColor = "rgba(52, 211, 153, 0.4)";
            ctx.shadowBlur = 4 + pushFactor * 8;
          }

          ctx.fillText(char, posX, posY);
          ctx.shadowBlur = 0;
        });

        // Update column position
        col.y += col.speed * 0.3 * dt;

        // Randomly change characters
        if (Math.random() > 0.95) {
          const idx = Math.floor(Math.random() * col.chars.length);
          col.chars[idx] = getRandomChar();
        }

        // Reset if off screen
        if ((col.y - col.length) * fontSize > height) {
          col.y = -Math.random() * col.length * 0.5;
          col.speed = Math.random() * 0.8 + 0.2;
          col.brightness = Math.random() * 0.5 + 0.5;
          // Regenerate characters
          for (let i = 0; i < col.chars.length; i++) {
            col.chars[i] = getRandomChar();
          }
        }
      });

      // Draw and update ripples
      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        ripple.radius += 2 * dt;
        ripple.alpha -= 0.008 * dt;

        if (ripple.alpha <= 0) return false;

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(52, 211, 153, ${ripple.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        return true;
      });

      // Draw ASCII figure glow outline
      const figStartCol = Math.floor((width / fontSize) * FIGURE_COL);
      const figStartRow = Math.floor((height / fontSize) * FIGURE_ROW);
      ctx.shadowColor = "rgba(16, 185, 129, 0.3)";
      ctx.shadowBlur = 15;
      ASCII_FIGURE.forEach((line, rowIdx) => {
        let lineStr = "";
        for (let i = 0; i < line.length; i++) {
          lineStr += figurePixelsRef.current.has(`${figStartCol + i},${figStartRow + rowIdx}`)
            ? line[i] === " " ? " " : line[i]
            : " ";
        }
        ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
        ctx.font = `${fontSize}px "Courier New", monospace`;
        ctx.fillText(line, figStartCol * fontSize, (figStartRow + rowIdx) * fontSize);
      });
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [initColumns]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
