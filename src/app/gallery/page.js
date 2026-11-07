import Link from "next/link";
import { ChevronRight, Camera } from "lucide-react";
import GallerySection from "@/components/GallerySection";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Galeri Foto",
  description:
    "Dokumentasi momen kebersamaan, kegiatan akademik, praktikum, dan aktivitas mahasiswa Class Administrasi Rumah Sakit UNIBANG.",
  openGraph: {
    title: "Galeri Foto — Class ARS UNIBANG",
    description:
      "Dokumentasi momen kebersamaan, kegiatan akademik, dan aktivitas mahasiswa Class Administrasi Rumah Sakit UNIBANG.",
    url: "https://classarsunibang.vercel.app/gallery",
    images: ["/og-image.png"],
  },
};

async function getGallery() {
  "use cache";
  try {
    const list = await prisma.gallery.findMany({
      orderBy: { id: "asc" },
    });
    return list.map((item) => ({
      id: item.id,
      src: item.src,
      alt: item.alt,
      title: item.title,
    }));
  } catch (error) {
    console.error("Failed to load gallery on server:", error);
    return [];
  }
}

export default async function GalleryPage() {
  const gallery = await getGallery();

  return (
    <div className="w-full min-h-screen bg-white">
      {/* ── Top Breadcrumbs & Page Header ── */}
      <section className="w-full bg-[#fbfcfd] border-b border-[#f0f0f0] pt-8 pb-10 sm:pt-12 sm:pb-14">
        <div className="w-full max-w-[1138px] mx-auto px-4 sm:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 mb-6">
            <Link href="/" className="hover:text-black transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-semibold text-neutral-900">Gallery</span>
          </nav>

          {/* Badge & Title */}
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-800 w-fit">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>Dokumentasi Kegiatan • Class ARS UNIBANG</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111]">
              Galeri Foto & Aktivitas
            </h1>
            <p className="text-neutral-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              Arsip momen kebersamaan, perkuliahan, praktikum kesehatan, dan seluruh dokumentasi berharga mahasiswa Class ARS UNIBANG angkatan 2025.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Gallery Section Component ── */}
      <div className="w-full -mt-6">
        <GallerySection initialPhotos={gallery} />
      </div>
    </div>
  );
}
