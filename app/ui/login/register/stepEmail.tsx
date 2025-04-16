import FormInput from "../../modals/home/formInput";

interface Props {
  email: string;
  setEmail: (value: string) => void;
  emailError: string;
}

export default function StepEmail({ email, setEmail, emailError }: Props) {
  return (
    <FormInput
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
