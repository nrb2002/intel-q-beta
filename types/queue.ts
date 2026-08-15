// types/queue.ts

export type QueueStatus =
  | "WAITING"
  | "IN_SERVICE"
  | "COMPLETED"
  | "CANCELLED";

export interface QueueTicket {
  id: string;
  ticketNumber: number;
  customerName?: string;
  branchName: string;
  serviceType: string;
  status: QueueStatus;
  createdAt: string;
  calledAt?: string;
}

export interface QueueTicketInput {
  customerName?: string;
  branchId: string;
  serviceType: string;
}

export interface QueueTicketUpdate {
  status?: QueueStatus;
  calledAt?: string;
}