import { apiClient } from "@/src/lib";
import { UserProfileResponse } from "@/src/interfaces";

export class UserProfileService {
  static async getProfile(): Promise<UserProfileResponse> {
    return apiClient.get<UserProfileResponse>("/api/user/profile");
  }

  static async updateProfile(data: {
    identityDocument?: string;
    names?: string;
    lastnames?: string;
    birthdate?: Date | null;
    phoneNumber?: string;
    genderId?: number | null;
  }): Promise<void> {
    await apiClient.put<void, typeof data>("/api/user/profile", data);
  }
}
