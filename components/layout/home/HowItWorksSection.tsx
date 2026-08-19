import {
  CheckCircle2,
  LogIn,
  Ticket,
  UserRoundCheck,
} from "lucide-react";

import { Card } from "@/components/ui/Card";

interface StepProps {
  number: string;
  title: string;
  description: string;
}

function Step({
  number,
  title,
  description,
}: StepProps) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF] text-sm font-bold text-[#2563EB]">
        {number}
      </div>

      <h3 className="mt-5 text-base font-semibold text-[#1E293B]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#64748B]">
        {description}
      </p>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section className="bg-[#F8FAFC]">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1E293B]">
                How it works
              </h2>

              <p className="mt-2 text-sm text-[#64748B]">
                Getting a queue ticket takes only a few steps.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <Step
                number="1"
                title="Choose a service"
                description="Select the service you need from the available services."
              />

              <Step
                number="2"
                title="Get your ticket"
                description="Enter your first name and print or download your queue ticket."
              />

              <Step
                number="3"
                title="Wait for your turn"
                description="Watch the queue display and listen for your ticket number."
              />
            </div>
          </div>
        </section>
  );
}