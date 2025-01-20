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
    <div className="mx-auto flex w-full max-w-xl items-center justify-center">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isLastStep = index === steps.length - 1;
        const isActive = currentStep >= index;

        return (
          <div
            key={index}
            className={`flex items-center ${isLastStep ? "" : "flex-1"}`}
          >
            <div
              className={`z-10 flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-300 ${
                isActive
                  ? "bg-premium-primary text-white dark:bg-premium-primaryLight"
                  : "bg-premium-backgroundDark text-premium-textSecondary dark:bg-premium-backgroundLight dark:text-premium-textPlaceholder"
              }`}
            >
              <Icon size={25} />
            </div>

            {!isLastStep && (
              <div
                className={`h-1 transition-colors duration-300 ${
                  currentStep > index
                    ? "bg-premium-borderColor dark:bg-premium-borderColorHover"
                    : "bg-premium-backgroundDark dark:bg-premium-backgroundLight"
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
