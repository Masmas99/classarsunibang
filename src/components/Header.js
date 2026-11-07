"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Students", href: "/students" },
    { name: "Gallery", href: "/gallery" },
  ];

  const handleNavClick = (e, item) => {
    if (item.href === "/" || item.name === "Home") {
      if (pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (window.location.hash) {
          window.history.pushState(null, "", "/");
        }
      }
    }
  };

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-[#e9e9e9] shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
          : "bg-white border-b border-[#e9e9e9]"
      }`}
    >
      <div className="w-full h-14 sm:h-[70px] px-4 sm:px-6 flex items-center justify-center">
        <nav
          className="flex items-center justify-center gap-7 sm:gap-10 text-[14px] sm:text-[15px] whitespace-nowrap"
          aria-label="Main navigation"
        >
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  (item.name === "Students" && pathname === "/students") ||
                  (item.name === "Gallery" && pathname === "/gallery");

            return (
              <Link
                key={item.name}
                href={item.href}
                scroll={true}
                onClick={(e) => handleNavClick(e, item)}
                className={`py-1 transition-colors duration-200 ${
                  isActive
                    ? "font-bold text-[#09090b]"
                    : "font-normal text-[#71717a] hover:text-[#09090b]"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
