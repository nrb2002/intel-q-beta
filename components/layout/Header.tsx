"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
const [isMenuOpen, setIsMenuOpen] = useState(false);

return ( 
    <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur"> 
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand */} 
        <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="Intel-Q Home"
            > 
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#2563EB] text-lg font-bold text-white">
            Q </div>

        <div>
            <span className="text-xl font-bold tracking-tight text-[#1E293B]">
            Intel-Q
            </span>
        </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
        className="hidden items-center gap-8 md:flex"
        aria-label="Main navigation"
        >
        <Link
            href="/"
            className="text-sm font-medium text-[#1E293B] transition-colors hover:text-[#2563EB]"
        >
            Home
        </Link>

        <Link
            href="/#features"
            className="text-sm font-medium text-[#64748B] transition-colors hover:text-[#2563EB]"
        >
            Features
        </Link>

        <Link
            href="/#how-it-works"
            className="text-sm font-medium text-[#64748B] transition-colors hover:text-[#2563EB]"
        >
            How It Works
        </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
        <Link
            href="/login"
            className="rounded-md px-4 py-2 text-sm font-medium text-[#475569] transition-colors hover:bg-[#F8FAFC] hover:text-[#2563EB]"
        >
            Login
        </Link>

        <Link
            href="/register"
            className="rounded-md bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
        >
            Get Started
        </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
        type="button"
        className="inline-flex items-center justify-center rounded-md p-2 text-[#475569] transition-colors hover:bg-[#F8FAFC] hover:text-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation"
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
        {isMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
        ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
        )}
        </button>
    </div>

    {/* Mobile Navigation */}
    {isMenuOpen && (
        <div
        id="mobile-navigation"
        className="border-t border-[#E2E8F0] bg-white md:hidden"
        >
        <nav
            className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6"
            aria-label="Mobile navigation"
        >
            <Link
            href="/"
            className="rounded-md px-3 py-3 text-sm font-medium text-[#1E293B] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
            onClick={() => setIsMenuOpen(false)}
            >
            Home
            </Link>

            <Link
            href="/#features"
            className="rounded-md px-3 py-3 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
            onClick={() => setIsMenuOpen(false)}
            >
            Features
            </Link>

            <Link
            href="/#how-it-works"
            className="rounded-md px-3 py-3 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
            onClick={() => setIsMenuOpen(false)}
            >
            How It Works
            </Link>

            <div className="mt-3 flex flex-col gap-2 border-t border-[#E2E8F0] pt-4">
            <Link
                href="/login"
                className="rounded-md px-4 py-3 text-center text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                onClick={() => setIsMenuOpen(false)}
            >
                Login
            </Link>

            <Link
                href="/register"
                className="rounded-md bg-[#2563EB] px-4 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8]"
                onClick={() => setIsMenuOpen(false)}
            >
                Get Started
            </Link>
            </div>
        </nav>
        </div>
    )}
    </header>


    );
}
