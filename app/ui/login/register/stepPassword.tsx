import FormInput from "../../modals/home/formInput";

interface Props {
  password: string;
  setPassword: (value: string) => void;
  passwordError: string;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  confirmPasswordError: string;
}

export default function StepPassword({
  password,
  setPassword,
  passwordError,
  confirmPassword,
  setConfirmPassword,
  confirmPasswordError,
}: Props) {
  return (
    <>
      <FormInput
        label="Contraseña"
        name="password"
        placeholder="••••••••"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={passwordError}
      />

      <FormInput
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
