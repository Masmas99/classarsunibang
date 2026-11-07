"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, type Variants } from "motion/react";

export interface Student {
  id: number;
  name: string;
  role: string;
  image: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

const STUDENTS: Student[] = [
  {
    id: 2,
    name: "Ahmad Fauzi",
    role: "Wakil Ketua Kelas",
    image: "/images/students/student-1.webp",
  },
  {
    id: 6,
    name: "Budi Santoso",
    role: "Bendahara 2",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Dewi Lestari",
    role: "Bendahara 1",
    image: "/images/students/student-1.webp",
  },
  {
    id: 8,
    name: "Dimas Saputra",
    role: "Divisi Humas",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 1,
    name: "Nurul Hidayah",
    role: "Ketua Kelas",
    image: "/images/students/student-1.webp",
  },
  {
    id: 7,
    name: "Putri Anggraini",
    role: "Divisi Acara",
    image: "/images/students/student-1.webp",
  },
  {
    id: 4,
    name: "Rian Pratama",
    role: "Sekretaris 2",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Siti Rahma",
    role: "Sekretaris 1",
    image: "/images/students/student-1.webp",
  },
];

interface StudentsSectionProps {
  initialStudents?: Student[];
}

export default function StudentsSection({ initialStudents }: StudentsSectionProps) {
  const [studentsList, setStudentsList] = useState<Student[]>(() => {
    if (initialStudents && initialStudents.length > 0) {
      return initialStudents;
    }
    return STUDENTS;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Sync state if initialStudents changes from server revalidation
  useEffect(() => {
    if (initialStudents && initialStudents.length > 0) {
      setStudentsList(initialStudents);
    }
  }, [initialStudents]);

  // Keep students in sync with Neon database in the background without layout flicker
  useEffect(() => {
    fetch("/api/students", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStudentsList(data);
        }
      })
      .catch(() => {});
  }, []);

  // Close modal on Escape key & manage body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedStudent(null);
      }
    };

    if (selectedStudent) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedStudent]);

  const filteredStudents = studentsList
    .filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name, "id", { sensitivity: "base" }));

  return (
    <section id="students" className="w-full py-12 sm:py-20 scroll-mt-24 border-t border-[#f0f0f0]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        variants={containerVariants}
        className="w-full max-w-[1138px] mx-auto px-4 sm:px-8"
      >
        {/* Header Bar: Logo + CLASS ARS UNIBANG / STUDENTS */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 shadow-sm border border-neutral-200/80 bg-white flex items-center justify-center p-1.5">
              <img
                src="/images/logo-students.webp"
                alt="Logo Students Class ARS UNIBANG"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-sm sm:text-lg md:text-xl font-bold tracking-tight flex items-center whitespace-nowrap">
              <span className="font-extrabold uppercase text-[#111] tracking-normal sm:tracking-wide">
                CLASS ARS UNIBANG
              </span>
              <span className="text-[#888] font-light mx-1.5 sm:mx-2">/</span>
              <span className="text-[#666] font-normal uppercase tracking-wider text-xs sm:text-sm md:text-base">
                STUDENTS
              </span>
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama mahasiswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:border-neutral-400 focus:bg-white transition-all placeholder:text-neutral-400"
            />
          </div>
        </motion.div>

        {/* Description */}
        <motion.p variants={itemVariants} className="text-[#555] text-sm sm:text-[14.5px] leading-relaxed mb-8">
          Daftar mahasiswa aktif Class Administrasi Rumah Sakit (ARS) UNIBANG angkatan 2025. Klik kartu untuk melihat foto dan info mahasiswa.
        </motion.p>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <motion.div
                variants={itemVariants}
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedStudent(student);
                  }
                }}
                className="border border-[#e9e9e9] rounded-2xl overflow-hidden bg-white shadow-xs hover:border-neutral-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group flex flex-col cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#0b2545]/20"
              >
                {/* Foto Mahasiswa */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-100">
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      if (!student.image?.startsWith("data:")) {
                        e.currentTarget.src = "/images/students/student-1.webp";
                      }
                    }}
                  />
                </div>

                {/* Nama & Peran Mahasiswa */}
                <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-[#111] text-sm sm:text-base leading-tight group-hover:text-[#0b2545] transition-colors">
                      {student.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#666] font-medium mt-1">
                      {student.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-neutral-400 text-sm">
              Mahasiswa tidak ditemukan.
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Modal Pop-up Foto & Detail Mahasiswa ── */}
      {selectedStudent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200/80 relative my-8 animate-in zoom-in-95 duration-200 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button (X saja di atas kanan) */}
            <button
              onClick={() => setSelectedStudent(null)}
              aria-label="Tutup"
              className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all cursor-pointer shadow-md backdrop-blur-xs"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Foto Mahasiswa dengan Gradasi Halus ke Putih di Bawah */}
            <div className="relative w-full aspect-[4/4.5] overflow-hidden bg-neutral-100">
              <img
                src={selectedStudent.image}
                alt={selectedStudent.name}
                className="w-full h-full object-cover block"
                onError={(e) => {
                  if (!selectedStudent.image?.startsWith("data:")) {
                    e.currentTarget.src = "/images/students/student-1.webp";
                  }
                }}
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/80 via-40% to-transparent pointer-events-none" />
            </div>

            {/* Informasi Mahasiswa: Gradasi Putih dengan Nama & Jabatan */}
            <div className="p-5 sm:p-6 bg-gradient-to-b from-white to-neutral-50/90 -mt-3 relative z-10 text-[#111]">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#0b2545] text-white shadow-xs">
                  {selectedStudent.role}
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  Class ARS UNIBANG
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#111] tracking-tight">
                {selectedStudent.name}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Fakultas Ilmu Kesehatan dan Sains • Angkatan 2025
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
