"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
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

    const duration = 1000; // 1s smooth loading
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

    // Fade out and mark session as seen after 1.25s
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "unset";
      try {
        sessionStorage.setItem("ars_intro_seen", "true");
      } catch {}
    }, 1250);

    // Hard fallback safety: unlock scroll & hide after 1.8s
    const fallbackTimer = setTimeout(() => {
      document.body.style.overflow = "unset";
      setIsVisible(false);
    }, 1800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="ars-loading-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 select-none pointer-events-auto"
          style={{
            animation: "ars-loader-dismiss 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute w-72 h-72 rounded-full bg-neutral-100/80 blur-3xl -z-10 pointer-events-none" />

          {/* Logo Card with Pulse */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="relative"
          >
            {/* Outer Subtle Pulse Ring */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.35, 0.1, 0.35],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-2xl bg-[#0b2545]/20 blur-sm pointer-events-none"
            />

            {/* Logo Box */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-neutral-200/90 shadow-lg p-2.5 flex items-center justify-center">
              <img
                src="/images/logo-ars.webp"
                alt="Logo Class ARS UNIBANG"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Typography */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="flex flex-col items-center mt-6 text-center"
          >
            <h1 className="text-[15px] sm:text-base font-extrabold uppercase text-[#111] tracking-widest">
              CLASS ARS UNIBANG
            </h1>
            <p className="text-xs sm:text-[13px] text-neutral-400 font-medium tracking-wide mt-1">
              Administrasi Rumah Sakit &bull; Universitas Bhakti Asih Tangerang
            </p>
          </motion.div>

          {/* Minimalist Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.9 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="w-44 sm:w-52 mt-7 flex flex-col items-center"
          >
            <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/60 p-[1px]">
              <motion.div
                className="h-full bg-[#0b2545] rounded-full"
                style={{
                  width: `${progress}%`,
                  animation: "ars-progress-fill 1.1s cubic-bezier(0.1, 0.5, 0.2, 1) forwards",
                }}
                transition={{ ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-between w-full mt-2 px-0.5 text-[11px] font-mono text-neutral-400">
              <span className="text-[10px] tracking-wider uppercase">Memuat</span>
              <span>{progress}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
