import {
  User,
  UserEmail,
  UserEmailCheckResult,
  ProjectSummary,
} from "@/src/interfaces";
import { UsersMetadata } from "./User";
import { UpdateUserInput } from "./UpdateUserInput";
import { CreateUserInput } from "./CreateUserInput";

export interface UserRepository {
  findPaginated(params: {
    page: number;
    pageSize: number;
    searchTerm: string | null;
  }): Promise<{
    users: User[];
    totalEntries: number;
  }>;

  create(input: CreateUserInput): Promise<void>;

  update(input: UpdateUserInput): Promise<void>;
}

export interface UserMetadataRepository {
  getMetadata(): Promise<UsersMetadata>;
}

export interface UserEmailRepository {
  searchByEmail(term: string): Promise<UserEmail[]>;
}

export interface UserEmailCheckerRepository {
  check(email: string): Promise<UserEmailCheckResult>;
}

export interface GetUsersProjectsParams {
  userId: number;
  page: number;
  pageSize: number;
}

export interface GetUsersProjectsResult {
  projects: ProjectSummary[];
  totalEntries: number;
}

export interface UsersProjectsRepository {
  getProjectsByUser(
    params: GetUsersProjectsParams
  ): Promise<GetUsersProjectsResult>;
}
