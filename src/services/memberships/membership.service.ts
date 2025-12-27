import { apiClient } from "@/src/lib";
import { Membership } from "@/src/interfaces";

export interface GetMembershipsParams {
  page: number;
  pageSize: number;
  searchTerm?: string | null;
}

export interface GetMembershipsResponse {
  memberships: Membership[];
  totalEntries: number;
}

export class MembershipService {
  static async getMemberships(
    params: GetMembershipsParams,
    options?: RequestInit
  ): Promise<GetMembershipsResponse> {
    const query = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
    });

    if (params.searchTerm) {
      query.append("searchTerm", params.searchTerm);
    }

    return apiClient.get<GetMembershipsResponse>(
      `/api/memberships?${query.toString()}`,
      options
    );
  }

  static async updateMembership(membership: Membership): Promise<Membership> {
    return apiClient.put<Membership, Membership>(
      "/api/memberships",
      membership
    );
  }
}
