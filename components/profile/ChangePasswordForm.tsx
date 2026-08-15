// components/profile/ChangePasswordForm.tsx

"use client";

import { FormEvent, useState } from "react";

import { changePasswordSchema } from "@/lib/validations/password";

interface ChangePasswordFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

type FieldErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export function ChangePasswordForm({
  onSuccess,
  onError,
  onCancel,
}: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  const [loading, setLoading] = useState(false);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  function clearFieldError(
    field: keyof FieldErrors
  ) {
    if (!fieldErrors[field]) {
      return;
    }

    setFieldErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    onError("");
    setFieldErrors({});

    // Client-side validation
    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const errors: FieldErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (
          field === "currentPassword" ||
          field === "newPassword" ||
          field === "confirmPassword"
        ) {
          if (!errors[field]) {
            errors[field] = issue.message;
          }
        }
      }

      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/users/me/password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      let data: {
        error?: string;
        fieldErrors?: Record<string, string>;
      };

      // Safely parse the API response
      try {
        data = await response.json();
      } catch {
        onError(
          "The server returned an invalid response. Please try again."
        );
        return;
      }

      // Handle API errors
      if (!response.ok) {
        if (data.fieldErrors) {
          const serverErrors: FieldErrors = {};

          if (data.fieldErrors.currentPassword) {
            serverErrors.currentPassword =
              data.fieldErrors.currentPassword;
          }

          if (data.fieldErrors.newPassword) {
            serverErrors.newPassword =
              data.fieldErrors.newPassword;
          }

          if (data.fieldErrors.confirmPassword) {
            serverErrors.confirmPassword =
              data.fieldErrors.confirmPassword;
          }

          setFieldErrors(serverErrors);
        }

        onError(
          data.error ||
            "Unable to change your password. Please try again."
        );

        return;
      }

      // Clear form after successful password change
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFieldErrors({});

      // Reset visibility states
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      onSuccess();
    } catch {
      onError(
        "Unable to connect to the server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "w-full rounded-lg border border-[#CBD5E1] bg-white px-4 py-3 pr-12 text-sm text-[#1E293B] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC]";

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="max-w-xl">
        <div>
          <h2 className="text-lg font-semibold text-[#1E293B]">
            Change Password
          </h2>

          <p className="mt-1 text-sm text-[#64748B]">
            Update your password to keep your account
            secure.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
          noValidate
        >
          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-2 block text-sm font-medium text-[#1E293B]"
            >
              Current Password
            </label>

            <div className="relative">
              <input
                id="currentPassword"
                name="currentPassword"
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                value={currentPassword}
                onChange={(event) => {
                  setCurrentPassword(event.target.value);
                  clearFieldError("currentPassword");
                }}
                autoComplete="current-password"
                aria-describedby="currentPassword-error"
                aria-invalid={
                  !!fieldErrors.currentPassword
                }
                disabled={loading}
                className={inputClassName}
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(
                    (current) => !current
                  )
                }
                disabled={loading}
                aria-label={
                  showCurrentPassword
                    ? "Hide current password"
                    : "Show current password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showCurrentPassword ? (
                  <EyeOffIcon />
                ) : (
                  <EyeIcon />
                )}
              </button>
            </div>

            <div
              id="currentPassword-error"
              aria-live="polite"
              className="mt-1 min-h-5 text-sm text-red-600"
            >
              {fieldErrors.currentPassword && (
                <p>{fieldErrors.currentPassword}</p>
              )}
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block text-sm font-medium text-[#1E293B]"
            >
              New Password
            </label>

            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  clearFieldError("newPassword");
                }}
                autoComplete="new-password"
                aria-describedby="newPassword-help newPassword-error"
                aria-invalid={
                  !!fieldErrors.newPassword
                }
                disabled={loading}
                className={inputClassName}
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword(
                    (current) => !current
                  )
                }
                disabled={loading}
                aria-label={
                  showNewPassword
                    ? "Hide new password"
                    : "Show new password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showNewPassword ? (
                  <EyeOffIcon />
                ) : (
                  <EyeIcon />
                )}
              </button>
            </div>

            <p
              id="newPassword-help"
              className="mt-1 text-xs text-[#64748B]"
            >
              Password must be between 8 and 32
              characters.
            </p>

            <div
              id="newPassword-error"
              aria-live="polite"
              className="mt-1 min-h-5 text-sm text-red-600"
            >
              {fieldErrors.newPassword && (
                <p>{fieldErrors.newPassword}</p>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-[#1E293B]"
            >
              Confirm New Password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  clearFieldError("confirmPassword");
                }}
                autoComplete="new-password"
                aria-describedby="confirmPassword-error"
                aria-invalid={
                  !!fieldErrors.confirmPassword
                }
                disabled={loading}
                className={inputClassName}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) => !current
                  )
                }
                disabled={loading}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showConfirmPassword ? (
                  <EyeOffIcon />
                ) : (
                  <EyeIcon />
                )}
              </button>
            </div>

            <div
              id="confirmPassword-error"
              aria-live="polite"
              className="mt-1 min-h-5 text-sm text-red-600"
            >
              {fieldErrors.confirmPassword && (
                <p>{fieldErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-[#E2E8F0] pt-5 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Changing Password..."
                : "Change Password"}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-lg border border-[#E2E8F0] px-5 py-2.5 text-sm font-medium text-[#1E293B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Eye Icon */
function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 12s3.5-7.5 9.5-7.5 9.5 7.5 9.5 7.5-3.5 7.5-9.5 7.5S2.5 12 2.5 12z"
      />

      <circle
        cx="12"
        cy="12"
        r="3"
      />
    </svg>
  );
}

/* Eye Off Icon */
function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.584 10.587a2 2 0 002.829 2.829"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.88 5.09A10.94 10.94 0 0112 4.5c5.5 0 9.5 5.5 9.5 7.5a9.9 9.9 0 01-2.05 3.33"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.61 6.61C4.35 8.1 2.5 10.63 2.5 12c0 2 4 7.5 9.5 7.5a10.9 10.9 0 004.1-.8"
      />
    </svg>
  );
}