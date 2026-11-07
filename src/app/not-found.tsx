"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { useNotFound } from "@/components/ConditionalShell";

export default function NotFound() {
  const { setIsNotFound } = useNotFound();

  useEffect(() => {
    setIsNotFound(true);
    return () => {
      setIsNotFound(false);
    };
  }, [setIsNotFound]);

  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col items-center justify-center px-4 py-12 overflow-hidden text-center select-none">
      {/* Subtle Grid Background Pattern */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-70"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
        {/* Logo Badge */}
        <div className="mb-6 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-md p-2 flex items-center justify-center">
            <img
              src="/images/logo-ars.png"
              alt="Logo Class ARS UNIBANG"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* 404 Graphic Headline */}
        <div className="relative mb-3">
          <h1 className="text-8xl sm:text-9xl font-black tracking-tight text-slate-900">
            404
          </h1>
        </div>

        {/* Title & Description */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
          Maaf, halaman yang Anda cari tidak tersedia, telah dipindahkan, atau alamat URL yang dimasukkan keliru.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.href = "/";
                }
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm font-semibold shadow-2xs hover:border-slate-300 transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Halaman Sebelumnya</span>
          </button>
        </div>
      </div>
    </div>
  );
}
