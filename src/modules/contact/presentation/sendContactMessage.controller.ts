import { SendContactMessage } from "../application/SendContactMessage";
import { NodemailerContactEmailSender } from "../infrastructure/NodemailerContactEmailSender";

export async function sendContactMessageController(input: {
  toEmail: string;
  name: string;
  phone?: string;
  email: string;
  message: string;
}) {
  const useCase = new SendContactMessage(new NodemailerContactEmailSender());

  return useCase.execute({
    toEmail: input.toEmail,
    message: {
      name: input.name,
      phone: input.phone,
      email: input.email,
      message: input.message,
    },
  });
}
