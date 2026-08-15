import { StatsCard } from "@/components/dashboard/StatsCard";
import { QueueOverview } from "@/components/dashboard/QueueOverview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      {/* Dashboard Header */}
      <DashboardHeader />

      {/* Statistics */}
      <div
        className="
          grid
          grid-cols-1
          gap-6
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        <StatsCard title="Waiting" value="24" description="Customers waiting" />

        <StatsCard title="In Service" value="5" description="Currently served" />

        <StatsCard title="Completed" value="120" description="Completed today" />

        <StatsCard title="Branches" value="8" description="Active branches" />
      </div>

      {/* Main Dashboard Content */}
      <div
        className="
          grid
          grid-cols-1
          gap-6
          lg:grid-cols-3
        "
      >
        {/* Queue takes 2 columns */}
        <div className="lg:col-span-2">
          <QueueOverview />
        </div>

        {/* Actions */}
        <div>
          <QuickActions />
        </div>
      </div>
    </section>
  );
}
