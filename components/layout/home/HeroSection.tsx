import Link from "next/link";
import { ArrowRight, Clock3, ShieldCheck, Users } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#F8FAFC]"
      aria-labelledby="hero-heading"
    >
      {/* Decorative background elements */}
      <div
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#2563EB]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#0EA5E9]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
        {/* Hero Content */}
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#475569] shadow-sm">
            <span
              className="h-2 w-2 rounded-full bg-[#16A34A]"
              aria-hidden="true"
            />
            Smarter queues. Better service.
          </div>

          <h1
            id="hero-heading"
            className="text-4xl font-bold tracking-tight text-[#1E293B] sm:text-5xl lg:text-6xl"
          >
            Intelligent Queue Management System for Modern Service Organizations
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-[#64748B] sm:text-lg">
            Intel-Q helps organizations manage customer queues efficiently,
            reduce waiting uncertainty, and deliver a smoother service
            experience for everyone.
          </p>

          {/* Call-to-action buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
            >
              Get Started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-semibold text-[#475569] shadow-sm transition-colors hover:bg-[#F8FAFC] hover:text-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Hero Visual / Queue Preview */}
        <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-lg">
            {/* Preview Header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <p className="text-sm font-medium text-[#64748B]">
                  Current Queue
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#1E293B]">
                  Main Branch
                </h2>
              </div>

              <div className="rounded-full bg-[#16A34A]/10 px-3 py-1 text-xs font-medium text-[#16A34A]">
                Live
              </div>
            </div>

            {/* Queue Position */}
            <div className="py-6 text-center">
              <p className="text-sm text-[#64748B]">Your queue number</p>

              <p className="mt-2 text-5xl font-bold text-[#2563EB]">
                A-024
              </p>

              <p className="mt-2 text-sm text-[#64748B]">
                Position 3 in queue
              </p>
            </div>

            {/* Queue Status */}
            <div className="grid grid-cols-3 gap-3 border-t border-[#E2E8F0] pt-5">
              <div className="rounded-lg bg-[#F8FAFC] p-3 text-center">
                <Clock3
                  className="mx-auto h-5 w-5 text-[#F59E0B]"
                  aria-hidden="true"
                />
                <p className="mt-2 text-xs text-[#64748B]">Waiting</p>
                <p className="mt-1 font-semibold text-[#1E293B]">~15 min</p>
              </div>

              <div className="rounded-lg bg-[#F8FAFC] p-3 text-center">
                <Users
                  className="mx-auto h-5 w-5 text-[#2563EB]"
                  aria-hidden="true"
                />
                <p className="mt-2 text-xs text-[#64748B]">Ahead</p>
                <p className="mt-1 font-semibold text-[#1E293B]">2 people</p>
              </div>

              <div className="rounded-lg bg-[#F8FAFC] p-3 text-center">
                <ShieldCheck
                  className="mx-auto h-5 w-5 text-[#16A34A]"
                  aria-hidden="true"
                />
                <p className="mt-2 text-xs text-[#64748B]">Status</p>
                <p className="mt-1 font-semibold text-[#1E293B]">Waiting</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}