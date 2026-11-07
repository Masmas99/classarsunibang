import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";

const IMAGES = [
  {
    src: "/images/ars/ars-1.jpg",
    alt: "Foto bersama Class ARS UNIBANG 1",
  },
  {
    src: "/images/ars/ars-4.jpg",
    alt: "Class ARS UNIBANG dengan Bendera Himpunan",
  },
  {
    src: "/images/ars/ars-2.jpg",
    alt: "Foto bersama Class ARS UNIBANG 2",
  },
  {
    src: "/images/ars/ars-5.jpg",
    alt: "Dokumentasi Kegiatan Mahasiswa ARS UNIBANG",
  },
  {
    src: "/images/ars/ars-3.jpg",
    alt: "Sesi Kasual Kampus Class ARS UNIBANG",
  },
  {
    src: "/images/ars/ars-1.jpg",
    alt: "Class ARS UNIBANG Formasi Lapangan",
  },
  {
    src: "/images/ars/ars-4.jpg",
    alt: "Kebersamaan Mahasiswa ARS UNIBANG",
  },
  {
    src: "/images/ars/ars-2.jpg",
    alt: "Dokumentasi Angkatan ARS UNIBANG",
  },
  {
    src: "/images/ars/ars-5.jpg",
    alt: "Keluarga Besar Mahasiswa ARS UNIBANG",
  },
  {
    src: "/images/ars/ars-3.jpg",
    alt: "Kenangan Kampus ARS UNIBANG",
  },
];

export default function TiltedGridHeroDemo() {
  return (
    <section id="home" className="w-full scroll-mt-24">
      <TiltedGridHero
        images={IMAGES}
        gap={6}
        curve={80}
        className="h-[520px] sm:h-[560px] w-full rounded-none border-b border-[#e9e9e9] bg-transparent"
      >
        <div className="relative z-10 flex h-full flex-col items-center justify-start pt-12 sm:pt-16 text-center pointer-events-none">
          <div className="px-6">
            <h1 className="text-balance text-3xl sm:text-5xl font-medium tracking-tight text-[#111]">
              Welcome Class
              <br />
              ARS UNIBANG
            </h1>
          </div>
        </div>
      </TiltedGridHero>
    </section>
  );
}
