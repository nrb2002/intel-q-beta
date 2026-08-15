export default function DashboardLoading() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading dashboard">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 animate-pulse rounded-xl bg-[#E2E8F0]" />
      ))}
    </div>
  );
}
