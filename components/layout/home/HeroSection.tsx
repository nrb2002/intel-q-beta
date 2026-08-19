import Link from "next/link";

export function HeroSection() {
  return (
    <section className="border-b border-[#E2E8F0] bg-white">
          <div className="mx-auto flex min-h-[20vh] max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-[#EFF6FF] px-4 py-2 text-sm font-medium text-[#2563EB]">
              Digital Queue Management
            </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[#1E293B] sm:text-5xl lg:text-6xl">
              Welcome to Intel-Q
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#64748B]">
              Get your service ticket digitally and wait comfortably
              while Intel-Q keeps you informed when it is your turn.
            </p>

            
          </div>
        </section>
  );
}