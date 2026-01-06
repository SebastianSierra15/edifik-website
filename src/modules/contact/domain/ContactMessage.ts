export interface ContactMessage {
  name: string;
  phone?: string;
  email: string;
  message: string;
}

export interface ContactEmailSender {
  sendContactMessage(to: string, message: ContactMessage): Promise<void>;
}
