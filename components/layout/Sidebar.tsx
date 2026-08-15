"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    href: "/",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        hidden
        min-h-screen
        w-64
        shrink-0
        border-r
        border-[#E2E8F0]
        bg-white
        p-6
        lg:block
      "
    >
      <div>
        <h2 className="text-xl font-bold text-[#2563EB]">
          <Link href="/">Intel-Q</Link>
        </h2>

        <p className="mt-1 text-sm text-[#64748B]">
          Queue Management
        </p>
      </div>

      <nav
        className="mt-8 flex flex-col gap-2"
        aria-label="Dashboard navigation"
      >
        {navigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
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
  );
}