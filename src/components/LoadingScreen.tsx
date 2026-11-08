"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Lock scroll while loading
    document.body.style.overflow = "hidden";

    // Smooth incremental progress simulation
    const startTime = Date.now();
    const duration = 1200; // 1.2 seconds smooth load

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, (elapsed / duration) * 100);

      // Ease-out easing curve for natural feeling
      const eased = Math.round(100 * (1 - Math.pow(1 - rawProgress / 100, 2)));
      setProgress(Math.min(100, eased));

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = "unset";
        }, 250);
      }
    }, 20);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 select-none pointer-events-auto"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute w-72 h-72 rounded-full bg-neutral-100/80 blur-3xl -z-10 pointer-events-none" />

          {/* Logo Card with Pulse */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
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
            transition={{ delay: 0.15, duration: 0.4 }}
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
            transition={{ delay: 0.25, duration: 0.3 }}
            className="w-44 sm:w-52 mt-7 flex flex-col items-center"
          >
            <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/60 p-[1px]">
              <motion.div
                className="h-full bg-[#0b2545] rounded-full"
                style={{ width: `${progress}%` }}
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
