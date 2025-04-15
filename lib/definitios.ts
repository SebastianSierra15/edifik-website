import { DateTime } from "next-auth/providers/kakao";

export type ColumnType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "array"
  | "status";

export interface Header<T> {
  label: string;
  key: keyof T | string;
  type: ColumnType;
  subKey?: string;
  statusMapping?: Record<string, { label: string; className: string }>;
}

export interface User {
  id: number;
  identityDocument?: string;
  names?: string;
  lastnames?: string;
  birthdate?: Date;
  email: string;
  phoneNumber?: string;
  gender?: Gender;
  password?: string;
  state?: boolean;
  registrationDate?: DateTime;
  lastLogin?: DateTime;
  role: Role;
  membership: MembershipSummary;
  provider: string;
  totalProperties?: number;
}

export interface Gender {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  permissions?: Permission[];
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
  price?: number;
  totalArea: number;
  builtArea: number;
  freeHeight?: number;
  width?: number;
  length?: number;
  parkingSpots?: number;
  elevator?: boolean;
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
  ownerId?: number;
  email?: string;
  residentialProjectId?: number;
  warehouseProjectId?: number;
  nearbyServices: NearbyService[];
  projectMedia: ProjectMedia[];
  media?: Media[];
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
  type?: string;
}

export interface Media {
  id?: string;
  tag: string;
  file: File | string;
  description?: string;
  idType: number;
  type: string;
  category: string;
}

export interface Request {
  id: number;
  date: Date;
  operation: string;
  responseMessage?: string;
  userId: number;
  userEmail: string;
  statusRequestName: string;
  projectId: number;
  projectName: string;
}

export interface ProjectView {
  id: number;
  name: string;
  cityName: string;
  price?: number;
  area?: number;
  bathrooms?: number;
  parkingSpots?: number;
  bedrooms?: number;
  longitude?: number;
  latitude?: number;
  images: ProjectMedia[];
}

export type ProjectData = Partial<Project>;
export type UserData = Partial<User>;

export type ProjectSummary = Pick<
  Project,
  | "id"
  | "name"
  | "price"
  | "totalArea"
  | "bedrooms"
  | "bathrooms"
  | "parkingSpots"
  | "address"
  | "longitude"
  | "latitude"
  | "city"
  | "projectMedia"
  | "email"
>;

export type MembershipSummary = Pick<Membership, "id" | "name">;

export type ProjectMediaData = Partial<ProjectMedia>;
