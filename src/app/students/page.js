import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import StudentsSection from "@/components/StudentsSection";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Daftar Mahasiswa",
  description:
    "Daftar direktori mahasiswa aktif Class Administrasi Rumah Sakit (ARS) UNIBANG angkatan 2025 - Fakultas Ilmu Kesehatan dan Sains, Universitas Bina Bangsa.",
  openGraph: {
    title: "Daftar Mahasiswa — Class ARS UNIBANG",
    description:
      "Daftar direktori mahasiswa aktif Class Administrasi Rumah Sakit (ARS) UNIBANG angkatan 2025.",
    url: "https://classarsunibang.vercel.app/students",
    images: ["/og-image.png"],
  },
};

async function getStudents() {
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

export default async function StudentsPage() {
  const students = await getStudents();

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
            <span className="font-semibold text-neutral-900">Students</span>
          </nav>

          {/* Badge & Title */}
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-800 w-fit">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Direktori Mahasiswa • Angkatan 2025</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111]">
              Mahasiswa Class ARS UNIBANG
            </h1>
            <p className="text-neutral-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              Direktori resmi mahasiswa aktif Program Studi Administrasi Rumah Sakit, Fakultas Ilmu Kesehatan dan Sains, Universitas Bina Bangsa.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Students Section Component ── */}
      <div className="w-full -mt-6">
        <StudentsSection initialStudents={students} />
      </div>
    </div>
  );
}
