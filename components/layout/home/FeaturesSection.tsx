import {
  Clock3,
  LayoutDashboard,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { Card } from "@/components/ui/Card";

const features = [
  {
    icon: Clock3,
    title: "Reduce Waiting Uncertainty",
    description:
      "Give customers clear visibility into their queue position and help them better understand their expected waiting experience.",
  },
  {
    icon: LayoutDashboard,
    title: "Manage Queues Efficiently",
    description:
      "Provide staff with an organized dashboard to monitor active queues, call customers, and manage ticket statuses.",
  },
  {
    icon: ShieldCheck,
    title: "Secure and Reliable",
    description:
      "Protect user accounts and application data with secure authentication and role-based access for customers, staff, and administrators.",
  },
  {
    icon: Smartphone,
    title: "Accessible Everywhere",
    description:
      "Access Intel-Q from mobile, tablet, or desktop devices through a responsive interface designed for modern service environments.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-[#F8FAFC] px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-[#2563EB]">
            Why Intel-Q?
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl">
            A smarter way to manage customer queues
          </h2>

          <p className="mt-4 text-base leading-7 text-[#64748B]">
            Intel-Q helps organizations improve customer flow, reduce waiting
            uncertainty, and give staff the tools they need to manage queues
            efficiently.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="group border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB] transition-colors group-hover:bg-[#2563EB] group-hover:text-white">
                  <Icon
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="text-xl font-semibold text-[#1E293B]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#64748B]">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}