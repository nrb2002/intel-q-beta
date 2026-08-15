// components/branch/BranchCard.tsx

"use client";

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  queueTicketCount: number;
  createdAt: string;
  updatedAt: string;
}

interface BranchCardProps {
  branch: Branch;
  onEdit?: (branch: Branch) => void;
  onDelete?: (branch: Branch) => void;
  deleting?: boolean;
}

export function BranchCard({
  branch,
  onEdit,
  onDelete,
  deleting = false,
}: BranchCardProps) {
  return (
    <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Branch information */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-[#1E293B]">
            {branch.name}
          </h3>

          <div className="mt-3 space-y-2 text-sm text-[#64748B]">
            <div className="flex items-start gap-2">
              <LocationIcon />

              <span>{branch.address}</span>
            </div>

            <div className="flex items-center gap-2">
              <CityIcon />

              <span>{branch.city}</span>
            </div>
          </div>
        </div>

        {/* Queue count */}
        <div className="shrink-0 rounded-lg bg-[#EFF6FF] px-4 py-3 text-center">
          <p className="text-2xl font-bold text-[#2563EB]">
            {branch.queueTicketCount}
          </p>

          <p className="text-xs font-medium text-[#64748B]">
            Queue{" "}
            {branch.queueTicketCount === 1
              ? "ticket"
              : "tickets"}
          </p>
        </div>
      </div>

      {/* Actions */}
      {(onEdit || onDelete) && (
        <div className="mt-5 flex flex-col gap-2 border-t border-[#E2E8F0] pt-4 sm:flex-row sm:justify-end">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(branch)}
              disabled={deleting}
              className="rounded-lg border border-[#CBD5E1] px-4 py-2 text-sm font-medium text-[#1E293B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Edit
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(branch)}
              disabled={deleting}
              aria-busy={deleting}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      )}
    </article>
  );
}

/* Location icon */
function LocationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="mt-0.5 h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s7-5.686 7-12A7 7 0 005 9c0 6.314 7 12 7 12z"
      />

      <circle
        cx="12"
        cy="9"
        r="2.5"
      />
    </svg>
  );
}

/* City icon */
function CityIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4 shrink-0"
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