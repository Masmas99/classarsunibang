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
    <TiltedGridHero
      images={IMAGES}
      gap={24}
      axis={54}
      className="h-[520px] sm:h-[560px] w-full rounded-none border-b border-border bg-background"
    >
      <div className="relative z-10 flex h-full flex-col items-center justify-between py-10 sm:py-12 text-center pointer-events-none">
        <div className="px-6">
          <h1 className="text-balance text-3xl sm:text-5xl font-medium tracking-tight text-foreground">
            Welcome Class
            <br />
            ARS UNIBANG
          </h1>
        </div>
        <p className="max-w-md text-balance px-6 text-xs sm:text-sm text-muted-foreground">
          Dokumentasi dan kebersamaan seluruh mahasiswa Class ARS UNIBANG.
        </p>
      </div>
    </TiltedGridHero>
  );
}
