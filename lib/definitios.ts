import { DateTime } from "next-auth/providers/kakao";

export interface User {
  id: number;
  identityDocument: number;
  names: string;
  lastnames: string;
  birthdate: Date;
  email: string;
  phoneNumber: string;
  password: string;
  state: boolean;
  role: Role;
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
  customizationOptions?: boolean;
  terrace?: boolean;
  balcony?: boolean;
  garden?: boolean;
  laundryArea?: boolean;
  shortDescription: string;
  detailedDescription: string;
  address: string;
  latitude: number;
  longitude: number;
  availableDate?: Date;
  propertyType: propertyType;
  housingType?: HousingType;
  city: City;
  membership: number;
  commonAreas: CommonArea[];
  nearbyServices: NearbyService[];
  projectMedia: ProjectMedia[];
}

export interface propertyType {
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
