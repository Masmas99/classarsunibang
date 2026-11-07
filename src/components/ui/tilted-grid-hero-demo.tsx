"use client";

import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";
import { motion, type Variants } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
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

const IMAGES = [
  {
    src: "/images/ars/ars-1.webp",
    alt: "Foto bersama Class ARS UNIBANG 1",
  },
  {
    src: "/images/ars/ars-4.webp",
    alt: "Class ARS UNIBANG dengan Bendera Himpunan",
  },
  {
    src: "/images/ars/ars-2.webp",
    alt: "Foto bersama Class ARS UNIBANG 2",
  },
  {
    src: "/images/ars/ars-5.webp",
    alt: "Dokumentasi Kegiatan Mahasiswa ARS UNIBANG",
  },
  {
    src: "/images/ars/ars-3.webp",
    alt: "Sesi Kasual Kampus Class ARS UNIBANG",
  },
  {
    src: "/images/ars/ars-1.webp",
    alt: "Class ARS UNIBANG Formasi Lapangan",
  },
  {
    src: "/images/ars/ars-4.webp",
    alt: "Kebersamaan Mahasiswa ARS UNIBANG",
  },
  {
    src: "/images/ars/ars-2.webp",
    alt: "Dokumentasi Angkatan ARS UNIBANG",
  },
  {
    src: "/images/ars/ars-5.webp",
    alt: "Keluarga Besar Mahasiswa ARS UNIBANG",
  },
  {
    src: "/images/ars/ars-3.webp",
    alt: "Kenangan Kampus ARS UNIBANG",
  },
];

export default function TiltedGridHeroDemo() {
  return (
    <section id="home" className="w-full scroll-mt-24">
      <TiltedGridHero
        images={IMAGES}
        gap={6}
        curve={80}
        className="h-[520px] sm:h-[560px] w-full rounded-none border-b border-[#e9e9e9] bg-transparent"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="relative z-10 flex h-full flex-col items-center justify-start pt-12 sm:pt-16 text-center pointer-events-none"
        >
          <motion.div variants={itemVariants} className="px-6">
            <h1 className="text-balance text-3xl sm:text-5xl font-medium tracking-tight text-[#111]">
              Welcome Class
              <br />
              ARS UNIBANG
            </h1>
          </motion.div>
        </motion.div>
      </TiltedGridHero>
    </section>
  );
}
