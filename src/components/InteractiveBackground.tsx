"use client";

import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  color: string;
  isCross: boolean;
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });
  const smoothMouseRef = useRef<{ x: number; y: number }>({
    x: -1000,
    y: -1000,
  });

  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: -1000,
    y: -1000,
  });

  useEffect(() => {
    // Initial center position so a soft ambient light is visible immediately
    if (typeof window !== "undefined") {
      const initX = window.innerWidth / 2;
      const initY = window.innerHeight / 3;
      mouseRef.current = { x: initX, y: initY, active: true };
      smoothMouseRef.current = { x: initX, y: initY };
      setMousePos({ x: initX, y: initY });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          active: true,
        };
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Canvas Interactive Animation (Medical Crosses & Particle Mesh)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Palet warna Logo ARS UNIBANG
    const colors = [
      "rgba(2, 132, 199, ",   // ARS Vivid Blue
      "rgba(56, 189, 248, ",  // Medical Sky Cyan
      "rgba(11, 37, 69, ",    // Deep Navy
      "rgba(14, 116, 144, ",  // Deep Cyan Ocean
    ];

    const particleCount = width < 768 ? 26 : 50;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        size: Math.random() * 2.5 + 2,
        baseAlpha: Math.random() * 0.35 + 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        isCross: i % 4 === 0, // Setiap 4 partikel ada 1 simbol salib medis (+)
      });
    }

    const drawCross = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      alpha: number
    ) => {
      c.save();
      c.strokeStyle = `${color}${alpha})`;
      c.lineWidth = 1.8;
      c.lineCap = "round";
      const arm = size * 1.8;

      c.beginPath();
      c.moveTo(x - arm, y);
      c.lineTo(x + arm, y);
      c.moveTo(x, y - arm);
      c.lineTo(x, y + arm);
      c.stroke();
      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;
      smoothMouseRef.current.x += (targetX - smoothMouseRef.current.x) * 0.08;
      smoothMouseRef.current.y += (targetY - smoothMouseRef.current.y) * 0.08;

      setMousePos({
        x: smoothMouseRef.current.x,
        y: smoothMouseRef.current.y,
      });

      const mx = smoothMouseRef.current.x;
      const my = smoothMouseRef.current.y;

      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Posisi update
        p.x += p.vx;
        p.y += p.vy;

        // Bounce batas layar
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > width) {
          p.x = width;
          p.vx *= -1;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > height) {
          p.y = height;
          p.vy *= -1;
        }

        // Interaksi kursor (efek dorong lembut jika kursor dekat)
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.hypot(dx, dy);
        const maxDist = 180;

        if (dist < maxDist && dist > 0) {
          const force = (1 - dist / maxDist) * 1.2;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;

          // Garis interaktif dari kursor ke partikel
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(2, 132, 199, ${(1 - dist / maxDist) * 0.45})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Render bentuk (Simbol Salib Medis ARS atau Titik Partikel)
        if (p.isCross) {
          drawCross(ctx, p.x, p.y, p.size, p.color, p.baseAlpha);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.baseAlpha})`;
          ctx.fill();
        }

        // Garis penghubung antar partikel yang berdekatan
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const pDist = Math.hypot(p.x - p2.x, p.y - p2.y);
          const maxLink = 110;

          if (pDist < maxLink) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(2, 132, 199, ${(1 - pDist / maxLink) * 0.16})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none"
    >
      {/* ── 1. Base Gradient Berwarna Biru ARS UNIBANG Jelas & Kuat ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#badbf7] via-[#d5ebfa] to-[#a9d3f5]" />

      {/* ── 2. Ambient Floating Glowing Orbs (Deep Navy, Vivid ARS Blue, Cyan) ── */}
      <div className="absolute -top-[12%] -left-[10%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-br from-[#0b2545]/45 via-[#0284c7]/35 to-transparent blur-[85px] animate-pulse [animation-duration:8s]" />
      <div className="absolute top-[30%] -right-[15%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-bl from-[#38bdf8]/45 via-[#0284c7]/30 to-[#0b2545]/30 blur-[95px] animate-pulse [animation-duration:11s]" />
      <div className="absolute -bottom-[20%] left-[15%] w-[65vw] h-[65vw] max-w-[750px] max-h-[750px] rounded-full bg-gradient-to-t from-[#0284c7]/35 via-[#38bdf8]/35 to-transparent blur-[105px] animate-pulse [animation-duration:9s]" />

      {/* ── 3. Subtle Medical Grid Dots Pattern (Tekstur Halus) ── */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0b2545 1.2px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── 4. Dynamic Interactive Canvas (Partikel & Salib Medis Mengikuti Kursor) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* ── 5. Spotlight Glow Mengikuti Posisi Kursor / Sentuhan ── */}
      {mousePos.x !== -1000 && (
        <>
          {/* Radiant Aura Beam */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-75 ease-out"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              width: "560px",
              height: "560px",
              background:
                "radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, rgba(2, 132, 199, 0.28) 35%, rgba(11, 37, 69, 0.12) 65%, transparent 80%)",
            }}
          />

          {/* Inti Cahaya Kursor Halus */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              width: "200px",
              height: "200px",
              background:
                "radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(56, 189, 248, 0.35) 50%, transparent 80%)",
            }}
          />
        </>
      )}
    </div>
  );
}
