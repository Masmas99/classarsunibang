"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "motion/react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Footer1() {
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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Students", href: "/#students" },
    { name: "Gallery", href: "/#gallery" },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href === "/" && window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.location.hash) {
        window.history.pushState(null, "", "/");
      }
    }
  };

  return (
    <footer className="w-full py-12 bg-white text-[#111] border-t border-[#f0f0f0] overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariants}
        className="container mx-auto px-4 flex flex-col items-center gap-8 mb-10"
      >
        {/* Logo Class ARS UNIBANG */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-2.5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-xs border border-neutral-200/90 bg-white flex items-center justify-center p-1">
            <img
              src="/images/logo-ars.webp"
              alt="Logo Class ARS UNIBANG"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-extrabold uppercase text-[#111] tracking-wider text-sm sm:text-base">
            CLASS ARS UNIBANG
          </span>
        </motion.div>

        {/* Navigation Links */}
        <motion.nav
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm sm:text-base font-medium relative z-10"
        >
          {navLinks.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href}
                scroll={true}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative px-3 py-1.5 text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
              >
                <span>{item.name}</span>
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        {/* Social Media: Hanya Instagram */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 bg-neutral-50/80 hover:bg-white shadow-xs hover:shadow-md hover:border-pink-300 hover:text-pink-600 transition-all text-neutral-700 text-sm font-medium group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Instagram Class ARS UNIBANG"
          >
            <InstagramIcon className="w-4 h-4 text-pink-600 group-hover:scale-110 transition-transform" />
            <span>Instagram</span>
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Decorative Repeating Divider */}
      <motion.div
        className="w-full h-10 border-y border-neutral-200 opacity-25 bg-[repeating-linear-gradient(315deg,#000_0,#000_1px,transparent_0,transparent_50%)]"
        style={{ backgroundSize: "10px 10px" }}
        initial={{ backgroundPositionX: "0%" }}
        whileInView={{ backgroundPositionX: "100%" }}
        viewport={{ once: true }}
        transition={{
          ease: "linear",
          duration: 20,
          repeat: Infinity,
        }}
      />

      {/* Copyright */}
      <motion.div
        className="container mx-auto px-4 mt-8 text-center text-xs sm:text-sm text-neutral-400 flex items-center justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
      >
        <p>&copy; 2025 Class ARS UNIBANG. All rights reserved.</p>
      </motion.div>
    </footer>
  );
}
