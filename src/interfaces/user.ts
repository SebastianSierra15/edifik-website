import { Role, MembershipSummary, Gender } from "./catalog";

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
  membership: MembershipSummary;
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

export interface UserWrite {
  id?: number; // requerido solo en edición
  names: string;
  lastnames: string;
  email: string;
  phoneNumber: string | null;
  genderId: number;
  roleId: number;
  membershipId: number;
  state: boolean;
}
