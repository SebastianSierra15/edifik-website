import {
  FaInfoCircle,
  FaMapMarkerAlt,
  FaBuilding,
  FaListAlt,
  FaImage,
} from "react-icons/fa";

type ProgressBarProps = {
  currentStep: number;
};

const steps = [
  { icon: FaInfoCircle },
  { icon: FaMapMarkerAlt },
  { icon: FaBuilding },
  { icon: FaListAlt },
  { icon: FaImage },
];

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="flex justify-center items-center w-full max-w-xl mx-auto">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isLastStep = index === steps.length - 1;
        const isActive = currentStep >= index;

        return (
          <div
            key={index}
            className={`flex items-center ${isLastStep ? "" : "flex-1"}`}
          >
            {/* Icono dentro del círculo */}
            <div
              className={`w-12 h-12 z-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isActive
                  ? "bg-primary text-white dark:bg-primaryLight"
                  : "bg-backgroundDark text-textSecondary dark:bg-backgroundLight dark:text-textPlaceholder"
              }`}
            >
              <Icon size={25} />
            </div>

            {/* Línea de separación, solo si no es el último paso */}
            {!isLastStep && (
              <div
                className={`h-1 transition-colors duration-300 ${
                  currentStep > index
                    ? "bg-primary dark:bg-primaryLight"
                    : "bg-backgroundDark dark:bg-backgroundLight"
                }`}
                style={{
                  width: "calc(100% - 2.25rem)",
                  marginLeft: "-4px",
                }}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
