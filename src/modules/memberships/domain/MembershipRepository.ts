import { Membership } from "@/src/interfaces";

export interface GetMembershipsRepository {
  getAll(params: {
    page: number;
    pageSize: number;
    searchTerm?: string | null;
  }): Promise<{ memberships: Membership[]; totalEntries: number }>;
}

export interface UpdateMembershipRepository {
  update(data: {
    id: number;
    name: string;
    benefits: string;
    price: number;
    discountThreeMonths?: number | null;
    discountSixMonths?: number | null;
    discountTwelveMonths?: number | null;
    maxProjects: number;
    projectsFeatured?: number | null;
    updatedBy: number;
  }): Promise<void>;
}
