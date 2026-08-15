import { Card } from "@/components/ui/Card";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DashboardCard({
  title,
  description,
  children,
}: DashboardCardProps) {
  return (
    <Card className="p-6">

      <div className="mb-5">

        <h3 className="
          text-xl
          font-semibold
          text-[#1E293B]
        ">
          {title}
        </h3>


        {description && (
          <p className="
            mt-1
            text-sm
            text-[#64748B]
          ">
            {description}
          </p>
        )}

      </div>


      {children}

    </Card>
  );
}