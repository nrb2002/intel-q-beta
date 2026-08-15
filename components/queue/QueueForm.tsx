// components/queue/QueueForm.tsx

"use client";

import { FormEvent, useEffect, useState } from "react";

import { createTicketSchema } from "@/lib/validations/queue";

type Branch = {
  id: string;
  name: string;
  address: string;
  city: string;
};

type QueueTicket = {
  id: string;
  ticketNumber: number;
  customerName: string;
  branchName: string;
  serviceType: string;
  status: string;
  createdAt: string;
  calledAt?: string;
  completedAt?: string;
};

type FieldErrors = {
  branchId?: string[];
  serviceType?: string[];
};

interface JoinQueueFormProps {
  onSuccess: () => void;
}

const serviceTypes = [
  "Account Opening",
  "Loan Application",
  "Support",
  "Account Enquiry",
];

export function JoinQueueForm({
  onSuccess,
}: JoinQueueFormProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState("");
  const [serviceType, setServiceType] = useState("");

  const [loadingBranches, setLoadingBranches] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [success, setSuccess] = useState("");

  const [ticket, setTicket] =
    useState<QueueTicket | null>(null);

  useEffect(() => {
    async function loadBranches() {
      try {
        setLoadingBranches(true);
        setError("");

        const response = await fetch(
          "/api/branches",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        let data: unknown;

        try {
          data = await response.json();
        } catch {
          setError(
            "Unable to load branches. Please try again."
          );
          return;
        }

        if (!response.ok) {
          if (
            typeof data === "object" &&
            data !== null &&
            "error" in data &&
            typeof data.error === "string"
          ) {
            setError(data.error);
          } else {
            setError(
              "Unable to load branches. Please try again."
            );
          }

          return;
        }

        if (!Array.isArray(data)) {
          setError(
            "Unable to load branches. Please try again."
          );
          return;
        }

        setBranches(data as Branch[]);
      } catch (error) {
        console.error(
          "Failed to load branches:",
          error
        );

        setError(
          "Unable to connect to the server. Please try again."
        );
      } finally {
        setLoadingBranches(false);
      }
    }

    loadBranches();
  }, []);

  function handleBranchChange(value: string) {
    setBranchId(value);

    setFieldErrors((previous) => ({
      ...previous,
      branchId: undefined,
    }));

    setError("");
    setSuccess("");
  }

  function handleServiceChange(value: string) {
    setServiceType(value);

    setFieldErrors((previous) => ({
      ...previous,
      serviceType: undefined,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setFieldErrors({});
    setTicket(null);

    const parsed = createTicketSchema.safeParse({
      branchId,
      serviceType,
    });

    if (!parsed.success) {
      setFieldErrors(
        parsed.error.flatten()
          .fieldErrors as Record<
          string,
          string[]
        >
      );

      setError(
        "Please correct the highlighted fields."
      );

      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        "/api/queues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsed.data),
        }
      );

      let data: unknown;

      try {
        data = await response.json();
      } catch {
        setError(
          "The server returned an invalid response. Please try again."
        );

        return;
      }

      if (!response.ok) {
        if (
          typeof data === "object" &&
          data !== null &&
          "fieldErrors" in data &&
          typeof data.fieldErrors === "object" &&
          data.fieldErrors !== null
        ) {
          setFieldErrors(
            data.fieldErrors as Record<
              string,
              string[]
            >
          );
        }

        if (
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
        ) {
          setError(data.error);
        } else {
          setError(
            "Unable to create your ticket. Please try again."
          );
        }

        return;
      }

      if (
        typeof data !== "object" ||
        data === null ||
        !("ticket" in data) ||
        typeof data.ticket !== "object" ||
        data.ticket === null
      ) {
        setError(
          "The server returned an invalid ticket response. Please try again."
        );

        return;
      }

      const createdTicket =
        data.ticket as QueueTicket;

      setTicket(createdTicket);

      setSuccess(
        "Your queue ticket has been created successfully."
      );

      setBranchId("");
      setServiceType("");
      setFieldErrors({});

      // Refresh the queue list on the parent page.
      onSuccess();
    } catch (error) {
      console.error(
        "Queue ticket request failed:",
        error
      );

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClassName =
    "w-full rounded-lg border border-[#CBD5E1] bg-white px-4 py-3 text-[#1E293B] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:bg-[#F1F5F9]";

  function getInputClassName(
    field: keyof FieldErrors
  ) {
    if (fieldErrors[field]?.length) {
      return `${inputClassName} border-red-500 focus:border-red-500 focus:ring-red-500/20`;
    }

    return inputClassName;
  }

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#1E293B]">
          Join the Queue
        </h2>

        <p className="mt-1 text-sm text-[#64748B]">
          Select a branch and service to receive your
          queue ticket.
        </p>
      </div>

      {/* General Error */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div
          role="status"
          aria-live="polite"
          className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      {/* Created Ticket */}
      {ticket && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5"
        >
          <p className="text-sm font-medium text-[#64748B]">
            Your Ticket Number
          </p>

          <p className="mt-1 text-4xl font-bold text-[#1E293B]">
            {ticket.ticketNumber}
          </p>

          <p className="mt-2 text-sm text-[#64748B]">
            {ticket.branchName} ·{" "}
            {ticket.serviceType}
          </p>

          <p className="mt-1 text-sm font-medium text-[#64748B]">
            Status: {ticket.status}
          </p>
        </div>
      )}

      {/* Branch Loading */}
      {loadingBranches ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm text-[#64748B]"
        >
          Loading available branches...
        </div>
      ) : branches.length === 0 ? (
        /* Empty Branch State */
        <div
          role="status"
          className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center"
        >
          <p className="font-medium text-[#1E293B]">
            No branches available.
          </p>

          <p className="mt-1 text-sm text-[#64748B]">
            There are currently no branches available
            for queue registration.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5"
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
              onChange={(event) =>
                handleBranchChange(
                  event.target.value
                )
              }
              disabled={submitting}
              aria-invalid={
                !!fieldErrors.branchId?.length
              }
              aria-describedby="branchId-error"
              className={getInputClassName(
                "branchId"
              )}
            >
              <option value="">
                Select a branch
              </option>

              {branches.map((branch) => (
                <option
                  key={branch.id}
                  value={branch.id}
                >
                  {branch.name} - {branch.city}
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
              Service
            </label>

            <select
              id="serviceType"
              name="serviceType"
              value={serviceType}
              onChange={(event) =>
                handleServiceChange(
                  event.target.value
                )
              }
              disabled={submitting}
              aria-invalid={
                !!fieldErrors.serviceType?.length
              }
              aria-describedby="serviceType-error"
              className={getInputClassName(
                "serviceType"
              )}
            >
              <option value="">
                Select a service
              </option>

              {serviceTypes.map((service) => (
                <option
                  key={service}
                  value={service}
                >
                  {service}
                </option>
              ))}
            </select>

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

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            className="w-full rounded-lg bg-[#1E293B] px-5 py-3 font-medium text-white transition hover:bg-[#334155] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Joining Queue..."
              : "Join Queue"}
          </button>
        </form>
      )}
    </div>
  );
}