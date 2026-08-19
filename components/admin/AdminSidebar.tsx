// components/admin/AdminSidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: "▦",
  },
  {
    name: "Queues",
    href: "/admin/queues",
    icon: "☷",
  },
  {
    name: "Tickets",
    href: "/admin/tickets",
    icon: "▤",
  },
  {
    name: "Branches",
    href: "/admin/branches",
    icon: "⌂",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: "♙",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: "⚙",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin/dashboard" className="text-xl font-bold">
          Intel-Q
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-gray-100"
        >
          ← Back to Intel-Q
        </Link>
      </div>
    </div>
  );
}