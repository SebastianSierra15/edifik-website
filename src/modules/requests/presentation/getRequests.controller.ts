import { GetRequests } from "../application/GetRequests";
import { MysqlGetRequestsRepository } from "../infrastructure/MysqlGetRequestsRepository";

export async function getRequestsController(params: {
  page: number;
  pageSize: number;
  searchTerm?: string | null;
}) {
  const useCase = new GetRequests(new MysqlGetRequestsRepository());
  return useCase.execute(params);
}
