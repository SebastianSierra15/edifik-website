import { Role, Membership, Gender } from "./catalog";

export interface User {
  id: number;
  names: string;
  lastnames: string;
  email: string;
  phoneNumber: string | null;
  state: boolean;
  registrationDate: Date;
  lastLogin: Date | null;
  totalProperties: number;
  provider: string;
  gender: Gender;
  role: Role;
  membership: Membership;
}

/**
 * Usado en búsquedas, selects, autocompletados
 */
export interface UserEmail {
  id: number;
  email: string;
}

/**
 * Resultado de verificación de email
 */
export interface UserEmailCheckResult {
  id: number | null;
}
