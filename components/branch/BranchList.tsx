// components/branch/BranchList

"use client";

import { useEffect, useState } from "react";

import {
  BranchCard,
  type Branch,
} from "./BranchCard";

interface BranchListProps {
  onEdit?: (branch: Branch) => void;
  onDelete?: (branch: Branch) => void;
  refreshKey?: number;
}

type ApiErrorResponse = {
  error?: string;
};

export function BranchList({
  onEdit,
  onDelete,
  refreshKey = 0,
}: BranchListProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadBranches() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/branches", {
          method: "GET",
          cache: "no-store",
        });

        const data: unknown = await response.json();

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          const errorData = data as ApiErrorResponse;

          if (response.status === 401) {
            setError(
              "Your session has expired. Please sign in again.",
            );
          } else if (response.status === 403) {
            setError(
              "You do not have permission to view branches.",
            );
          } else {
            setError(
              errorData.error ||
                "Unable to load branches. Please try again.",
            );
          }

          return;
        }

        if (!Array.isArray(data)) {
          setError(
            "Unable to load branches. Please try again.",
          );
          return;
        }

        setBranches(data as Branch[]);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to fetch branches:",
          error,
        );

        setError(
          "Unable to connect to the server. Please check your connection and try again.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadBranches();

    return () => {
      cancelled = true;
    };
  }, [refreshKey, retryKey]);

  function handleRetry() {
    setRetryKey((current) => current + 1);
  }

  if (loading) {
    return (
      <section
        aria-live="polite"
        aria-busy="true"
        className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <span
            className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#CBD5E1] border-t-[#2563EB]"
            aria-hidden="true"
          />

          <div>
            <h2 className="text-lg font-semibold text-[#1E293B]">
              Loading branches...
            </h2>

            <p className="mt-1 text-sm text-[#64748B]">
              Please wait while we load the available
              branches.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        role="alert"
        aria-live="assertive"
        className="rounded-xl border border-red-200 bg-red-50 p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-red-800">
              Unable to load branches
            </h2>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRetry}
            className="shrink-0 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (branches.length === 0) {
    return (
      <section
        aria-live="polite"
        className="rounded-xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
          <BranchIcon />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-[#1E293B]">
          No branches found
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
          There are currently no branches available.
          Create a branch to get started.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="Branches"
      aria-live="polite"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#1E293B]">
          Branches
        </h2>

        <p className="mt-1 text-sm text-[#64748B]">
          {branches.length}{" "}
          {branches.length === 1
            ? "branch"
            : "branches"}{" "}
          available.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {branches.map((branch) => (
          <BranchCard
            key={branch.id}
            branch={branch}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}

function BranchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 21V5a1 1 0 011-1h9a1 1 0 011 1v16"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 9h4a1 1 0 011 1v11"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 8h3M8 12h3M8 16h3M17 13h1M17 17h1"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 21h20"
      />
    </svg>
  );
}