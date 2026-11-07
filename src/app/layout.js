import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalShell from "@/components/ConditionalShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://classarsunibang.vercel.app"),
  title: {
    default: "Class ARS UNIBANG — Administrasi Rumah Sakit",
    template: "%s | Class ARS UNIBANG",
  },
  description:
    "Website Resmi Class Administrasi Rumah Sakit (ARS) UNIBANG - Fakultas Ilmu Kesehatan dan Sains, Universitas Bhakti Asih Tangerang.",
  keywords: [
    "Class ARS UNIBANG",
    "Administrasi Rumah Sakit",
    "UNIBANG",
    "Universitas Bhakti Asih",
    "Universitas Bhakti Asih Tangerang",
    "Mahasiswa ARS",
    "Fakultas Ilmu Kesehatan dan Sains",
    "S.Ars",
  ],
  authors: [{ name: "Class ARS UNIBANG" }],
  creator: "Class ARS UNIBANG",
  publisher: "Class ARS UNIBANG",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/images/logo-ars.webp", type: "image/webp" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://classarsunibang.vercel.app",
    siteName: "Class ARS UNIBANG",
    title: "Class ARS UNIBANG — Administrasi Rumah Sakit",
    description:
      "Website Resmi Class Administrasi Rumah Sakit (ARS) UNIBANG - Fakultas Ilmu Kesehatan dan Sains, Universitas Bhakti Asih Tangerang.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Class ARS UNIBANG - Administrasi Rumah Sakit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Class ARS UNIBANG — Administrasi Rumah Sakit",
    description:
      "Website Resmi Class Administrasi Rumah Sakit (ARS) UNIBANG - Fakultas Ilmu Kesehatan dan Sains.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#111] antialiased">
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}
