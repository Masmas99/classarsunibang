"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only show on first visit in the current session
    try {
      if (sessionStorage.getItem("ars_intro_seen") === "true") {
        setIsVisible(false);
        return;
      }
    } catch {
      // sessionStorage unavailable
    }

    // Lock scroll temporarily
    document.body.style.overflow = "hidden";

    const duration = 900; // 0.9s smooth loading
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const ratio = Math.min(1, elapsed / duration);
      // Smooth ease-out
      const eased = Math.round(100 * (1 - Math.pow(1 - ratio, 2.5)));
      setProgress(Math.min(100, eased));

      if (ratio >= 1) {
        clearInterval(interval);
      }
    }, 20);

    // Start fade out at 1.05s
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
      document.body.style.overflow = "unset";
      try {
        sessionStorage.setItem("ars_intro_seen", "true");
      } catch {}
    }, 1050);

    // Completely unmount at 1.45s
    const unmountTimer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "unset";
    }, 1450);

    // Hard fallback safety: unlock scroll & hide after 1.8s
    const fallbackTimer = setTimeout(() => {
      document.body.style.overflow = "unset";
      setIsVisible(false);
    }, 1800);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
      clearTimeout(fallbackTimer);
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      key="ars-loading-screen"
      className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 select-none transition-all duration-400 ease-out ${
        isFadingOut
          ? "opacity-0 pointer-events-none scale-[1.01]"
          : "opacity-100 pointer-events-auto scale-100"
      }`}
      style={{
        animation: "ars-loader-dismiss 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      {/* Subtle Ambient Glow */}
      <div className="absolute w-72 h-72 rounded-full bg-neutral-100/80 blur-3xl -z-10 pointer-events-none" />

      {/* Logo Card with Pulse */}
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-[#0b2545]/15 blur-sm pointer-events-none animate-pulse" />

        {/* Logo Box */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-neutral-200/90 shadow-md p-2.5 flex items-center justify-center">
          <img
            src="/images/logo-ars.webp"
            alt="Logo Class ARS UNIBANG"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Typography */}
      <div className="flex flex-col items-center mt-6 text-center">
        <h1 className="text-[15px] sm:text-base font-extrabold uppercase text-[#111] tracking-widest">
          CLASS ARS UNIBANG
        </h1>
        <p className="text-xs sm:text-[13px] text-neutral-400 font-medium tracking-wide mt-1">
          Administrasi Rumah Sakit &bull; Universitas Bhakti Asih Tangerang
        </p>
      </div>

      {/* Minimalist Progress Bar */}
      <div className="w-44 sm:w-52 mt-7 flex flex-col items-center">
        <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/60 p-[1px]">
          <div
            className="h-full bg-[#0b2545] rounded-full transition-all duration-75 ease-out"
            style={{
              width: `${progress}%`,
              animation: "ars-progress-fill 1.0s cubic-bezier(0.1, 0.5, 0.2, 1) forwards",
            }}
          />
        </div>
        <div className="flex items-center justify-between w-full mt-2 px-0.5 text-[11px] font-mono text-neutral-400">
          <span className="text-[10px] tracking-wider uppercase">Memuat</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
