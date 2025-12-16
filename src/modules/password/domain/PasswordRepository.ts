export interface PasswordRepository {
  setTemporaryPassword(email: string, passwordHash: string): Promise<void>;
  getUserPasswordHash(userId: number): Promise<string>;
  changePassword(userId: number, passwordHash: string): Promise<void>;
}
