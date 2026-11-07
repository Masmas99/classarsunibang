export default function GalleryPage() {
  const photos = [
    {
      id: 1,
      src: "/images/ars/ars-1.jpg",
      title: "Foto Angkatan di Halaman Kampus",
      desc: "Momen kebersamaan seluruh mahasiswa Class ARS UNIBANG.",
    },
    {
      id: 2,
      src: "/images/ars/ars-4.jpg",
      title: "Himpunan Mahasiswa ARS",
      desc: "Sesi foto bersama bendera kebanggaan himpunan ARS UNIBANG.",
    },
    {
      id: 3,
      src: "/images/ars/ars-3.jpg",
      title: "Aktivitas Kasual Kampus",
      desc: "Keseruan momen perkuliahan dan interaksi antar mahasiswa.",
    },
    {
      id: 4,
      src: "/images/ars/ars-5.jpg",
      title: "Formasi Gedung Perkuliahan",
      desc: "Foto bersama di depan gedung fakultas UNIBANG.",
    },
    {
      id: 5,
      src: "/images/ars/ars-2.jpg",
      title: "Potret Kebersamaan Lengkap",
      desc: "Kenangan berharga seluruh angkatan Class ARS UNIBANG.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <section className="bg-white border border-[#e9e9e9] rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <span className="inline-block text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 bg-[#f0f0f0] text-[#555] rounded-md mb-3">
          Dokumentasi
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#111]">
          Galeri Class ARS UNIBANG
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#666]">
          Kumpulan dokumentasi foto kegiatan dan kebersamaan mahasiswa Class ARS UNIBANG.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="border border-[#e9e9e9] rounded-2xl overflow-hidden bg-[#fafafa] hover:border-[#ccc] hover:shadow-md transition-all group"
            >
              <div className="relative w-full h-52 overflow-hidden bg-[#eee]">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-[#111]">{photo.title}</h3>
                <p className="mt-1 text-xs text-[#666] leading-relaxed">{photo.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
