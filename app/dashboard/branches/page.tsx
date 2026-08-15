"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Users, ArrowRight, Building2, Plus } from "lucide-react";
import { CreateBranchForm } from "@/components/branch/CreateBranchForm";

const branches = [
  {
    id: "1",
    name: "Intel-Q Main Branch",
    address: "123 Boulevard du 30 Juin",
    city: "Kinshasa-Gombe",
    customers: 24,
    status: "Active",
  },
  {
    id: "2",
    name: "Intel-Q Downtown Branch",
    address: "45 Avenue de la Justice",
    city: "Kinshasa",
    customers: 18,
    status: "Active",
  },
  {
    id: "3",
    name: "Intel-Q West Branch",
    address: "78 Avenue Kasa-Vubu",
    city: "Kinshasa",
    customers: 12,
    status: "Active",
  },
  {
    id: "4",
    name: "Intel-Q East Branch",
    address: "22 Boulevard Lumumba",
    city: "Kinshasa",
    customers: 9,
    status: "Active",
  },
];

export default function BranchesPage() {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSuccess() {
    setMessage("Branch created successfully.");
    setError("");
    setShowForm(false);
  }

  function handleError(errorMessage: string) {
    setError(errorMessage);
    setMessage("");
  }

  return (
    <section className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">Branches</h1>
          <p className="mt-2 text-[#64748B]">
            View and manage Intel-Q branches and their queue activity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm((current) => !current);
            setMessage("");
            setError("");
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
        >
          <Plus size={16} aria-hidden="true" />
          {showForm ? "Cancel" : "Add Branch"}
        </button>
      </div>

      {/* Success / Error messages */}
      {message && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {message}
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Create Branch Form */}
      {showForm && (
        <CreateBranchForm
          onSuccess={handleSuccess}
          onError={handleError}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Branches */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">Total Branches</p>
              <p className="mt-2 text-3xl font-bold text-[#1E293B]">{branches.length}</p>
            </div>
            <div className="rounded-lg bg-[#EFF6FF] p-3">
              <Building2 size={24} className="text-[#2563EB]" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Active Branches */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">Active Branches</p>
              <p className="mt-2 text-3xl font-bold text-[#1E293B]">
                {branches.filter((branch) => branch.status === "Active").length}
              </p>
            </div>
            <div className="rounded-lg bg-[#F0FDF4] p-3">
              <Building2 size={24} className="text-green-600" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Customers Waiting */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">Customers Waiting</p>
              <p className="mt-2 text-3xl font-bold text-[#1E293B]">
                {branches.reduce((total, branch) => total + branch.customers, 0)}
              </p>
            </div>
            <div className="rounded-lg bg-[#FFF7ED] p-3">
              <Users size={24} className="text-orange-500" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      {/* Branch List */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-[#1E293B]">All Branches</h2>
          <p className="mt-1 text-sm text-[#64748B]">Select a branch to view its queue.</p>
        </div>

        {branches.length === 0 ? (
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-12 text-center">
            <p className="text-[#1E293B] font-medium">No branches found.</p>
            <p className="mt-1 text-sm text-[#64748B]">
              There are currently no branches available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                {/* Branch Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1E293B]">{branch.name}</h3>
                    <span className="mt-2 inline-flex rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#166534]">
                      {branch.status}
                    </span>
                  </div>
                  <div className="rounded-lg bg-[#EFF6FF] p-3">
                    <Building2 size={22} className="text-[#2563EB]" aria-hidden="true" />
                  </div>
                </div>

                {/* Address */}
                <div className="mt-6 flex items-start gap-3">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-[#64748B]" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-[#1E293B]">{branch.address}</p>
                    <p className="text-sm text-[#64748B]">{branch.city}</p>
                  </div>
                </div>

                {/* Queue Information */}
                <div className="mt-6 flex items-center justify-between border-t border-[#E2E8F0] pt-5">
                  <div>
                    <p className="text-sm text-[#64748B]">Customers waiting</p>
                    <p className="mt-1 text-2xl font-bold text-[#1E293B]">{branch.customers}</p>
                  </div>
                  <Link
                    href={`/dashboard/queue?branch=${branch.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
                  >
                    View Queue
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
