export default function QueueLoading() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading queue">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-20 animate-pulse rounded-xl bg-[#E2E8F0]" />
      ))}
    </div>
  );
}
