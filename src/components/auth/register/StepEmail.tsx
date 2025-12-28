import { ClientFormInput } from "@/src/components/shared";

interface StepEmailProps {
  email: string;
  setEmail: (value: string) => void;
  emailError: string;
}

export function StepEmail({
  email,
  setEmail,
  emailError,
}: StepEmailProps) {
  return (
    <ClientFormInput
      label="Correo electrónico"
      name="email"
      type="text"
      value={email}
      placeholder="tu-email@ejemplo.com"
      onChange={(e) => setEmail(e.target.value)}
      error={emailError}
    />
  );
}
