"use client";

import React, { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer1 from "@/components/ui/footer-section-1";

interface NotFoundContextType {
  setIsNotFound: (val: boolean) => void;
}

const NotFoundContext = createContext<NotFoundContextType>({
  setIsNotFound: () => {},
});

export const useNotFound = () => useContext(NotFoundContext);

export default function ConditionalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isNotFound, setIsNotFound] = useState(false);
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin || isNotFound) {
    return (
      <NotFoundContext.Provider value={{ setIsNotFound }}>
        <main className="flex-1 w-full min-h-screen">{children}</main>
      </NotFoundContext.Provider>
    );
  }

  return (
    <NotFoundContext.Provider value={{ setIsNotFound }}>
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer1 />
    </NotFoundContext.Provider>
  );
}
