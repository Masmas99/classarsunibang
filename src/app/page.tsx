import TiltedGridHeroDemo from "@/components/ui/tilted-grid-hero-demo";
import AboutSection from "@/components/AboutSection";
import StudentsSection, { Student } from "@/components/StudentsSection";
import GallerySection, { GalleryItem } from "@/components/GallerySection";
import prisma from "@/lib/prisma";

async function getStudents(): Promise<Student[]> {
  "use cache";
  try {
    const list = await prisma.student.findMany();
    return list.sort((a, b) =>
      a.name.localeCompare(b.name, "id", { sensitivity: "base" })
    );
  } catch (error) {
    console.error("Failed to load students on server:", error);
    return [];
  }
}

async function getGallery(): Promise<GalleryItem[]> {
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
