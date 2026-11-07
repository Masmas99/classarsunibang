"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, type Variants } from "motion/react";

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  title: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

const COLUMN_1: GalleryItem[] = [
  {
    id: 1,
    src: "/images/ars/ars-4.webp",
    alt: "Himpunan Mahasiswa ARS",
    title: "Kebersamaan Himpunan ARS UNIBANG",
  },
  {
    id: 2,
    src: "/images/ars/ars-1.webp",
    alt: "Kegiatan Kampus",
    title: "Aktivitas Perkuliahan di Kampus",
  },
  {
    id: 3,
    src: "/images/ars/ars-3.webp",
    alt: "Diskusi Mahasiswa",
    title: "Diskusi & Interaksi Mahasiswa",
  },
];

const COLUMN_2: GalleryItem[] = [
  {
    id: 4,
    src: "/images/ars/ars-2.webp",
    alt: "Foto Angkatan Bersama",
    title: "Potret Seluruh Angkatan Class ARS",
  },
  {
    id: 5,
    src: "/images/ars/ars-5.webp",
    alt: "Formasi Gedung Fakultas",
    title: "Formasi di Depan Gedung Perkuliahan",
  },
  {
    id: 6,
    src: "/images/ars/ars-1.webp",
    alt: "Momen Lapangan",
    title: "Dokumentasi Kegiatan Luar Ruangan",
  },
];

const COLUMN_3: GalleryItem[] = [
  {
    id: 7,
    src: "/images/ars/ars-5.webp",
    alt: "Dokumentasi Utama",
    title: "Momen Kebersamaan Akbar Angkatan",
  },
  {
    id: 8,
    src: "/images/ars/ars-3.webp",
    alt: "Kebersamaan Lapangan",
    title: "Aktivitas Luar Ruangan & Pengakraban",
  },
  {
    id: 9,
    src: "/images/ars/ars-2.webp",
    alt: "Potret Angkatan",
    title: "Potret Angkatan Mahasiswa ARS",
  },
];

const COLUMN_4: GalleryItem[] = [
  {
    id: 10,
    src: "/images/ars/ars-2.webp",
    alt: "Sesi Akademik",
    title: "Sesi Pembelajaran Interaktif",
  },
  {
    id: 11,
    src: "/images/ars/ars-4.webp",
    alt: "Formasi Gedung",
    title: "Dokumentasi Kampus UNIBANG",
  },
  {
    id: 12,
    src: "/images/ars/ars-1.webp",
    alt: "Kenangan Angkatan",
    title: "Kenangan Berharga Class ARS UNIBANG",
  },
];

const ALL_PHOTOS: GalleryItem[] = [
  ...COLUMN_1,
  ...COLUMN_2,
  ...COLUMN_3,
  ...COLUMN_4,
];

interface GallerySectionProps {
  initialPhotos?: GalleryItem[];
}

