import { Gender } from "@/src/interfaces";

export interface UserProfile {
  id: number;
  identityDocument?: string;
  names?: string;
  lastnames?: string;
  birthdate?: Date;
  email: string;
  phoneNumber?: string;
  gender?: Gender;
  provider: string;
}
