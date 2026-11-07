"use client";

import { ExternalLink } from "lucide-react";
import { motion, type Variants } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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

export default function AboutSection() {
  return (
    <section id="about" className="w-full py-12 sm:py-20 scroll-mt-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariants}
        className="w-full max-w-[1138px] mx-auto px-4 sm:px-8"
      >
        {/* Header Bar: Logo + CLASS ARS UNIBANG / PROFIL */}
        <motion.div variants={itemVariants} className="flex items-center gap-2.5 sm:gap-3.5 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 shadow-sm border border-neutral-200/80 bg-white flex items-center justify-center p-0.5">
            <img
              src="/images/logo-ars.webp"
              alt="Logo Class ARS UNIBANG"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-sm sm:text-lg md:text-xl font-bold tracking-tight flex items-center whitespace-nowrap">
            <span className="font-extrabold uppercase text-[#111] tracking-normal sm:tracking-wide">
              CLASS ARS UNIBANG
            </span>
            <span className="text-[#888] font-light mx-1.5 sm:mx-2">/</span>
            <span className="text-[#666] font-normal uppercase tracking-wider text-xs sm:text-sm md:text-base">
              PROFIL
            </span>
          </h2>
        </motion.div>

        {/* Content: Left Text (65%) & Right 2 Thumbnails (35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Sisi Kiri: 2 Paragraf Penjelasan & Identitas Resmi */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 flex flex-col gap-4 text-[#555] text-sm sm:text-[14.5px] leading-relaxed text-left"
          >
            <p>
              Class ARS UNIBANG adalah kelas mahasiswa Program Studi S1 Administrasi Rumah Sakit, Fakultas Ilmu Kesehatan dan Sains, <strong className="font-semibold text-neutral-800">Universitas Bhakti Asih Tangerang (UNIBANG)</strong> angkatan 2025. Terakreditasi <strong className="font-semibold text-neutral-800">Unggul</strong>, program studi ini berkomitmen menghasilkan lulusan administrasi rumah sakit berbasis digital yang profesional, berakhlak mulia, adaptif, serta mampu berpikir kritis dan inovatif dalam memimpin dinamika pelayanan kesehatan modern.
            </p>
            <p>
              Pendidikan diselenggarakan secara aplikatif berbasis IPTEKS guna membekali calon Sarjana Administrasi Rumah Sakit (<span className="font-semibold text-neutral-800">S.Ars</span>) dengan keterampilan manajerial rumah sakit, tata kelola informasi digital, serta kepemimpinan transformatif. Tak hanya unggul secara akademis, mahasiswa Class ARS UNIBANG senantiasa mengedepankan solidaritas kekeluargaan, integritas, dan pengabdian sosial demi kemajuan almamater dan masyarakat luas.
            </p>

            {/* Badges Ringkasan Identitas Prodi */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                Universitas Bhakti Asih Tangerang
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                Jenjang S1 &bull; Gelar S.Ars
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                Akreditasi Unggul
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                Berbasis Digital & IPTEKS
              </span>
            </div>

            {/* Link Resmi Program Studi */}
            <div className="pt-1">
              <a
                href="https://www.universitasbhaktiasih.ac.id/s1-administrasi-rs/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:text-blue-600 transition-colors group"
              >
                <span>Pelajari Program Studi S1 Administrasi RS di Website Resmi UNIBANG</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 transition-colors" />
              </a>
            </div>
          </motion.div>

          {/* Sisi Kanan: 2 Foto Bersebelahan */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 grid grid-cols-2 gap-3.5 sm:gap-4"
          >
            {/* Foto 1: Gedung Kampus & Mahasiswa */}
            <div className="relative overflow-hidden rounded-2xl border border-[#e9e9e9] bg-[#f9f9f9] shadow-sm aspect-[4/3] group">
              <img
                src="/images/ars/ars-1.webp"
                alt="Gedung Kampus UNIBANG"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Foto 2: Mahasiswa dengan Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-[#e9e9e9] bg-[#f9f9f9] shadow-sm aspect-[4/3] group">
              <img
                src="/images/ars/ars-4.webp"
                alt="Dokumentasi Class ARS UNIBANG"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
