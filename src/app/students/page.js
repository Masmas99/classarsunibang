import StudentsSection from "@/components/StudentsSection";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Daftar Mahasiswa",
  description:
    "Daftar direktori mahasiswa aktif Class Administrasi Rumah Sakit (ARS) UNIBANG angkatan 2025 - Fakultas Ilmu Kesehatan dan Sains, Universitas Bhakti Asih Tangerang.",
  openGraph: {
    title: "Daftar Mahasiswa — Class ARS UNIBANG",
    description:
      "Daftar direktori mahasiswa aktif Class Administrasi Rumah Sakit (ARS) UNIBANG angkatan 2025 - Universitas Bhakti Asih Tangerang.",
    url: "https://classarsunibang.vercel.app/students",
    images: ["/og-image.png"],
  },
};

async function getStudents() {
  "use cache";
  try {
    const query = prisma.student.findMany({
      take: 5,
      orderBy: { id: "asc" },
    });
    const timeout = new Promise((resolve) =>
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

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <main className="w-full">
      <StudentsSection initialStudents={students} />
    </main>
  );
}
