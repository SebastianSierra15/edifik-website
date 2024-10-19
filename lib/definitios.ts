import { DateTime } from "next-auth/providers/kakao";

export type User = {
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
};

export type Role = {
  id: number;
  name: string;
};

export type Category = {
  id: number;
  name: string;
};

export type CommonArea = {
  id: number;
  name: string;
};

export type HousingType = {
  id: number;
  name: string;
};

export type NearbyService = {
  id: number;
  name: string;
};

export type Departament = {
  id: number;
  name: string;
};

export type PaymentMethod = {
  id: number;
  name: string;
  state: boolean;
};

export type City = {
  id: number;
  name: string;
  departament: Departament;
};

export type Property = {
  id: number;
  name: string;
  state: boolean;
  price: number;
  area: number;
  bathrooms: number;
  rooms: number;
  lobbies: number;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  availabeDate: Date | null;
  category: Category;
  propertyType: PropertyType;
  housingType: HousingType;
  city: City;
  membership: number;
  commonAreas: CommonArea[];
  nearbyService: NearbyService[];
};

export type PropertySummary = Pick<Property, "id" | "name" | "price" | "area" | "address" | "longitude" | "latitude" | "city" | "membership">

export type PropertyType = {
  id: number;
  name: string;
};

export type Membership = {
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

export type MembershipSummary = Pick<Membership, "id" | "name">

export type Reservation = {
  id: number;
  startDate: Date;
  endDate: Date;
  reservationDate: Date;
  price: number;
  userId: number;
  paymentMethodId: number;
  propertyId: number;
  statusReservationId: number;
};

export type StatusReservation = {
  id: number;
  name: string;
};

export type Permission = {
  id: number;
  name: string;
};
