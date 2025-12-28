import { ClientFormInput } from "@/src/components/shared";

interface StepPasswordProps {
  password: string;
  setPassword: (value: string) => void;
  passwordError: string;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  confirmPasswordError: string;
}

export function StepPassword({
  password,
  setPassword,
  passwordError,
  confirmPassword,
  setConfirmPassword,
  confirmPasswordError,
}: StepPasswordProps) {
  return (
    <>
      <ClientFormInput
        label="Contraseña"
        name="password"
        placeholder="••••••••"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={passwordError}
      />

      <ClientFormInput
        label="Confirmar contraseña"
        name="confirmPassword"
        placeholder="••••••••"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={confirmPasswordError}
      />
    </>
  );
}
