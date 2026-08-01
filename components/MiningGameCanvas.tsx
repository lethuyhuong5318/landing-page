"use client";

import { useEffect, useRef, useState } from "react";

interface MiningGameCanvasProps {
  width?: number;
  height?: number;
  difficulty?: "easy" | "normal" | "hard";
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export default function MiningGameCanvas({ width = 600, height = 400, difficulty = "normal" }: MiningGameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const gameStateRef = useRef({
    score: 0,
    combo: 0,
    depth: 0,
    resources: [
      { x: 100, y: 50, type: "ore", color: "#FFD700", collected: false },
      { x: 200, y: 100, type: "gem", color: "#FF69B4", collected: false },
      { x: 300, y: 150, type: "coal", color: "#333333", collected: false },
      { x: 150, y: 200, type: "ore", color: "#FFD700", collected: false },
      { x: 350, y: 250, type: "gem", color: "#FF69B4", collected: false },
    ],
  });

  const createParticles = (x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = Math.random() * 4 + 2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        size: Math.random() * 4 + 2,
        color,
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    let animationId: number;
    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Check if clicked on resource
      gameStateRef.current.resources.forEach((resource) => {
        const distance = Math.sqrt((clickX - resource.x) ** 2 + (clickY - resource.y) ** 2);
        if (distance < 20 && !resource.collected) {
          resource.collected = true;
          gameStateRef.current.score += 10;
          gameStateRef.current.combo += 1;
          createParticles(resource.x, resource.y, resource.color, 12);
        }
      });
    };

    const animate = () => {
      // Clear canvas with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(26,138,100,0.1)");
      gradient.addColorStop(1, "rgba(15,90,66,0.15)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw rocks/terrain
      ctx.fillStyle = "rgba(70,50,40,0.2)";
      for (let i = 0; i < 20; i++) {
        const x = (i * width) / 20;
        const y = height * 0.7 + Math.sin(i * 0.5) * 30;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw resources
      gameStateRef.current.resources.forEach((resource) => {
        if (!resource.collected) {
          // Glow effect
          ctx.shadowColor = resource.color;
          ctx.shadowBlur = 15;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          // Resource circle
          ctx.fillStyle = resource.color;
          ctx.beginPath();
          ctx.arc(resource.x, resource.y, 12, 0, Math.PI * 2);
          ctx.fill();

          // Border
          ctx.strokeStyle = "rgba(255,255,255,0.5)";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Reset shadow
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }
      });

      // Draw cursor
      ctx.fillStyle = "rgba(31,168,118,0.3)";
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#1fa876";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // Gravity
        p.life -= 0.02;

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw score & combo
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px var(--font-heading), sans-serif";
      ctx.fillText(`Score: ${gameStateRef.current.score}`, 10, 30);
      ctx.fillText(`Combo: ${gameStateRef.current.combo}x`, 10, 60);

      animationId = requestAnimationFrame(animate);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleMouseClick);
    animate();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", HandleMouseClick);
      cancelAnimationFrame(animationId);
    };
  }, [width, height]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: `${width}px`,
        margin: "0 auto",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(15,90,66,0.2)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          background: "linear-gradient(135deg, rgba(26,138,100,0.08), rgba(15,90,66,0.05))",
          cursor: "crosshair",
        }}
      />
      <div
        style={{
          padding: "12px",
          background: "rgba(26,138,100,0.1)",
          borderTop: "1px solid rgba(31,168,118,0.2)",
          fontSize: "12px",
          color: "#0f5a42",
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        🖱️ Bấm để khai thác tài nguyên · 🧪 Game Demo
      </div>
    </div>
  );
}
