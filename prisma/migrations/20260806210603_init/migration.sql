-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('customer', 'staff', 'admin');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('Waiting', 'In Service', 'Completed', 'Cancelled');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'customer',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branches" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "queue_tickets" (
    "id" UUID NOT NULL,
    "ticket_number" INTEGER NOT NULL,
    "customer_id" UUID NOT NULL,
    "branch_id" UUID NOT NULL,
    "service_type" TEXT NOT NULL,
    "status" "QueueStatus" NOT NULL DEFAULT 'Waiting',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "called_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "queue_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "branches_name_idx" ON "branches"("name");

-- CreateIndex
CREATE INDEX "queue_tickets_ticket_number_idx" ON "queue_tickets"("ticket_number");

-- CreateIndex
CREATE INDEX "queue_tickets_customer_id_idx" ON "queue_tickets"("customer_id");

-- CreateIndex
CREATE INDEX "queue_tickets_branch_id_idx" ON "queue_tickets"("branch_id");

-- CreateIndex
CREATE INDEX "queue_tickets_status_idx" ON "queue_tickets"("status");

-- CreateIndex
CREATE INDEX "queue_tickets_branch_id_status_idx" ON "queue_tickets"("branch_id", "status");

-- AddForeignKey
ALTER TABLE "queue_tickets" ADD CONSTRAINT "queue_tickets_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "queue_tickets" ADD CONSTRAINT "queue_tickets_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
