import { Gender } from "@/src/interfaces";
import { UserProfile } from "./UserProfile";

export interface UserProfileRepository {
  getProfile(userId: number): Promise<{
    user: UserProfile;
    genders: Gender[];
  }>;

  updateProfile(
    userId: number,
    data: {
      identityDocument?: string;
      names?: string;
      lastnames?: string;
      birthdate?: Date | null;
      phoneNumber?: string;
      genderId?: number | null;
    }
  ): Promise<void>;
}
