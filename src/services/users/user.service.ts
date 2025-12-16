import { apiClient } from "@/src/lib";
import {
  UserEmailCheckResult,
  UserEmail,
  Role,
  Gender,
  MembershipSummary,
  User,
  UserWrite,
  ProjectSummary,
} from "@/src/interfaces";

export interface UsersMetadata {
  roles: Role[];
  genders: Gender[];
  memberships: MembershipSummary[];
}

export interface GetUsersParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
}

export interface GetUsersResponse {
  users: User[];
  totalEntries: number;
}

export interface GetUserProjectsParams {
  userId: number;
  page: number;
  pageSize: number;
  searchTerm?: string;
}

export interface GetUserProjectsResponse {
  projects: ProjectSummary[];
  totalEntries: number;
}

export class UserService {
  static async checkEmail(email: string): Promise<UserEmailCheckResult> {
    const encodedEmail = encodeURIComponent(email);
    return apiClient.get<UserEmailCheckResult>(
      `/api/users/check-email?email=${encodedEmail}`
    );
  }

  static async searchEmails(searchTerm: string): Promise<UserEmail[]> {
    const encodedTerm = encodeURIComponent(searchTerm);
    return apiClient.get<UserEmail[]>(
      `/api/users/emails?searchTerm=${encodedTerm}`
    );
  }

  static async getUsersMetadata(): Promise<UsersMetadata> {
    return apiClient.get<UsersMetadata>("/api/users/metadata");
  }

  static async getUsers(params: GetUsersParams): Promise<GetUsersResponse> {
    const query = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.searchTerm ? { searchTerm: params.searchTerm } : {}),
    });

    return apiClient.get<GetUsersResponse>(`/api/users?${query.toString()}`);
  }

  static async createUser(payload: UserWrite): Promise<void> {
    await apiClient.post<void, UserWrite>("/api/users", payload);
  }

  static async updateUser(payload: UserWrite): Promise<void> {
    await apiClient.put<void, UserWrite>("/api/users", payload);
  }

  static async getUserProjects(
    params: GetUserProjectsParams
  ): Promise<GetUserProjectsResponse> {
    const query = new URLSearchParams({
      userId: params.userId.toString(),
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.searchTerm ? { searchTerm: params.searchTerm } : {}),
    });

    return apiClient.get<GetUserProjectsResponse>(
      `/api/users/projects?${query.toString()}`
    );
  }
}
