// app/login/page.tsx

import type { Metadata } from "next";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | Intel-Q",
  description: "Sign in to your Intel-Q account and manage your queue experience.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-6">
        <LoginForm />
      </main>

      <Footer />
    </div>
  );
}
