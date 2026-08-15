// components/profile/ProfileActions.tsx

interface ProfileActionsProps {
  onEditProfile: () => void;
  onChangePassword: () => void;
}

export function ProfileActions({
  onEditProfile,
  onChangePassword,
}: ProfileActionsProps) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-[#1E293B]">
          Account Settings
        </h2>

        <p className="mt-1 text-sm text-[#64748B]">
          Manage your account preferences and security.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onEditProfile}
          className="rounded-lg border border-[#E2E8F0] px-5 py-2.5 text-sm font-medium text-[#1E293B] transition hover:bg-[#F8FAFC]"
        >
          Edit Profile
        </button>

        <button
          type="button"
          onClick={onChangePassword}
          className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}