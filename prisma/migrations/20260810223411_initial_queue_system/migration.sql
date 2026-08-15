/*
  Warnings:

  - A unique constraint covering the columns `[branch_id,ticket_number]` on the table `queue_tickets` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "queue_tickets_ticket_number_idx";

-- CreateIndex
CREATE UNIQUE INDEX "queue_tickets_branch_id_ticket_number_key" ON "queue_tickets"("branch_id", "ticket_number");
