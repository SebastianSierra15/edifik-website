import { Gender } from "./catalog";

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

export interface UserProfileResponse {
  user: UserProfile;
  genders: Gender[];
}
