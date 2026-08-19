// components/staff/StaffHeader.tsx

"use client";

import Link from "next/link";

export function StaffHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          Staff Portal
        </h1>
        <p className="hidden text-xs text-gray-500 sm:block">
          Intel-Q Queue Management
        </p>
      </div>

      <Link
        href="/staff/profile"
        className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
          S
        </div>

        <span className="hidden text-sm font-medium sm:block">
          Staff Member
        </span>
      </Link>
    </header>
  );
}