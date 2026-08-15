export default function ProfileLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading profile">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-64 animate-pulse rounded-xl bg-[#E2E8F0]" />
        <div className="h-64 animate-pulse rounded-xl bg-[#E2E8F0] lg:col-span-2" />
      </div>
    </div>
  );
}
