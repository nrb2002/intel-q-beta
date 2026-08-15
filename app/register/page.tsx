// app/register/page.tsx

import type { Metadata } from "next";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | Intel-Q",
  description: "Create your Intel-Q account and start managing your queue experience.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-4">
        <RegisterForm />
      </main>

      <Footer />
    </div>
  );
}
