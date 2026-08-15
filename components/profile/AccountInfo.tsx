// components/profile/AccountInfo.tsx

import {
  Calendar,
  Mail,
  Shield,
  User,
} from "lucide-react";

import { UserProfile } from "@/types/user";

interface AccountInformationProps {
  user: UserProfile;
}

export function AccountInfo({
  user,
}: AccountInformationProps) {
  const memberSince = new Date(
    user.createdAt
  ).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const roleLabel =
    user.role.charAt(0) +
    user.role.slice(1).toLowerCase();

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#1E293B]">
        Account Information
      </h2>

      <p className="mt-1 text-sm text-[#64748B]">
        Your account details.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* First Name */}
        <div>
          <div className="flex items-center gap-2">
            <User
              size={18}
              aria-hidden="true"
              className="text-[#64748B]"
            />

            <p className="text-sm font-medium text-[#64748B]">
              First Name
            </p>
          </div>

          <p className="mt-2 text-[#1E293B]">
            {user.firstName}
          </p>
        </div>

        {/* Last Name */}
        <div>
          <div className="flex items-center gap-2">
            <User
              size={18}
              aria-hidden="true"
              className="text-[#64748B]"
            />

            <p className="text-sm font-medium text-[#64748B]">
              Last Name
            </p>
          </div>

          <p className="mt-2 text-[#1E293B]">
            {user.lastName}
          </p>
        </div>

        {/* Email */}
        <div>
          <div className="flex items-center gap-2">
            <Mail
              size={18}
              aria-hidden="true"
              className="text-[#64748B]"
            />

            <p className="text-sm font-medium text-[#64748B]">
              Email Address
            </p>
          </div>

          <p className="mt-2 break-all text-[#1E293B]">
            {user.email}
          </p>
        </div>

        {/* Role */}
        <div>
          <div className="flex items-center gap-2">
            <Shield
              size={18}
              aria-hidden="true"
              className="text-[#64748B]"
            />

            <p className="text-sm font-medium text-[#64748B]">
              Account Role
            </p>
          </div>

          <p className="mt-2 text-[#1E293B]">
            {roleLabel}
          </p>
        </div>

        {/* Member Since */}
        <div>
          <div className="flex items-center gap-2">
            <Calendar
              size={18}
              aria-hidden="true"
              className="text-[#64748B]"
            />

            <p className="text-sm font-medium text-[#64748B]">
              Member Since
            </p>
          </div>

          <p className="mt-2 text-[#1E293B]">
            {memberSince}
          </p>
        </div>
      </div>
    </div>
  );
}