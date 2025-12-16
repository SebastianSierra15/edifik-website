import { apiClient } from "@/src/lib";

export interface RegisterUserInput {
  names: string;
  lastnames: string;
  birthdate: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export class AuthService {
  static async register(payload: RegisterUserInput): Promise<void> {
    await apiClient.post<void, RegisterUserInput>(
      "/api/auth/register",
      payload
    );
  }

  static async resetPassword(email: string): Promise<void> {
    await apiClient.post<void, { email: string }>("/api/auth/reset-password", {
      email,
    });
  }

  static async changePassword(payload: ChangePasswordInput): Promise<void> {
    await apiClient.put<void, ChangePasswordInput>(
      "/api/auth/reset-password",
      payload
    );
  }
}
