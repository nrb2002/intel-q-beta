import {
  CheckCircle2,
  LogIn,
  Ticket,
  UserRoundCheck,
} from "lucide-react";

import { Card } from "@/components/ui/Card";

const steps = [
  {
    number: "01",
    icon: LogIn,
    title: "Sign In or Register",
    description:
      "Create your Intel-Q account or sign in securely to access queue management services.",
  },
  {
    number: "02",
    icon: Ticket,
    title: "Join a Queue",
    description:
      "Select a branch and service, then create a queue ticket without needing to wait in a physical line.",
  },
  {
    number: "03",
    icon: UserRoundCheck,
    title: "Monitor Your Position",
    description:
      "View your current queue position and keep track of your ticket status while you wait.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Get Served",
    description:
      "Receive service when your ticket is called and complete your visit with a smoother customer experience.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-white px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-[#2563EB]">
            How It Works
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl">
            Queue management made simple
          </h2>

          <p className="mt-4 text-base leading-7 text-[#64748B]">
            Intel-Q simplifies the queue experience for customers by providing
            a clear and convenient way to join, monitor, and complete their
            service journey.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <Card
                key={step.number}
                className="relative border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Step Number */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                    <Icon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </div>

                  <span className="text-sm font-semibold text-[#CBD5E1]">
                    {step.number}
                  </span>
                </div>

                {/* Step Content */}
                <h3 className="text-xl font-semibold text-[#1E293B]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#64748B]">
                  {step.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}