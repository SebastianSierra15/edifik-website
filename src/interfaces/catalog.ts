import type { Permission } from "./access";

export interface Role {
  id: number;
  name: string;
}

// Role que se usa en UI/listados cuando el backend devuelve permisos.
export interface RoleWithPermissions {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface RoleWrite {
  id?: number;
  name: string;
  permissions: number[];
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
