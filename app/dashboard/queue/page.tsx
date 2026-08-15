// app/dashboard/queue/page.tsx

"use client";

import { useCallback, useEffect, useState } from "react";

import { JoinQueueForm } from "@/components/queue/QueueForm";
import { QueueList } from "@/components/queue/QueueList";
import type { QueueTicket } from "@/types/queue";

export default function QueuePage() {
  const [tickets, setTickets] = useState<QueueTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/queues", {
        method: "GET",
        cache: "no-store",
      });

      let data: unknown;

      try {
        data = await response.json();
      } catch {
        setError("Unable to load your queue tickets. Please try again.");
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
          setError("Unable to load your queue tickets. Please try again.");
        }

        return;
      }

      if (!Array.isArray(data)) {
        setError("Unable to load your queue tickets. Please try again.");
        return;
      }

      setTickets(data as QueueTicket[]);
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchTickets();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchTickets]);

  const waitingTickets = tickets.filter((ticket) => ticket.status === "WAITING");

  const inServiceTickets = tickets.filter((ticket) => ticket.status === "IN_SERVICE");

  const completedTickets = tickets.filter((ticket) => ticket.status === "COMPLETED");

  function handleQueueSuccess() {
    // Refresh the queue after successfully creating
    // a new ticket.
    fetchTickets();
  }

  return (
    <section className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B]">Queue Management</h1>

        <p className="mt-2 text-[#64748B]">
          Monitor customer tickets and manage the current queue.
        </p>
      </div>

      {/* Join Queue */}
      <JoinQueueForm onSuccess={handleQueueSuccess} />

      {/* API Error */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>{error}</p>

            <button
              type="button"
              onClick={fetchTickets}
              disabled={loading}
              className="w-fit rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Queue Statistics */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#64748B]">Waiting</p>

            <p className="mt-2 text-3xl font-bold text-[#1E293B]">{waitingTickets.length}</p>

            <p className="mt-1 text-sm text-[#64748B]">Customers waiting</p>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#64748B]">In Service</p>

            <p className="mt-2 text-3xl font-bold text-[#1E293B]">{inServiceTickets.length}</p>

            <p className="mt-1 text-sm text-[#64748B]">Currently being served</p>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#64748B]">Completed</p>

            <p className="mt-2 text-3xl font-bold text-[#1E293B]">{completedTickets.length}</p>

            <p className="mt-1 text-sm text-[#64748B]">Completed tickets</p>
          </div>
        </div>
      )}

      {/* Queue */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#1E293B]">Current Queue</h2>

          <p className="mt-1 text-sm text-[#64748B]">
            View the current customer tickets and their status.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-6 py-10 text-center"
          >
            <p className="text-sm font-medium text-[#475569]">Loading queue tickets...</p>

            <p className="mt-1 text-sm text-[#64748B]">
              Please wait while we retrieve the latest queue information.
            </p>
          </div>
        )}

        {/* Queue List */}
        {!loading && !error && (
          <QueueList
            tickets={tickets}
            emptyMessage="You currently do not have any queue tickets."
          />
        )}
      </div>
    </section>
  );
}
