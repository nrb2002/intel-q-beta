// types/user.ts

export type UserRole =
  | "CUSTOMER"
  | "STAFF"
  | "ADMIN";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}