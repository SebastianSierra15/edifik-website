import { apiClient } from "@/src/lib";
import type { ContactMessagePayload } from "@/src/interfaces";

export class ContactService {
  static async sendContactMessage(
    payload: ContactMessagePayload
  ): Promise<void> {
    await apiClient.post<void, ContactMessagePayload>("/api/contact", payload);
  }
}
