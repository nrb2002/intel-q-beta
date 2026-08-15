import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section
      className="bg-[#F8FAFC] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-xl bg-[#2563EB] px-6 py-12 text-center shadow-lg sm:px-10 sm:py-16">
          {/* Decorative background elements */}
          <div
            className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10"
            aria-hidden="true"
          />

          <div
            className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-white/10"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative mx-auto max-w-3xl">
            <h2
              id="cta-heading"
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Ready to make your queues smarter?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
              Join Intel-Q and give your customers a simpler, more transparent
              waiting experience while helping your team manage queues more
              efficiently.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-[#2563EB] shadow-sm transition-colors hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#2563EB] sm:w-auto"
              >
                Get Started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#2563EB] sm:w-auto"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}