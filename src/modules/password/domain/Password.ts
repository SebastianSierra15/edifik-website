export interface PasswordGenerator {
  generate(length?: number): string;
}

export interface PasswordHasher {
  hash(password: string): Promise<string>;
  compare(raw: string, hash: string): Promise<boolean>;
}
