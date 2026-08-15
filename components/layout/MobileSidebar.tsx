"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Queue",
    href: "/dashboard/queue",
  },
  {
    name: "Branches",
    href: "/dashboard/branches",
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
  },
  {
    name: "Logout",
    href: "/login",
  }
];

export default function MobileSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
        className="
          fixed
          right-4
          top-4
          z-40
          rounded-lg
          bg-[#2563EB]
          p-2
          text-white
          shadow
          lg:hidden
        "
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            lg:hidden
          "
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          h-screen
          w-64
          bg-white
          p-6
          shadow-xl
          transition-transform
          duration-300
          lg:hidden
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#2563EB]">
              <Link href="/">Intel-Q</Link>
            </h2>

            <p className="mt-1 text-sm text-[#64748B]">
              Queue Management
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="
              rounded-lg
              p-2
              text-[#64748B]
              hover:bg-[#F1F5F9]
            "
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="mt-8 flex flex-col gap-2"
          aria-label="Mobile dashboard navigation"
        >
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
                  rounded-lg
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition
                  ${
                    isActive
                      ? "bg-[#2563EB] text-white"
                      : "text-[#1E293B] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                  }
                `}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}