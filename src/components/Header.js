"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Students", href: "/students" },
    { name: "Gallery", href: "/gallery" },
  ];

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-[#e9e9e9] sticky top-0 z-50">
      <div className="w-full h-14 sm:h-[70px] px-4 sm:px-6 flex items-center justify-center">
        <nav
          className="flex items-center justify-center gap-7 sm:gap-10 text-[14px] sm:text-[15px] whitespace-nowrap"
          aria-label="Main navigation"
        >
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
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
