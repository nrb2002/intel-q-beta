import Link from "next/link";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-xl font-bold text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
            >
              Intel-Q
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-6 text-[#64748B]">
              Intelligent Queue Management for Modern Service Organizations.
              Helping organizations improve customer flow and deliver better
              service experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-sm font-semibold text-[#1E293B]">
              Quick Links
            </h2>

            <nav
              aria-label="Footer navigation"
              className="mt-4 flex flex-col gap-3"
            >
              <Link
                href="/"
                className="w-fit text-sm text-[#64748B] transition-colors hover:text-[#2563EB]"
              >
                Home
              </Link>

              <Link
                href="/login"
                className="w-fit text-sm text-[#64748B] transition-colors hover:text-[#2563EB]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="w-fit text-sm text-[#64748B] transition-colors hover:text-[#2563EB]"
              >
                Register
              </Link>
            </nav>
          </div>

          {/* Platform */}
          <div>
            <h2 className="text-sm font-semibold text-[#1E293B]">
              Platform
            </h2>

            <p className="mt-4 text-sm leading-6 text-[#64748B]">
              A reliable and efficient digital queue management solution
              designed to reduce waiting uncertainty and improve service
              delivery.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 flex flex-col gap-4 border-t border-[#E2E8F0] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#64748B]">
            © {currentYear} Intel-Q. All rights reserved.
          </p>

          <p className="text-sm text-[#64748B]">
            Built for better service experiences.
          </p>
        </div>
      </div>
    </footer>
  );
}