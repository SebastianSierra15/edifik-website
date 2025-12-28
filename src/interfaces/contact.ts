export interface ContactFormInput {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export interface ContactMessagePayload extends ContactFormInput {
  toEmail?: string;
}
