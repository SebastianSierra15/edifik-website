import { compare, hash } from "bcryptjs";
import { PasswordHasher } from "../domain/Password";

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return hash(password, 10);
  }

  async compare(raw: string, hashed: string): Promise<boolean> {
    return compare(raw, hashed);
  }
}
