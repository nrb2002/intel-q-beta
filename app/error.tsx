"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <h2 className="text-xl font-semibold text-[#1E293B]">Something went wrong</h2>
      <p className="mt-2 text-[#64748B]">We ran into an unexpected problem. Please try again.</p>
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-[#E2E8F0] px-5 py-2.5 text-sm font-medium text-[#1E293B] transition hover:bg-[#F8FAFC]"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
