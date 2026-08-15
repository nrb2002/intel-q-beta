import { DashboardCard } from "./DashboardCard";


const recentTickets = [
  {
    number: "A101",
    branch: "Main Branch",
    date: "Today",
  },
  {
    number: "A098",
    branch: "Downtown Branch",
    date: "Yesterday",
  },
];


export function RecentTickets(){

  return (

    <DashboardCard
      title="Recent Tickets"
      description="Your recent queue activity"
    >

      <div className="space-y-3">

        {recentTickets.map(ticket => (

          <div
            key={ticket.number}
            className="
              flex
              justify-between
              border-b
              border-[#E2E8F0]
              pb-3
            "
          >

            <div>

              <p className="font-medium">
                {ticket.number}
              </p>

              <p className="
                text-sm
                text-[#64748B]
              ">
                {ticket.branch}
              </p>

            </div>


            <span className="
              text-sm
              text-[#64748B]
            ">
              {ticket.date}
            </span>


          </div>

        ))}

      </div>

    </DashboardCard>

  );
}