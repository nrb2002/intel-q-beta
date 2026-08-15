import Link from "next/link";
import { DashboardCard } from "./DashboardCard";


const actions = [
  {
    title: "Join Queue",
    description: "Create a new queue ticket",
    href: "/dashboard/queue",
  },
  {
    title: "View Queue",
    description: "Monitor current queue status",
    href: "/dashboard/queue",
  },
  {
    title: "Manage Branches",
    description: "View available branches",
    href: "/dashboard/branches",
  },
  {
    title: "My Profile",
    description: "Update account details",
    href: "/dashboard/profile",
  },
];


export function QuickActions() {
  return (
    <DashboardCard
      title="Quick Actions"
      description="Common Intel-Q tasks"
    >

      <div className="space-y-3">

        {actions.map((action) => (

          <Link
            key={action.title}
            href={action.href}
            className="
              block
              rounded-lg
              border
              border-[#E2E8F0]
              p-4
              transition
              hover:border-[#2563EB]
              hover:bg-[#EFF6FF]
            "
          >

            <h4 className="
              font-semibold
              text-[#1E293B]
            ">
              {action.title}
            </h4>


            <p className="
              mt-1
              text-sm
              text-[#64748B]
            ">
              {action.description}
            </p>


          </Link>

        ))}

      </div>

    </DashboardCard>
  );
}