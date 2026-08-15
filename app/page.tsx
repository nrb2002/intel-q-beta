import { CTASection } from "@/components/layout/home/CTASection";
import { FeaturesSection } from "@/components/layout/home/FeaturesSection";
import { HeroSection } from "@/components/layout/home/HeroSection";
import { HowItWorksSection } from "@/components/layout/home/HowItWorksSection";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function HomePage() {
  return (
    <div
      className="
        min-h-screen
        bg-[#F8FAFC]
        text-[#1E293B]
      "
    >
      <Header />

      <main>
        <HeroSection />

        <FeaturesSection />

        <HowItWorksSection />

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
