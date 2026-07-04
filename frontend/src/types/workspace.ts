export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  city: string;
  address: string;
  initials: string;
  totalBeds: number;
  occupiedBeds: number;
  accent: "blue" | "violet" | "emerald" | "rose";
  planId?: "monthly" | "yearly";
  createdAt: string;
}
