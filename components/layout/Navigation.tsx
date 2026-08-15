"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "myIntelQ",
    href: "/login",
  },
  {
    label: "Register",
    href: "/register",
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="flex items-center gap-6"
    >
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2",
              isActive
                ? "text-[#2563EB]"
                : "text-[#475569] hover:text-[#1D4ED8]"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}