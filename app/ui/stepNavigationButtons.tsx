"use client";

interface StepNavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: (e?: React.FormEvent) => void;
  onNext: (e?: React.FormEvent) => void;
}

export default function StepNavigationButtons({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
}: StepNavigationButtonsProps) {
  return (
    <div className="mt-6 flex justify-between">
      {currentStep > 0 && (
        <button
          className="bg-premium-secondary text-sm text-white px-4 py-2 rounded-md hover:bg-premium-secondaryLight dark:bg-premium-secondary dark:hover:bg-premium-secondaryLight"
          onClick={(e) => onPrevious(e)}
        >
          Anterior
        </button>
      )}
      <div className="flex-grow"></div>
      {currentStep < totalSteps && (
        <button
          className="bg-premium-primary text-sm text-white px-4 py-2 rounded-md hover:bg-premium-primaryLight dark:bg-premium-primaryDark dark:hover:bg-premium-primaryLight"
          onClick={(e) => onNext(e)}
        >
          {currentStep != totalSteps - 1 ? "Siguiente" : "Confirmar"}
        </button>
      )}
    </div>
  );
}
