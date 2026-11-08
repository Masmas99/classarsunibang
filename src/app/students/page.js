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
    const list = await prisma.student.findMany();
    if (list && list.length > 0) {
      return list.sort((a, b) =>
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
