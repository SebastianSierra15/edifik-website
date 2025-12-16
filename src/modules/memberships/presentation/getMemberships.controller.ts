import { GetMemberships } from "../application/GetMemberships";
import { MysqlGetMembershipsRepository } from "../infrastructure/MysqlGetMembershipsRepository";

export async function getMembershipsController(params: {
  page: number;
  pageSize: number;
  searchTerm?: string | null;
}) {
  return new GetMemberships(new MysqlGetMembershipsRepository()).execute(
    params
  );
}
