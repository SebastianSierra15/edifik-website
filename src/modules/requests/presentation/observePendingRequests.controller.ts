import { ObservePendingRequests } from "../application/ObservePendingRequests";
import { MysqlPendingRequestRepository } from "../infrastructure/MysqlPendingRequestRepository";

export function observePendingRequestsController() {
  const useCase = new ObservePendingRequests(
    new MysqlPendingRequestRepository()
  );

  return {
    async fetch() {
      return useCase.getCurrent();
    },
  };
}
