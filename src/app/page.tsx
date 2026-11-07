import TiltedGridHeroDemo from "@/components/ui/tilted-grid-hero-demo";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      <TiltedGridHeroDemo />
      <AboutSection />
    </div>
  );
}
