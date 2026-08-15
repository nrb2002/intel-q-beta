// components/profile/ProfileCard.tsx

import { User } from "lucide-react";

import { UserProfile } from "@/types/user";

interface ProfileCardProps {
  user: UserProfile;
}

export function ProfileCard({
  user,
}: ProfileCardProps) {
  const roleLabel =
    user.role.charAt(0) +
    user.role.slice(1).toLowerCase();

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full bg-[#EFF6FF]"
          aria-hidden="true"
        >
          <User
            size={40}
            className="text-[#2563EB]"
          />
        </div>

        {/* Name */}
        <h2 className="mt-4 text-xl font-semibold text-[#1E293B]">
          {user.firstName} {user.lastName}
        </h2>

        {/* Email */}
        <p className="mt-1 break-all text-sm text-[#64748B]">
          {user.email}
        </p>

        {/* Role */}
        <span className="mt-4 inline-flex rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-medium text-[#2563EB]">
          {roleLabel}
        </span>
      </div>
    </div>
  );
}