"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Image as ImageIcon,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  LogOut,
  Upload,
  Link2,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Menu,
} from "lucide-react";

interface Student {
  id: number;
  name: string;
  role: string;
  image: string;
  order: number;
  createdAt?: string;
}

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  order: number;
  createdAt?: string;
}

const STANDARD_ROLES = [
  "Ketua Kelas",
  "Wakil Ketua",
  "Sekretaris",
  "Bendahara",
  "Anggota",
];

export default function AdminDashboardPage() {
  const router = useRouter();

  // Authentication & Loading
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState<{ username: string } | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"students" | "gallery">("students");

  // Data
  const [students, setStudents] = useState<Student[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toast / notification
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal State for Student
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: "",
    role: "",
    image: "",
    order: 0,
  });
  const [studentImageMode, setStudentImageMode] = useState<"upload" | "url">("upload");
  const [submittingStudent, setSubmittingStudent] = useState(false);

  // Modal State for Gallery
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    alt: "",
    src: "",
    order: 0,
  });
  const [galleryImageMode, setGalleryImageMode] = useState<"upload" | "url">("upload");
  const [submittingGallery, setSubmittingGallery] = useState(false);

  // Delete Confirmation Modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "student" | "gallery";
    id: number;
    title: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Show Toast Helper
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // 1. Check Auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/me");
        if (!res.ok) {
          router.replace("/admin/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
        setAuthChecking(false);
      } catch {
        router.replace("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  // 2. Fetch Data
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [resStudents, resGallery] = await Promise.all([
        fetch("/api/students", { cache: "no-store" }),
        fetch("/api/gallery", { cache: "no-store" }),
      ]);
      if (resStudents.ok) {
        const data = await resStudents.json();
        setStudents(data);
      }
      if (resGallery.ok) {
        const data = await resGallery.json();
        setGallery(data);
      }
    } catch {
      showToast("error", "Gagal memuat data dari server");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!authChecking) {
      fetchData();
    }
  }, [authChecking]);

  // Logout Handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
    } catch {
      router.replace("/admin/login");
    }
  };

  // Helper: Image file compressor to optimized WebP Data URI
  const compressImage = (file: File, maxWidth = 1000): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement("img");
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = maxWidth;
          const MAX_HEIGHT = maxWidth;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP format automatically
          let compressed = canvas.toDataURL("image/webp", 0.80);
          if (!compressed.startsWith("data:image/webp")) {
            compressed = canvas.toDataURL("image/jpeg", 0.80);
          }
          resolve(compressed);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Student Image File Upload
  const handleStudentFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 800);
      setStudentForm((prev) => ({ ...prev, image: compressed }));
    } catch {
      showToast("error", "Gagal membaca file foto");
    }
  };

  // Gallery Image File Upload
  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 1200);
      setGalleryForm((prev) => ({ ...prev, src: compressed }));
    } catch {
      showToast("error", "Gagal membaca file foto");
    }
  };

  // Open Student Modal (Add or Edit)
  const openStudentModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      const isCustom = student.role ? !STANDARD_ROLES.includes(student.role) : false;
      setIsCustomRole(isCustom);
      setStudentForm({
        name: student.name,
        role: student.role,
        image: student.image,
        order: student.order,
      });
      setStudentImageMode(student.image.startsWith("data:") ? "upload" : "url");
    } else {
      setEditingStudent(null);
      setIsCustomRole(false);
      setStudentForm({
        name: "",
        role: "",
        image: "/images/students/student-1.webp",
        order: students.length + 1,
      });
      setStudentImageMode("upload");
    }
    setStudentModalOpen(true);
  };

  // Save Student (Create or Update)
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.role) {
      showToast("error", "Nama dan Peran wajib diisi");
      return;
    }

    setSubmittingStudent(true);
    try {
      if (editingStudent) {
        // Update
        const res = await fetch(`/api/students/${editingStudent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentForm),
        });
        if (!res.ok) throw new Error("Gagal mengupdate mahasiswa");
        showToast("success", "Data mahasiswa berhasil diperbarui");
      } else {
        // Create
        const res = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentForm),
        });
        if (!res.ok) throw new Error("Gagal menambahkan mahasiswa");
        showToast("success", "Mahasiswa baru berhasil ditambahkan");
      }
      setStudentModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast("error", err.message);
      } else {
        showToast("error", "Terjadi kesalahan");
      }
    } finally {
      setSubmittingStudent(false);
    }
  };

  // Open Gallery Modal (Add or Edit)
  const openGalleryModal = (item?: GalleryItem) => {
    if (item) {
      setEditingGallery(item);
      setGalleryForm({
        title: item.title,
        alt: item.alt,
        src: item.src,
        order: item.order,
      });
      setGalleryImageMode(item.src.startsWith("data:") ? "upload" : "url");
    } else {
      setEditingGallery(null);
      setGalleryForm({
        title: "",
        alt: "",
        src: "/images/gallery/hero-ars-1.webp",
        order: gallery.length + 1,
      });
      setGalleryImageMode("upload");
    }
    setGalleryModalOpen(true);
  };

  // Save Gallery (Create or Update)
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.src) {
      showToast("error", "Judul dan Foto wajib diisi");
      return;
    }

    setSubmittingGallery(true);
    try {
      if (editingGallery) {
        // Update
        const res = await fetch(`/api/gallery/${editingGallery.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(galleryForm),
        });
        if (!res.ok) throw new Error("Gagal mengupdate galeri");
        showToast("success", "Foto galeri berhasil diperbarui");
      } else {
        // Create
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(galleryForm),
        });
        if (!res.ok) throw new Error("Gagal menambahkan foto galeri");
        showToast("success", "Foto baru berhasil ditambahkan ke galeri");
      }
      setGalleryModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast("error", err.message);
      } else {
        showToast("error", "Terjadi kesalahan");
      }
    } finally {
      setSubmittingGallery(false);
    }
  };

  // Execute Delete
  const handleExecuteDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    try {
      const endpoint =
        deleteConfirm.type === "student"
          ? `/api/students/${deleteConfirm.id}`
          : `/api/gallery/${deleteConfirm.id}`;

      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus data");

      showToast(
        "success",
        `${deleteConfirm.type === "student" ? "Mahasiswa" : "Foto"} berhasil dihapus`
      );
      setDeleteConfirm(null);
      fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast("error", err.message);
      } else {
        showToast("error", "Terjadi kesalahan");
      }
    } finally {
      setDeleting(false);
    }
  };

  // Filtered Students & Gallery (Alphabetical A-Z)
  const filteredStudents = students
    .filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name, "id", { sensitivity: "base" }));

  const filteredGallery = gallery
    .filter((g) => g.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.id - b.id);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
          <p className="text-sm font-medium text-slate-600">Memverifikasi sesi admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col md:flex-row font-sans">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg bg-white border border-slate-200 transition-all animate-in slide-in-from-top">
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          )}
          <span className="text-sm font-medium text-slate-800">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile Top Header (md:hidden) */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
            <Image
              src="/images/logo-ars.webp"
              alt="Logo ARS"
              width={24}
              height={24}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <span className="font-bold text-xs tracking-tight text-slate-900 block leading-tight">
              Class ARS UNIBANG
            </span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Portal Admin
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Left Sidebar Navigation (Desktop Fixed/Sticky & Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Top: Logo & Branding */}
        <div>
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image
                  src="/images/logo-ars.webp"
                  alt="Logo ARS UNIBANG"
                  width={28}
                  height={28}
                  className="object-contain group-hover:scale-105 transition-transform"
                  priority
                />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-slate-900 block leading-tight">
                  Class ARS UNIBANG
                </span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Portal Admin
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sidebar Menu Items */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menu Utama
            </div>
            <button
              onClick={() => {
                setActiveTab("students");
                setSearchQuery("");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "students"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Mahasiswa</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
                  activeTab === "students"
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {students.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("gallery");
                setSearchQuery("");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "gallery"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4" />
                <span>Galeri Foto</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
                  activeTab === "gallery"
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {gallery.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom: User + External Link + Logout */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200/80 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                {user?.username?.charAt(0) || "A"}
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {user?.username || "Admin"}
                </span>
                <span className="text-[10px] text-slate-400 block">Administrator</span>
              </div>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Right Main Content Container */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header of Main Area */}
        <header className="bg-white border-b border-slate-200/80 px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === "students" ? "Data Mahasiswa" : "Dokumentasi Galeri"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {activeTab === "students"
                ? "Kelola profil, jabatan, dan urutan mahasiswa kelas"
                : "Kelola foto dan dokumentasi kegiatan kelas ARS UNIBANG"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === "students"
                    ? "Cari nama atau jabatan..."
                    : "Cari judul foto..."
                }
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-slate-900"
              />
            </div>

            {activeTab === "students" ? (
              <button
                onClick={() => openStudentModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Tambah Mahasiswa</span>
                <span className="sm:hidden">Tambah</span>
              </button>
            ) : (
              <button
                onClick={() => openGalleryModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Tambah Foto</span>
                <span className="sm:hidden">Tambah</span>
              </button>
            )}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        {/* Tab 1: STUDENTS LIST */}
        {activeTab === "students" && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Daftar Mahasiswa Class ARS UNIBANG (Urutan A–Z)
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                {filteredStudents.length} Mahasiswa ditemukan
              </span>
            </div>

            {loadingData ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400 mb-2" />
                <p className="text-xs text-slate-500">Memuat data mahasiswa...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="py-20 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-700">Tidak ada mahasiswa</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {searchQuery ? "Tidak ada hasil untuk pencarian ini." : "Mulai dengan menambahkan mahasiswa pertama."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-6">Foto</th>
                      <th className="py-3 px-6">Nama Mahasiswa</th>
                      <th className="py-3 px-6">Jabatan / Role</th>
                      <th className="py-3 px-6 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="w-12 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative shadow-sm">
                            <Image
                              src={student.image || "/images/students/student-1.webp"}
                              alt={student.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-3.5 px-6 font-semibold text-slate-900">
                          {student.name}
                        </td>
                        <td className="py-3.5 px-6">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                            {student.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => openStudentModal(student)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: "student",
                                  id: student.id,
                                  title: student.name,
                                })
                              }
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: GALLERY LIST */}
        {activeTab === "gallery" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">
                Dokumentasi Kegiatan Galeri
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {filteredGallery.length} Foto
              </span>
            </div>

            {loadingData ? (
              <div className="py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400 mb-2" />
                <p className="text-xs text-slate-500">Memuat foto galeri...</p>
              </div>
            ) : filteredGallery.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-700">Galeri masih kosong</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Tambahkan foto kegiatan untuk mempercantik galeri publik.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredGallery.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {item.alt || "Tanpa deskripsi"}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-1">
                        <button
                          onClick={() => openGalleryModal(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              type: "gallery",
                              id: item.id,
                              title: item.title,
                            })
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>

    {/* STUDENT ADD / EDIT MODAL */}
      {studentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">
                {editingStudent ? "Edit Data Mahasiswa" : "Tambah Mahasiswa Baru"}
              </h3>
              <button
                onClick={() => setStudentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  placeholder="Contoh: Nurul Hidayah"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Jabatan / Role *
                </label>
                <div className="relative">
                  <select
                    required
                    value={isCustomRole ? "__custom__" : studentForm.role}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "__custom__") {
                        setIsCustomRole(true);
                        setStudentForm({ ...studentForm, role: "" });
                      } else {
                        setIsCustomRole(false);
                        setStudentForm({ ...studentForm, role: val });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-slate-900 bg-white cursor-pointer"
                  >
                    <option value="" disabled>
                      -- Pilih Jabatan / Role Mahasiswa --
                    </option>
                    {STANDARD_ROLES.map((roleOption) => (
                      <option key={roleOption} value={roleOption}>
                        {roleOption}
                      </option>
                    ))}
                    <option value="__custom__">Lainnya (Ketik Manual...)</option>
                  </select>
                </div>

                {/* Input teks otomatis muncul jika memilih 'Lainnya (Ketik Manual...)' */}
                {isCustomRole && (
                  <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <input
                      type="text"
                      required
                      autoFocus
                      value={studentForm.role}
                      onChange={(e) => setStudentForm({ ...studentForm, role: e.target.value })}
                      placeholder="Ketik nama jabatan khusus..."
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-slate-900 bg-slate-50/50"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Ketik jabatan jika tidak ada pada daftar pilihan di atas.
                    </p>
                  </div>
                )}
              </div>

              {/* Photo Input Mode Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Foto Mahasiswa
                </label>
                <div className="flex items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setStudentImageMode("upload")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      studentImageMode === "upload"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload File Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentImageMode("url")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      studentImageMode === "url"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    Input URL Foto
                  </button>
                </div>

                {studentImageMode === "upload" ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleStudentFileUpload}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50"
                    >
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                      <p className="text-xs font-semibold text-slate-700">
                        Klik untuk memilih foto dari perangkat
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        JPG, PNG, atau WebP (otomatis dioptimasi)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={studentForm.image}
                      onChange={(e) => setStudentForm({ ...studentForm, image: e.target.value })}
                      placeholder="https://... atau /images/students/..."
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-slate-900"
                    />
                  </div>
                )}

                {/* Live Preview */}
                {studentForm.image && (
                  <div className="mt-3 flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-slate-200 relative border border-slate-200">
                      <Image
                        src={studentForm.image}
                        alt="Preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-800">Preview Foto</p>
                      <p className="text-slate-400 text-[11px] truncate max-w-xs">
                        {studentForm.image.startsWith("data:") ? "Foto diupload (Base64)" : studentForm.image}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStudentModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingStudent}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {submittingStudent && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingStudent ? "Simpan Perubahan" : "Tambahkan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY ADD / EDIT MODAL */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">
                {editingGallery ? "Edit Foto Galeri" : "Tambah Foto Baru ke Galeri"}
              </h3>
              <button
                onClick={() => setGalleryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Foto *
                </label>
                <input
                  type="text"
                  required
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  placeholder="Contoh: Sesi Diskusi & Santai Sore"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi / Alt Text
                </label>
                <input
                  type="text"
                  value={galleryForm.alt}
                  onChange={(e) => setGalleryForm({ ...galleryForm, alt: e.target.value })}
                  placeholder="Dokumentasi ARS UNIBANG"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-slate-900"
                />
              </div>

              {/* Photo Input Mode Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Foto Galeri *
                </label>
                <div className="flex items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setGalleryImageMode("upload")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      galleryImageMode === "upload"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload File Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => setGalleryImageMode("url")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      galleryImageMode === "url"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    Input URL Foto
                  </button>
                </div>

                {galleryImageMode === "upload" ? (
                  <div>
                    <input
                      type="file"
                      ref={galleryFileInputRef}
                      accept="image/*"
                      onChange={handleGalleryFileUpload}
                      className="hidden"
                    />
                    <div
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50"
                    >
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                      <p className="text-xs font-semibold text-slate-700">
                        Pilih foto dokumentasi dari galeri/perangkat
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Format foto resolusi tinggi otomatis dikompres
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={galleryForm.src}
                      onChange={(e) => setGalleryForm({ ...galleryForm, src: e.target.value })}
                      placeholder="https://... atau /images/gallery/..."
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-slate-900"
                    />
                  </div>
                )}

                {/* Live Preview */}
                {galleryForm.src && (
                  <div className="mt-3 relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <Image
                      src={galleryForm.src}
                      alt="Preview Galeri"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingGallery}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {submittingGallery && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingGallery ? "Simpan Perubahan" : "Tambahkan ke Galeri"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Konfirmasi Hapus</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus{" "}
              <strong className="text-slate-800">&quot;{deleteConfirm.title}&quot;</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleExecuteDelete}
                disabled={deleting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
