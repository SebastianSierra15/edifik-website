import { Request, PendingRequest } from "./Request";

export interface GetRequestsRepository {
  getAll(params: {
    page: number;
    pageSize: number;
    searchTerm?: string | null;
  }): Promise<{ requests: Request[]; totalEntries: number }>;
}

export interface UpdateRequestStatusRepository {
  updateStatus(data: {
    id: number;
    statusId: number;
    responseMessage: string;
    reviewerId: number;
  }): Promise<void>;
}

export interface PendingRequestRepository {
  getPending(): Promise<PendingRequest[]>;
}
