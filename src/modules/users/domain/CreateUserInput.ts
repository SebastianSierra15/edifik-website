export interface CreateUserInput {
  names: string;
  lastnames: string;
  email: string;
  phoneNumber?: string | null;
  genderId: number;
  roleId: number;
  membershipId?: string;
  state: boolean;
  createdBy: string;
}
