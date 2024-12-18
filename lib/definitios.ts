import { DateTime } from "next-auth/providers/kakao";

export type ColumnType = "string" | "number" | "boolean" | "date";

export interface Header<T> {
  label: string;
  key: keyof T;
  type: ColumnType;
}

export interface User {
  id: number;
  username: string;
  identityDocument?: number;
  names?: string;
  lastnames?: string;
  birthdate?: Date;
  email: string;
  phoneNumber?: string;
  gender?: string;
  password?: string;
  state?: boolean;
  registrationDate?: DateTime;
  lastLogin?: DateTime;
  roleId: number;
  roleName: string;
  membershipId: number;
  membershipName?: string;
  provider: string;
}

export interface Gender {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface CommonArea {
  id: number;
  name: string;
}

export interface HousingType {
  id: number;
  name: string;
}

export interface NearbyService {
  id: number;
  name: string;
}

export interface Departament {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  departament: Departament;
}

export interface PaymentMethod {
  id: number;
  name: string;
  state: boolean;
}

export interface Project {
  id: number;
  name: string;
  state: boolean;
  price: number;
  totalArea: number;
  builtArea: number;
  freeHeight?: number;
  width?: number;
  length?: number;
  parkingSpots?: number;
  elevators?: number;
  heavyParking?: number;
  availableUnits: number;
  bathrooms?: number;
  bedrooms?: number;
  lobbies?: number;
  towers?: number;
  storageUnits?: number;
  socioeconomicLevel?: number;
  floorNumber?: number;
  yearBuilt?: number;
  customizationOptions?: boolean;
  terrace?: boolean;
  balcony?: boolean;
  garden?: boolean;
  laundryArea?: boolean;
  complexName?: string;
  shortDescription: string;
  detailedDescription: string;
  address: string;
  latitude: number;
  longitude: number;
  availableDate?: Date;
  projectType?: projectType;
  statusProject?: statusProject;
  propertyType: propertyType;
  housingType?: HousingType;
  city: City;
  membership: number;
  commonAreas: CommonArea[];
  user?: User;
  nearbyServices: NearbyService[];
  projectMedia: ProjectMedia[];
}

export interface projectType {
  id: number;
  name: string;
}

export interface propertyType {
  id: number;
  name: string;
}

export interface statusProject {
  id: number;
  name: string;
}

export interface Membership {
  id: number;
  name: string;
  benefits: string;
  price: number;
  discountThreeMonths: number;
  discountSixMonths: number;
  discountTwelveMonths: number;
  maxProjects: number;
  projectsFeatured: number;
}

export interface Reservation {
  id: number;
  startDate: Date;
  endDate: Date;
  reservationDate: Date;
  price: number;
  userId: number;
  paymentMethodId: number;
  projectId: number;
  statusReservationId: number;
}

export interface StatusReservation {
  id: number;
  name: string;
}

export interface Permission {
  id: number;
  name: string;
}

export interface ImageType {
  id: number;
  name: string;
  description?: string;
  maxImagesAllowed: number;
  isRequired: boolean;
}

export interface ProjectMedia {
  id?: number;
  url: string;
  tag: string;
  description?: string;
  projectId: number;
  commonArea?: number;
  imageType?: number;
}

export interface Media {
  tag: string;
  file: File;
  description?: string;
  idType: number;
  type: string;
  category: string;
}

export type ProjectData = Partial<Project>;
export type UserData = Partial<User>;

export type ProjectSummary = Pick<
  Project,
  | "id"
  | "name"
  | "price"
  | "totalArea"
  | "address"
  | "longitude"
  | "latitude"
  | "city"
  | "projectMedia"
>;

export type MembershipSummary = Pick<Membership, "id" | "name">;

export type ProjectMediaData = Partial<ProjectMedia>;
