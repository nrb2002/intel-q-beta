// app/dashboard/profile/page.tsx

"use client";

import { useEffect, useState } from "react";

import { ProfilePageClient } from "@/components/profile/ProfilePageClient";
import { UserProfile } from "@/types/user";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/users/me");

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Unable to load your profile.");
          return;
        }

        setUser(data.user);
      } catch {
        setError("Something went wrong while loading your profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-[#64748B]">Loading your profile...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700"
        >
          {error || "Unable to load your profile."}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">Profile</h1>

        <p className="mt-2 text-[#64748B]">View and manage your Intel-Q account information.</p>
      </div>

      <ProfilePageClient user={user} />
    </section>
  );
}
