import StudentsSection from "@/components/StudentsSection";
import prisma, { withDbRetry } from "@/lib/prisma";
import { INITIAL_STUDENTS } from "@/lib/initial-data";

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
    const query = withDbRetry(() =>
      prisma.student.findMany({
        orderBy: { id: "asc" },
      })
    );
    const timeout = new Promise((resolve) =>
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

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <main className="w-full">
      <StudentsSection initialStudents={students} />
    </main>
  );
}
