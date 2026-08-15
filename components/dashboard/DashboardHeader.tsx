"use client";

export default function DashboardHeader() {
  return (
    <div
      className="
        border
        border-[#E2E8F0]
        bg-white
        px-6
        py-5
        mb-6
        shadow-md

      "
    >
      <h1
        className="
          text-3xl
          font-extrabold
          tracking-tight
          text-[#1E293B]
        "
      >
        Dashboard
      </h1>

      <p
        className="
          mt-2
          text-base
          font-medium
          text-[#64748B]
        "
      >
        Monitor queue activity and manage Intel-Q operations.
      </p>

      <div className="mt-5 h-0.5 w-full bg-[#E2E8F0]" />
    </div>
  );
}