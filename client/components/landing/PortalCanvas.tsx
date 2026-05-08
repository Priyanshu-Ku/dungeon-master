"use client";

import { useRef, useEffect } from "react";

export default function PortalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 600;

    let t = 0;
    const cx = 300, cy = 300;

    const draw = () => {
      ctx.clearRect(0, 0, 600, 600);
      t += 0.008;

      // Outer dark glow
      const bg = ctx.createRadialGradient(cx, cy, 60, cx, cy, 280);
      bg.addColorStop(0, "rgba(8, 0, 20, 0.9)");
      bg.addColorStop(0.5, "rgba(20, 0, 40, 0.5)");
      bg.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 280, 0, Math.PI * 2);
      ctx.fillStyle = bg;
      ctx.fill();

      // Energy rings
      const ringData = [
        { r: 220, color: "#00d4ff", width: 3, speed: 1 },
        { r: 200, color: "#8b5cf6", width: 2, speed: -1.3 },
        { r: 175, color: "#06ffd4", width: 2, speed: 0.8 },
        { r: 150, color: "#ff6b35", width: 1.5, speed: -0.5 },
        { r: 120, color: "#8b5cf6", width: 1, speed: 2 },
      ];

      ringData.forEach(({ r, color, width, speed }) => {
        const segments = 60;
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const a = (i / segments) * Math.PI * 2 + t * speed;
          const wobble = Math.sin(i * 0.5 + t * 3) * 6;
          const rx = cx + (r + wobble) * Math.cos(a);
          const ry = cy + (r + wobble) * Math.sin(a);
          i === 0 ? ctx.moveTo(rx, ry) : ctx.lineTo(rx, ry);
        }
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        ctx.globalAlpha = 0.7 + Math.sin(t * 2) * 0.15;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });

      // Inner portal swirl
      const swirlLayers = 5;
      for (let s = 0; s < swirlLayers; s++) {
        const segments = 120;
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const progress = i / segments;
          const angle = progress * Math.PI * 4 + t * (s % 2 === 0 ? 1 : -1) + (s * Math.PI * 2) / swirlLayers;
          const radius = progress * 100 + Math.sin(progress * 8 + t * 3) * 10;
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const colors = ["#00d4ff", "#8b5cf6", "#06ffd4", "#ff6b35", "#ff0080"];
        ctx.strokeStyle = colors[s];
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors[s];
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      // Portal core void
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
      coreGrad.addColorStop(0, "rgba(0, 0, 5, 1)");
      coreGrad.addColorStop(0.4, "rgba(4, 0, 20, 0.95)");
      coreGrad.addColorStop(0.7, "rgba(8, 0, 40, 0.7)");
      coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 90, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Rune symbols in the void
      const runeSymbols = ["∆", "Ω", "Σ", "∇", "∞", "⬡", "⊕", "⊗"];
      ctx.font = "bold 16px 'Orbitron', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + t * 0.3;
        const r = 60;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const symbol = runeSymbols[i % runeSymbols.length];
        ctx.fillStyle = `hsl(${(i * 60 + t * 50) % 360}, 100%, 70%)`;
        ctx.globalAlpha = 0.6 + Math.sin(t * 2 + i) * 0.3;
        ctx.shadowBlur = 12;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fillText(symbol, x, y);
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Outer sparkles
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2 + t * 0.2;
        const sparkWobble = Math.sin(t * 3 + i * 0.7) * 20;
        const sr = 235 + sparkWobble;
        const sx = cx + sr * Math.cos(angle);
        const sy = cy + sr * Math.sin(angle);
        const sparkSize = 2 + Math.abs(Math.sin(t * 4 + i)) * 4;

        ctx.beginPath();
        ctx.arc(sx, sy, sparkSize, 0, Math.PI * 2);
        const sparkColors = ["#00d4ff", "#8b5cf6", "#06ffd4", "#ff6b35"];
        ctx.fillStyle = sparkColors[i % sparkColors.length];
        ctx.globalAlpha = Math.abs(Math.sin(t * 2 + i * 0.5));
        ctx.shadowBlur = 20;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Inner glow pulse
      const pulse = ctx.createRadialGradient(cx, cy, 0, cx, cy, 95);
      const pulseAlpha = 0.15 + Math.sin(t * 2) * 0.08;
      pulse.addColorStop(0, `rgba(139, 92, 246, ${pulseAlpha * 2})`);
      pulse.addColorStop(0.5, `rgba(0, 212, 255, ${pulseAlpha})`);
      pulse.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 95, 0, Math.PI * 2);
      ctx.fillStyle = pulse;
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      className="w-full h-full"
      style={{ maxWidth: 560, maxHeight: 560 }}
    />
  );
}
