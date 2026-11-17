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

function getCleanGallerySrc(src, id = 1) {
  if (!src || src.startsWith("data:") || src.length > 500) {
    const fallbackIndex = ((Math.abs(id) - 1) % 5) + 1;
    return `/images/gallery/hero-ars-${fallbackIndex}.webp`;
  }
  return src;
}

async function getGallery() {
  "use cache";
  try {
    const query = prisma.gallery.findMany({
      take: 20,
      orderBy: { id: "asc" },
    });
    const timeout = new Promise((resolve) =>
      setTimeout(() => resolve([]), 2000)
    );
    const list = await Promise.race([query, timeout]);
    if (list && list.length > 0) {
      return list.map((item) => ({
        id: item.id,
        src: getCleanGallerySrc(item.src, item.id),
        alt: item.alt,
        title: item.title,
      }));
    }
  } catch (error) {
    console.error("Failed to load gallery on server:", error);
  }
  return [];
}

export default async function GalleryPage() {
  const gallery = await getGallery();

  return (
    <main className="w-full">
      <GallerySection initialPhotos={gallery} />
    </main>
  );
}
