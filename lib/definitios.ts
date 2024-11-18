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

export interface Property {
  id: number;
  name: string;
  state: boolean;
  price: number;
  totalArea: number;
  builtArea: number;
  bathrooms: number;
  rooms: number;
  lobbies: number;
  shortDescription: string;
  detailedDescription: string | null;
  address: string;
  latitude: number;
  longitude: number;
  availabeDate: Date | null;
  isCompanyOwned: boolean;
  category: Category;
  propertyType: PropertyType;
  housingType: HousingType;
  city: City;
  membership: number;
  commonAreas: CommonArea[];
  nearbyService: NearbyService[];
  propertyMedia: PropertyMedia[];
}

export interface PropertyType {
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
  maxProperties: number;
  maxImagesProperty: number;
  propertiesFeatured: number;
}

export interface Reservation {
  id: number;
  startDate: Date;
  endDate: Date;
  reservationDate: Date;
  price: number;
  userId: number;
  paymentMethodId: number;
  propertyId: number;
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
  description: string;
  maxImagesAllowed: number;
  isRequired: boolean;
}

export interface PropertyMedia {
  id: number;
  url: string;
  tag: string;
  propertyId: number;
  commonArea: number | null;
  imageType: number | null;
}

export type PropertyData = Partial<Property>;

export type PropertySummary = Pick<
  Property,
  | "id"
  | "name"
  | "price"
  | "totalArea"
  | "address"
  | "longitude"
  | "latitude"
  | "city"
  | "membership"
>;

export type MembershipSummary = Pick<Membership, "id" | "name">;

export type PropertyMediaData = Partial<PropertyMedia>;
