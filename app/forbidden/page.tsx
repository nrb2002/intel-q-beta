// app/forbidden/page.tsx

import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
          !
        </div>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Access Forbidden
        </h1>

        <p className="mt-2 text-gray-600">
          You do not have permission to access this area.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}