// app/page.tsx

import Link from "next/link";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { HowItWorksSection } from "@/components/layout/home/HowItWorksSection";
import { HeroSection } from "@/components/layout/home/HeroSection";
import { CTASection } from "@/components/layout/home/CTASection";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#1E293B]">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <HeroSection />

        {/* CTA Section */}
        <CTASection />

        {/* How it works */}
        <HowItWorksSection />
      </main>

      <Footer />
    </div>
  );
}
