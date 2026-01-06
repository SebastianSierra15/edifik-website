export interface RegisterUserRepository {
  register(data: {
    names: string;
    lastnames: string;
    birthdate: string;
    email: string;
    phoneNumber: string;
    passwordHash: string;
  }): Promise<void>;
}
