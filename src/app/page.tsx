import TiltedGridHeroDemo from "@/components/ui/tilted-grid-hero-demo";
import AboutSection from "@/components/AboutSection";
import StudentsSection, { Student } from "@/components/StudentsSection";
import GallerySection, { GalleryItem } from "@/components/GallerySection";
import prisma, { withDbRetry } from "@/lib/prisma";
import { INITIAL_STUDENTS, INITIAL_GALLERY } from "@/lib/initial-data";

async function getStudents(): Promise<Student[]> {
  "use cache";
  try {
    const query = withDbRetry(() =>
      prisma.student.findMany({
        orderBy: { id: "asc" },
      })
    );
    const timeout = new Promise<Student[]>((resolve) =>
      setTimeout(() => resolve([]), 8000)
    );
    const list = await Promise.race([query, timeout]);
    if (list && list.length > 0) {
      return list
        .map((s) => ({
          id: s.id,
          name: s.name,
          role: s.role,
          image: s.image && s.image.trim() !== "" ? s.image : "/images/students/student-1.webp",
        }))
        .sort((a, b) =>
          a.name.localeCompare(b.name, "id", { sensitivity: "base" })
        );
    }
  } catch (error) {
    console.error("Failed to load students on server:", error);
  }
  return INITIAL_STUDENTS.map((s) => ({
    id: s.id,
    name: s.name,
    role: s.role,
    image: s.image,
  })).sort((a, b) =>
    a.name.localeCompare(b.name, "id", { sensitivity: "base" })
  );
}

function getCleanGallerySrc(src?: string, id: number = 1): string {
  if (!src || src.trim() === "") {
    const fallbackIndex = ((Math.abs(id) - 1) % 5) + 1;
    return `/images/gallery/hero-ars-${fallbackIndex}.webp`;
  }
  return src;
}

async function getGallery(): Promise<GalleryItem[]> {
  "use cache";
  try {
    const query = withDbRetry(() =>
      prisma.gallery.findMany({
        orderBy: { id: "asc" },
      })
    );
    const timeout = new Promise<GalleryItem[]>((resolve) =>
      setTimeout(() => resolve([]), 8000)
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
  return INITIAL_GALLERY.map((item) => ({
    id: item.id,
    src: getCleanGallerySrc(item.src, item.id),
    alt: item.alt,
    title: item.title,
  }));
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
