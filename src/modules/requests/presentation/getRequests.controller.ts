import { GetRequests } from "../application/GetRequests";
import type { Request } from "../domain/Request";
import { MysqlGetRequestsRepository } from "../infrastructure/MysqlGetRequestsRepository";

type RequestResponse = Omit<Request, "operation"> & {
  operation: "agregar" | "editar";
};

export async function getRequestsController(params: {
  page: number;
  pageSize: number;
  searchTerm?: string | null;
}) {
  const useCase = new GetRequests(new MysqlGetRequestsRepository());
  const result = await useCase.execute(params);

  const requests: RequestResponse[] = result.requests.map((request) => ({
    ...request,
    operation: request.operation ? "agregar" : "editar",
  }));

  return {
    ...result,
    requests,
  };
}
