// components/branch/BranchForm.tsx

"use client";

import {
  FormEvent,
  useState,
} from "react";

import { createBranchSchema } from "@/lib/validations/branch";

export interface BranchFormData {
  id: string;
  name: string;
  address: string;
  city: string;
}

interface BranchFormProps {
  branch: BranchFormData;
  onSuccess: () => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

type FieldErrors = {
  name?: string;
  address?: string;
  city?: string;
};

export function BranchForm({
  branch,
  onSuccess,
  onError,
  onCancel,
}: BranchFormProps) {
  const [name, setName] = useState(branch.name);
  const [address, setAddress] = useState(branch.address);
  const [city, setCity] = useState(branch.city);

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  const [loading, setLoading] = useState(false);

  function clearFieldError(
    field: keyof FieldErrors,
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
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    onError("");
    setFieldErrors({});

    const result = createBranchSchema.safeParse({
      name,
      address,
      city,
    });

    if (!result.success) {
      const errors: FieldErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (
          field === "name" ||
          field === "address" ||
          field === "city"
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
        `/api/branches/${branch.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result.data),
        },
      );

      let data: {
        error?: string;
        fieldErrors?: FieldErrors;
      };

      try {
        data = await response.json();
      } catch {
        onError(
          "The server returned an invalid response. Please try again.",
        );
        return;
      }

      if (!response.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }

        if (response.status === 401) {
          onError(
            "Your session has expired. Please sign in again.",
          );
        } else if (response.status === 403) {
          onError(
            "You do not have permission to update this branch.",
          );
        } else if (response.status === 404) {
          onError(
            "This branch could not be found. Please refresh the page and try again.",
          );
        } else {
          onError(
            data.error ||
              "Unable to update the branch. Please try again.",
          );
        }

        return;
      }

      onSuccess();
    } catch {
      onError(
        "Unable to connect to the server. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "w-full rounded-lg border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#1E293B] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC]";

  function getInputClassName(
    field: keyof FieldErrors,
  ) {
    if (fieldErrors[field]) {
      return `${inputClassName} border-red-500 focus:border-red-500 focus:ring-red-500/20`;
    }

    return inputClassName;
  }

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="max-w-xl">
        <div>
          <h2 className="text-lg font-semibold text-[#1E293B]">
            Edit Branch
          </h2>

          <p className="mt-1 text-sm text-[#64748B]">
            Update the branch information below.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
          noValidate
        >
          {/* Branch Name */}
          <div>
            <label
              htmlFor="edit-branch-name"
              className="mb-2 block text-sm font-medium text-[#1E293B]"
            >
              Branch name
            </label>

            <input
              id="edit-branch-name"
              name="name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearFieldError("name");
              }}
              aria-describedby="edit-branch-name-error"
              aria-invalid={!!fieldErrors.name}
              disabled={loading}
              className={getInputClassName("name")}
            />

            <div
              id="edit-branch-name-error"
              aria-live="polite"
              className="mt-1 min-h-5 text-sm text-red-600"
            >
              {fieldErrors.name && (
                <p>{fieldErrors.name}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="edit-branch-address"
              className="mb-2 block text-sm font-medium text-[#1E293B]"
            >
              Address
            </label>

            <input
              id="edit-branch-address"
              name="address"
              type="text"
              value={address}
              onChange={(event) => {
                setAddress(event.target.value);
                clearFieldError("address");
              }}
              aria-describedby="edit-branch-address-error"
              aria-invalid={!!fieldErrors.address}
              disabled={loading}
              className={getInputClassName("address")}
            />

            <div
              id="edit-branch-address-error"
              aria-live="polite"
              className="mt-1 min-h-5 text-sm text-red-600"
            >
              {fieldErrors.address && (
                <p>{fieldErrors.address}</p>
              )}
            </div>
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="edit-branch-city"
              className="mb-2 block text-sm font-medium text-[#1E293B]"
            >
              City
            </label>

            <input
              id="edit-branch-city"
              name="city"
              type="text"
              value={city}
              onChange={(event) => {
                setCity(event.target.value);
                clearFieldError("city");
              }}
              aria-describedby="edit-branch-city-error"
              aria-invalid={!!fieldErrors.city}
              disabled={loading}
              className={getInputClassName("city")}
            />

            <div
              id="edit-branch-city-error"
              aria-live="polite"
              className="mt-1 min-h-5 text-sm text-red-600"
            >
              {fieldErrors.city && (
                <p>{fieldErrors.city}</p>
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
                ? "Updating Branch..."
                : "Update Branch"}
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