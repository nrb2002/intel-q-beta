// components/profile/EditProfileForm.tsx

"use client";

import { FormEvent, useState } from "react";

import { updateProfileSchema } from "@/lib/validations/profile";
import type { UserProfile } from "@/types/user";

interface EditProfileFormProps {
  user: UserProfile;
  onSuccess: (user: UserProfile) => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

type FieldErrors = {
  firstName?: string;
  lastName?: string;
};

export function EditProfileForm({
  user,
  onSuccess,
  onError,
  onCancel,
}: EditProfileFormProps) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    onError("");
    setFieldErrors({});

    // Client-side validation
    const result = updateProfileSchema.safeParse({
      firstName,
      lastName,
    });

    if (!result.success) {
      const errors: FieldErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (
          field === "firstName" ||
          field === "lastName"
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

      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      let data: {
        user?: UserProfile;
        error?: string;
        fieldErrors?: Record<string, string>;
      };

      // Protect against invalid API responses
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

          if (data.fieldErrors.firstName) {
            serverErrors.firstName =
              data.fieldErrors.firstName;
          }

          if (data.fieldErrors.lastName) {
            serverErrors.lastName =
              data.fieldErrors.lastName;
          }

          setFieldErrors(serverErrors);
        }

        onError(
          data.error ||
            "Unable to update your profile. Please try again."
        );

        return;
      }

      // Make sure the API returned the updated user
      if (!data.user) {
        onError(
          "Your profile could not be updated. Please try again."
        );
        return;
      }

      // Successful update
      onSuccess(data.user);
    } catch {
      onError(
        "Unable to connect to the server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-[#1E293B]">
          Edit Profile
        </h2>

        <p className="mt-1 text-sm text-[#64748B]">
          Update your personal account information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5"
        noValidate
      >
        {/* Names */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* First Name */}
          <div>
            <label
              htmlFor="profile-first-name"
              className="mb-2 block text-sm font-medium text-[#1E293B]"
            >
              First name
            </label>

            <input
              id="profile-first-name"
              name="firstName"
              type="text"
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);

                if (fieldErrors.firstName) {
                  setFieldErrors((current) => ({
                    ...current,
                    firstName: undefined,
                  }));
                }
              }}
              autoComplete="given-name"
              aria-describedby="profile-first-name-error"
              aria-invalid={!!fieldErrors.firstName}
              disabled={loading}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#1E293B] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC]"
            />

            <div
              id="profile-first-name-error"
              aria-live="polite"
              className="mt-1 min-h-5 text-sm text-red-600"
            >
              {fieldErrors.firstName && (
                <p>{fieldErrors.firstName}</p>
              )}
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="profile-last-name"
              className="mb-2 block text-sm font-medium text-[#1E293B]"
            >
              Last name
            </label>

            <input
              id="profile-last-name"
              name="lastName"
              type="text"
              value={lastName}
              onChange={(event) => {
                setLastName(event.target.value);

                if (fieldErrors.lastName) {
                  setFieldErrors((current) => ({
                    ...current,
                    lastName: undefined,
                  }));
                }
              }}
              autoComplete="family-name"
              aria-describedby="profile-last-name-error"
              aria-invalid={!!fieldErrors.lastName}
              disabled={loading}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#1E293B] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC]"
            />

            <div
              id="profile-last-name-error"
              aria-live="polite"
              className="mt-1 min-h-5 text-sm text-red-600"
            >
              {fieldErrors.lastName && (
                <p>{fieldErrors.lastName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Email - Read Only */}
        <div>
          <label
            htmlFor="profile-email"
            className="mb-2 block text-sm font-medium text-[#1E293B]"
          >
            Email address
          </label>

          <input
            id="profile-email"
            name="email"
            type="email"
            value={user.email}
            readOnly
            disabled
            aria-describedby="profile-email-help"
            className="w-full cursor-not-allowed rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-sm text-[#64748B] outline-none"
          />

          <p
            id="profile-email-help"
            className="mt-1 text-xs text-[#64748B]"
          >
            Your email address is used as your account
            identifier and cannot be changed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 border-t border-[#E2E8F0] pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-[#E2E8F0] px-5 py-2.5 text-sm font-medium text-[#1E293B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}