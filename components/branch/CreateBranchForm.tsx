// components/branch/CreateBranchForm.tsx

"use client";

import { FormEvent, useState } from "react";

import { createBranchSchema } from "@/lib/validations/branch";

interface CreateBranchFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

type FieldErrors = {
  name?: string;
  address?: string;
  city?: string;
};

type ApiResponse = {
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export function CreateBranchForm({
  onSuccess,
  onError,
  onCancel,
}: CreateBranchFormProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  const [loading, setLoading] = useState(false);

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      return {
        ...current,
        [field]: undefined,
      };
    });

    onError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    onError("");
    setFieldErrors({});

    // Client-side validation.
    const parsed = createBranchSchema.safeParse({
      name,
      address,
      city,
    });

    if (!parsed.success) {
      const errors: FieldErrors = {};

      for (const issue of parsed.error.issues) {
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

      const response = await fetch("/api/branches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      let data: ApiResponse;

      // Safely parse the API response.
      try {
        data = await response.json();
      } catch {
        onError(
          "The server returned an invalid response. Please try again.",
        );
        return;
      }

      // Handle API errors.
      if (!response.ok) {
        if (data.fieldErrors) {
          const serverErrors: FieldErrors = {};

          if (data.fieldErrors.name?.[0]) {
            serverErrors.name =
              data.fieldErrors.name[0];
          }

          if (data.fieldErrors.address?.[0]) {
            serverErrors.address =
              data.fieldErrors.address[0];
          }

          if (data.fieldErrors.city?.[0]) {
            serverErrors.city =
              data.fieldErrors.city[0];
          }

          setFieldErrors(serverErrors);
        }

        if (response.status === 401) {
          onError(
            "Your session has expired. Please sign in again.",
          );
        } else if (response.status === 403) {
          onError(
            "You do not have permission to create a branch.",
          );
        } else if (response.status === 409) {
          onError(
            data.error ||
              "A branch with these details already exists.",
          );
        } else {
          onError(
            data.error ||
              "Unable to create the branch. Please try again.",
          );
        }

        return;
      }

      // Clear the form after successful creation.
      setName("");
      setAddress("");
      setCity("");
      setFieldErrors({});

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
            Add Branch
          </h2>

          <p className="mt-1 text-sm text-[#64748B]">
            Add a new Intel-Q branch location.
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
              htmlFor="branch-name"
              className="mb-2 block text-sm font-medium text-[#1E293B]"
            >
              Branch name
            </label>

            <input
              id="branch-name"
              name="name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearFieldError("name");
              }}
              autoComplete="organization"
              aria-describedby="branch-name-error"
              aria-invalid={!!fieldErrors.name}
              disabled={loading}
              className={getInputClassName("name")}
            />

            <div
              id="branch-name-error"
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
              htmlFor="branch-address"
              className="mb-2 block text-sm font-medium text-[#1E293B]"
            >
              Address
            </label>

            <input
              id="branch-address"
              name="address"
              type="text"
              value={address}
              onChange={(event) => {
                setAddress(event.target.value);
                clearFieldError("address");
              }}
              autoComplete="street-address"
              aria-describedby="branch-address-error"
              aria-invalid={!!fieldErrors.address}
              disabled={loading}
              className={getInputClassName("address")}
            />

            <div
              id="branch-address-error"
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
              htmlFor="branch-city"
              className="mb-2 block text-sm font-medium text-[#1E293B]"
            >
              City
            </label>

            <input
              id="branch-city"
              name="city"
              type="text"
              value={city}
              onChange={(event) => {
                setCity(event.target.value);
                clearFieldError("city");
              }}
              autoComplete="address-level2"
              aria-describedby="branch-city-error"
              aria-invalid={!!fieldErrors.city}
              disabled={loading}
              className={getInputClassName("city")}
            />

            <div
              id="branch-city-error"
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
                ? "Creating Branch..."
                : "Add Branch"}
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
