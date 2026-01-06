import clsx from "clsx";
import { ClipboardList, MapPin, Building2, List, Images } from "lucide-react";

type ProgressBarProps = {
  currentStep: number;
};

const steps = [
  { icon: ClipboardList, title: "Datos básicos" },
  { icon: MapPin, title: "Ubicación" },
  { icon: Building2, title: "Características" },
  { icon: List, title: "Resumen" },
  { icon: Images, title: "Imágenes" },
];

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl items-center justify-center">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isLastStep = index === steps.length - 1;
        const isActive = currentStep >= index;

        return (
          <div
            key={index}
            className={clsx("flex items-center", !isLastStep && "flex-1")}
          >
            <div
              className={clsx(
                "z-10 flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-300",
                isActive
                  ? "bg-client-accent text-white"
                  : "bg-client-background text-client-secondary"
              )}
            >
              <div title={step.title}>
                <Icon size={25} />
              </div>
            </div>

            {!isLastStep && (
              <div
                className={clsx(
                  "h-1 transition-colors duration-300",
                  currentStep > index
                    ? "bg-client-accent"
                    : "bg-client-background"
                )}
                style={{
                  width: "calc(100% - 2.25rem)",
                  marginLeft: "-4px",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
