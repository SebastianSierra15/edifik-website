import FormInput from "../../modals/home/formInput";
import FormDatePicker from "../../modals/home/formDatePicker";

interface Props {
  fullName: string;
  setFullName: (value: string) => void;
  fullNameError: string;
  lastName: string;
  setLastName: (value: string) => void;
  lastNameError: string;
  birthDate: string;
  setBirthDate: (value: string) => void;
  birthDateError: string;
  phone: string;
  setPhone: (value: string) => void;
  phoneError: string;
}

export default function StepPersonalData({
  fullName,
  setFullName,
  fullNameError,
  lastName,
  setLastName,
  lastNameError,
  birthDate,
  setBirthDate,
  birthDateError,
  phone,
  setPhone,
  phoneError,
}: Props) {
  return (
    <>
      <FormInput
        label="Nombres"
        name="fullName"
        placeholder="Nombres completos"
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={fullNameError}
      />

      <FormInput
        label="Apellidos"
        name="lastName"
        placeholder="Apellidos completos"
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        error={lastNameError}
      />

      <FormDatePicker
        label="Fecha de nacimiento"
        name="birthDate"
        value={birthDate ? new Date(birthDate) : null}
        onChange={(date) =>
          setBirthDate(date ? date.toISOString().split("T")[0] : "")
        }
        dateMax={
          new Date(
            new Date().getFullYear() - 18,
            new Date().getMonth(),
            new Date().getDate()
          )
        }
        dateMin={new Date(new Date().getFullYear() - 120, 0, 1)}
        error={birthDateError}
      />

      <FormInput
        label="Número de teléfono"
        name="phone"
        placeholder="312 345 6789"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={phoneError}
      />
    </>
  );
}
