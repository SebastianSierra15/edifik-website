export interface Role {
  id: number;
  name: string;
}

export interface Gender {
  id: number;
  name: string;
}

export interface MembershipSummary {
  id: number;
  name: string;
}

export interface Membership {
  id: number;
  name: string;
  benefits: string;
  price: number;
  discountThreeMonths?: number | null;
  discountSixMonths?: number | null;
  discountTwelveMonths?: number | null;
  maxProjects: number;
  projectsFeatured?: number | null;
}

export interface RoleWrite {
  id?: number;
  name: string;
  permissions: number[];
}