export default function GallerySection({ initialPhotos }: GallerySectionProps) {
  const [photos, setPhotos] = useState<GalleryItem[]>(() => {
    if (initialPhotos && initialPhotos.length > 0) {
      return initialPhotos;
    }
    return ALL_PHOTOS;
  });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Sync state if initialPhotos updates from server revalidation
  useEffect(() => {
    if (initialPhotos && initialPhotos.length > 0) {
      setPhotos(initialPhotos);
    }
  }, [initialPhotos]);

  // Keep photos in sync with Neon database in the background without layout flicker
  useEffect(() => {
    fetch("/api/gallery", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPhotos(data);
        }
      })
      .catch(() => {});
  }, []);

  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : photos.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! < photos.length - 1 ? prev! + 1 : 0));
  };

  // Close modal on Escape key, arrow keys navigation & manage body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev < photos.length - 1 ? prev + 1 : 0) : null
        );
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev > 0 ? prev - 1 : photos.length - 1) : null
        );
      }
    };

    if (selectedIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedIndex, photos.length]);

  const renderPhotoCard = (item: GalleryItem, prefix = "card") => {
    const photoIndex = photos.findIndex((p) => p.id === item.id);
    return (
      <motion.div
        variants={itemVariants}
        key={`${prefix}-${item.id}`}
        onClick={() => setSelectedIndex(photoIndex)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSelectedIndex(photoIndex);
          }
        }}
        className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0b2545]/30"
      >
        <img
          src={item.src}
          alt={item.alt}
          onError={(e) => {
            if (!item.src?.startsWith("data:")) {
              e.currentTarget.src = "/images/ars/ars-1.webp";
            }
          }}
          className="w-full h-auto block group-hover:scale-105 transition-transform duration-500 ease-out select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4 pointer-events-none">
          <div className="text-white text-xs sm:text-sm font-semibold truncate drop-shadow-md">
            {item.title}
          </div>
        </div>
      </motion.div>
    );
  };

  // Split photos into columns for responsive masonry layout
  // On mobile (< md): 2 continuous columns to prevent empty gaps between rows
  const mobileCol1 = photos.filter((_, i) => i % 2 === 0);
  const mobileCol2 = photos.filter((_, i) => i % 2 === 1);

  // On desktop (>= md): 4 continuous columns
  const desktopCol1 = photos.filter((_, i) => i % 4 === 0);
  const desktopCol2 = photos.filter((_, i) => i % 4 === 1);
  const desktopCol3 = photos.filter((_, i) => i % 4 === 2);
  const desktopCol4 = photos.filter((_, i) => i % 4 === 3);

  return (
    <section id="gallery" className="w-full py-12 sm:py-20 scroll-mt-24 border-t border-[#f0f0f0]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        variants={containerVariants}
        className="w-full max-w-[1138px] mx-auto px-4 sm:px-8"
      >
        {/* Header Bar: Icon Gallery + CLASS ARS UNIBANG / GALLERY */}
        <motion.div variants={itemVariants} className="flex items-center gap-3.5 mb-6">
          <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-sm border border-neutral-200/80 bg-white flex items-center justify-center p-2">
            <img
              src="/images/logo-gallery.webp"
              alt="Icon Gallery Class ARS UNIBANG"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight flex items-center">
            <span className="font-extrabold uppercase text-[#111] tracking-wide">
              CLASS ARS UNIBANG
            </span>
            <span className="text-[#888] font-light mx-2">/</span>
            <span className="text-[#666] font-normal uppercase tracking-wider text-sm sm:text-base">
              GALLERY
            </span>
          </h2>
        </motion.div>

        {/* Description */}
        <motion.p variants={itemVariants} className="text-[#555] text-sm sm:text-[14.5px] leading-relaxed mb-8">
          Dokumentasi momen kebersamaan, kegiatan akademik, dan aktivitas mahasiswa Class Administrasi Rumah Sakit UNIBANG.
        </motion.p>

        {/* ── Masonry Mosaic Collage Grid (Responsif Kontinu Tanpa Gap Kosong) ── */}
        {/* Tampilan Mobile (< md): 2 Kolom Kontinu Murni */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 md:hidden">
          <div className="flex flex-col gap-2.5 sm:gap-3.5">
            {mobileCol1.map((item) => renderPhotoCard(item, "mob-col1"))}
          </div>
          <div className="flex flex-col gap-2.5 sm:gap-3.5">
            {mobileCol2.map((item) => renderPhotoCard(item, "mob-col2"))}
          </div>
        </div>

        {/* Tampilan Desktop (>= md): 4 Kolom Kontinu */}
        <div className="hidden md:grid md:grid-cols-4 gap-3.5">
          <div className="flex flex-col gap-3.5">
            {desktopCol1.map((item) => renderPhotoCard(item, "desk-col1"))}
          </div>
          <div className="flex flex-col gap-3.5">
            {desktopCol2.map((item) => renderPhotoCard(item, "desk-col2"))}
          </div>
          <div className="flex flex-col gap-3.5">
            {desktopCol3.map((item) => renderPhotoCard(item, "desk-col3"))}
          </div>
          <div className="flex flex-col gap-3.5">
            {desktopCol4.map((item) => renderPhotoCard(item, "desk-col4"))}
          </div>
        </div>
      </motion.div>

      {/* ── Modal Lightbox Preview Foto (Full Gambar dengan Navigasi Next & Prev di Bawahnya) ── */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close Button di sudut kanan atas */}
          <button
            onClick={() => setSelectedIndex(null)}
            aria-label="Tutup foto"
            className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Tombol Panah Kiri (Desktop Side Arrow) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Foto sebelumnya"
            className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white hidden sm:flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-sm hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Tombol Panah Kanan (Desktop Side Arrow) */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Foto selanjutnya"
            className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white hidden sm:flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-sm hover:scale-105"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Kontainer Foto & Navigasi di Bawah */}
          <div
            className="relative flex flex-col items-center max-w-[94vw] max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Foto Full Mengikuti Rasio & Ukuran Asli */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
              <img
                key={selectedPhoto.src + selectedIndex}
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                onError={(e) => {
                  if (!selectedPhoto.src?.startsWith("data:")) {
                    e.currentTarget.src = "/images/ars/ars-1.webp";
                  }
                }}
                className="max-w-[94vw] max-h-[76vh] sm:max-h-[80vh] w-auto h-auto object-contain rounded-2xl sm:rounded-3xl block select-none animate-in fade-in duration-200"
              />
            </div>

            {/* Kontrol Navigasi di Bawah Foto: Prev, Counter, Next */}
            <div className="mt-3.5 sm:mt-4 flex items-center justify-center gap-3 select-none">
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white backdrop-blur-md transition-all flex items-center gap-1.5 text-xs sm:text-sm font-semibold cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-white/80 backdrop-blur-md text-xs sm:text-sm font-medium">
                {selectedIndex! + 1} / {photos.length}
              </span>

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 rounded-full bg-white/25 hover:bg-white/35 active:scale-95 text-white backdrop-blur-md transition-all flex items-center gap-1.5 text-xs sm:text-sm font-bold cursor-pointer shadow-lg border border-white/20"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
