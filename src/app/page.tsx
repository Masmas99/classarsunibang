import TiltedGridHeroDemo from "@/components/ui/tilted-grid-hero-demo";
import AboutSection from "@/components/AboutSection";
import StudentsSection, { Student } from "@/components/StudentsSection";
import GallerySection, { GalleryItem } from "@/components/GallerySection";
import prisma from "@/lib/prisma";

async function getStudents(): Promise<Student[]> {
  "use cache";
  try {
    const query = prisma.student.findMany({
      take: 5,
      orderBy: { id: "asc" },
    });
    const timeout = new Promise<Student[]>((resolve) =>
      setTimeout(() => resolve([]), 2000)
    );
    const list = await Promise.race([query, timeout]);
    if (list && list.length > 0) {
      return list
        .map((s) => ({
          id: s.id,
          name: s.name,
          role: s.role,
          image:
            s.image && !s.image.startsWith("data:") && s.image.length < 500
              ? s.image
              : "/images/students/student-1.webp",
        }))
        .sort((a, b) =>
          a.name.localeCompare(b.name, "id", { sensitivity: "base" })
        );
    }
  } catch (error) {
    console.error("Failed to load students on server:", error);
  }
  return [];
}

function getCleanGallerySrc(src?: string, id: number = 1): string {
  if (!src || src.startsWith("data:") || src.length > 500) {
    const fallbackIndex = ((Math.abs(id) - 1) % 5) + 1;
    return `/images/gallery/hero-ars-${fallbackIndex}.webp`;
  }
  return src;
}

async function getGallery(): Promise<GalleryItem[]> {
  "use cache";
  try {
    const query = prisma.gallery.findMany({
      take: 20,
      orderBy: { id: "asc" },
    });
    const timeout = new Promise<GalleryItem[]>((resolve) =>
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

export default async function Home() {
  const [students, gallery] = await Promise.all([
    getStudents(),
    getGallery(),
  ]);

  return (
    <div className="w-full flex flex-col">
      <TiltedGridHeroDemo />
      <AboutSection />
      <StudentsSection initialStudents={students} />
      <GallerySection initialPhotos={gallery} />
    </div>
  );
}
