export default function BranchesLoading() {
  return (
    <div className="space-y-8" role="status" aria-label="Loading branches">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-[#E2E8F0]" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-[#E2E8F0]" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-56 animate-pulse rounded-xl bg-[#E2E8F0]" />
        ))}
      </div>
    </div>
  );
}
