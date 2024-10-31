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
          className="bg-secondary text-sm text-white px-4 py-2 rounded-md hover:bg-secondaryLight dark:bg-secondary dark:hover:bg-secondaryLight"
          onClick={(e) => onPrevious(e)}
        >
          Anterior
        </button>
      )}
      <div className="flex-grow"></div>
      {currentStep < totalSteps && (
        <button
          className="bg-primary text-sm text-white px-4 py-2 rounded-md hover:bg-primaryLight dark:bg-primaryDark dark:hover:bg-primaryLight"
          onClick={(e) => onNext(e)}
        >
          {currentStep != totalSteps - 1 ? "Siguiente" : "Confirmar"}
        </button>
      )}
    </div>
  );
}
