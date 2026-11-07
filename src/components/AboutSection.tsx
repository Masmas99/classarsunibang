"use client";

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
        viewport={{ once: true, margin: "0px 0px -80px 0px" }}
        variants={containerVariants}
        className="w-full max-w-[1138px] mx-auto px-4 sm:px-8"
      >
        {/* Header Bar: Logo + CLASS ARS UNIBANG / PROFIL */}
        <motion.div variants={itemVariants} className="flex items-center gap-3.5 mb-8">
          <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-sm border border-neutral-200/80 bg-white flex items-center justify-center p-0.5">
            <img
              src="/images/logo-ars.png"
              alt="Logo Class ARS UNIBANG"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight flex items-center">
            <span className="font-extrabold uppercase text-[#111] tracking-wide">
              CLASS ARS UNIBANG
            </span>
            <span className="text-[#888] font-light mx-2">/</span>
            <span className="text-[#666] font-normal uppercase tracking-wider text-sm sm:text-base">
              PROFIL
            </span>
          </h2>
        </motion.div>

        {/* Content: Left Text (65%) & Right 2 Thumbnails (35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Sisi Kiri: 2 Paragraf Penjelasan */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 flex flex-col gap-4 text-[#555] text-sm sm:text-[14.5px] leading-relaxed text-justify sm:text-left"
          >
            <p>
              Class ARS UNIBANG adalah kelas mahasiswa modern yang menggabungkan keunggulan di bidang teknologi, administrasi kesehatan, dan sistem manajemen rumah sakit untuk menciptakan lulusan yang siap bersaing di panggung masa depan. Dengan kurikulum berbasis kompetensi dan fasilitas terkini, Class ARS UNIBANG membekali mahasiswa dengan keterampilan digital, analisis manajerial, dan kepemimpinan yang dibutuhkan di era transformasi industri kesehatan.
            </p>
            <p>
              Tak hanya fokus pada keilmuan akademik, kelas ini juga menanamkan nilai-nilai integritas, solidaritas kekeluargaan, dan dedikasi sosial agar setiap mahasiswa mampu berkontribusi positif bagi kemajuan almamater dan pelayanan kesehatan masyarakat. Bergabunglah bersama Class ARS UNIBANG dan jadilah bagian dari generasi unggul yang kompeten, berkarakter, dan berdaya saing global!
            </p>
          </motion.div>

          {/* Sisi Kanan: 2 Foto Bersebelahan */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 grid grid-cols-2 gap-3.5 sm:gap-4"
          >
            {/* Foto 1: Gedung Kampus & Mahasiswa */}
            <div className="relative overflow-hidden rounded-2xl border border-[#e9e9e9] bg-[#f9f9f9] shadow-sm aspect-[4/3] group">
              <img
                src="/images/ars/ars-1.jpg"
                alt="Gedung Kampus UNIBANG"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Foto 2: Mahasiswa dengan Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-[#e9e9e9] bg-[#f9f9f9] shadow-sm aspect-[4/3] group">
              <img
                src="/images/ars/ars-4.jpg"
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
