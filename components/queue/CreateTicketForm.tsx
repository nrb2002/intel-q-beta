"use client";

import { FormEvent, useState } from "react";

import {
  createTicketSchema,
} from "@/lib/validations/queue";

interface Branch {
  id: string;
  name: string;
}

interface CreateTicketFormProps {
  branches: Branch[];
  onSuccess: () => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

type FieldErrors = {
  branchId?: string[];
  serviceType?: string[];
};

export function CreateTicketForm({
  branches,
  onSuccess,
  onError,
  onCancel,
}: CreateTicketFormProps) {
  const [branchId, setBranchId] = useState("");
  const [serviceType, setServiceType] = useState("");

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  const [loading, setLoading] = useState(false);

  function handleBranchChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setBranchId(event.target.value);

    setFieldErrors((current) => ({
      ...current,
      branchId: undefined,
    }));

    onError("");
  }

  function handleServiceChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setServiceType(event.target.value);

    setFieldErrors((current) => ({
      ...current,
      serviceType: undefined,
    }));

    onError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    onError("");
    setFieldErrors({});

    // Client-side validation
    const parsed = createTicketSchema.safeParse({
      branchId,
      serviceType,
    });

    if (!parsed.success) {
      setFieldErrors(
        parsed.error.flatten()
          .fieldErrors as FieldErrors
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/queues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      let data: {
        error?: string;
        fieldErrors?: FieldErrors;
      };

      try {
        data = await response.json();
      } catch {
        onError(
          "The server returned an invalid response. Please try again."
        );
        return;
      }

      if (!response.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }

        onError(
          data.error ||
            "Unable to create your ticket. Please try again."
        );

        return;
      }

      setBranchId("");
      setServiceType("");

      onSuccess();
    } catch {
      onError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "w-full rounded-lg border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#1E293B] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC]";

  function getInputClassName(
    field: keyof FieldErrors
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
            Join a Queue
          </h2>

          <p className="mt-1 text-sm text-[#64748B]">
            Select a branch and describe what you need
            help with.
          </p>
        </div>

        {branches.length === 0 && (
          <div
            role="status"
            className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700"
          >
            No branches are currently available.
            Please try again later.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
          noValidate
        >
          {/* Branch */}
          <div>
            <label
              htmlFor="branchId"
              className="mb-2 block text-sm font-medium text-[#1E293B]"
            >
              Branch
            </label>

            <select
              id="branchId"
              name="branchId"
              value={branchId}
              onChange={handleBranchChange}
              aria-describedby="branchId-error"
              aria-invalid={!!fieldErrors.branchId}
              disabled={
                loading || branches.length === 0
              }
              className={getInputClassName("branchId")}
            >
              <option value="">
                Select a branch
              </option>

              {branches.map((branch) => (
                <option
                  key={branch.id}
                  value={branch.id}
                >
                  {branch.name}
                </option>
              ))}
            </select>

            <div
              id="branchId-error"
              aria-live="polite"
              className="mt-1 min-h-5 text-sm text-red-600"
            >
              {fieldErrors.branchId?.map(
                (message) => (
                  <p key={message}>{message}</p>
                )
              )}
            </div>
          </div>

          {/* Service */}
          <div>
            <label
              htmlFor="serviceType"
              className="mb-2 block text-sm font-medium text-[#1E293B]"
            >
              Service needed
            </label>

            <input
              id="serviceType"
              name="serviceType"
              type="text"
              value={serviceType}
              onChange={handleServiceChange}
              placeholder="e.g. Deposit, withdrawal, account inquiry"
              aria-describedby="serviceType-error"
              aria-invalid={!!fieldErrors.serviceType}
              disabled={loading}
              className={getInputClassName(
                "serviceType"
              )}
            />

            <p className="mt-1 text-xs text-[#64748B]">
              Maximum 100 characters.
            </p>

            <div
              id="serviceType-error"
              aria-live="polite"
              className="mt-1 min-h-5 text-sm text-red-600"
            >
              {fieldErrors.serviceType?.map(
                (message) => (
                  <p key={message}>{message}</p>
                )
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={
                loading || branches.length === 0
              }
              aria-busy={loading}
              className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Joining Queue..."
                : "Join Queue"}
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