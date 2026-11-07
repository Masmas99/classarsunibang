import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Class ARS UNIBANG — Administrasi Rumah Sakit",
  description: "Website Resmi Class ARS UNIBANG - Fakultas Ilmu Kesehatan dan Sains",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#111] antialiased">
        <Header />
        <main className="flex-1 w-full">{children}</main>
      </body>
    </html>
  );
}
