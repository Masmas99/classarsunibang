import GallerySection from "@/components/GallerySection";
import prisma from "@/lib/prisma";

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
    <div className="w-full">
      <GallerySection initialPhotos={gallery} />
    </div>
  );
}
