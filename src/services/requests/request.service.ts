import { apiClient } from "@/src/lib";
import { Request } from "@/src/interfaces";

export interface GetRequestsParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
}

export interface GetRequestsResponse {
  requests: Request[];
  totalEntries: number;
}

export interface ProcessRequestPayload {
  id: number;
  statusId: number;
  responseMessage: string;
  userEmail: string;
}

export class RequestService {
  static async getRequests(
    params: GetRequestsParams
  ): Promise<GetRequestsResponse> {
    const query = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.searchTerm ? { searchTerm: params.searchTerm } : {}),
    });

    return apiClient.get<GetRequestsResponse>(
      `/api/requests?${query.toString()}`
    );
  }

  static async processRequest(payload: ProcessRequestPayload): Promise<void> {
    await apiClient.put<void, ProcessRequestPayload>("/api/requests", payload);
  }
}
