import { DashboardCard } from "./DashboardCard";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
}

export function StatsCard({
  title,
  value,
  description,
}: StatsCardProps) {

  return (
    <DashboardCard title={title}>

      <div>

        <h2 className="
          text-4xl
          font-bold
          text-[#1E293B]
        ">
          {value}
        </h2>


        <p className="
          mt-2
          text-sm
          text-[#64748B]
        ">
          {description}
        </p>

      </div>

    </DashboardCard>
  );
}