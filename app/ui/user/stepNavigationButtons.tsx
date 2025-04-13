interface StepNavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: (e?: React.FormEvent) => void;
  onNext: (e?: React.FormEvent) => void;
  hideConfirmation?: boolean;
}

export default function StepNavigationButtons({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  hideConfirmation = false,
}: StepNavigationButtonsProps) {
  return (
    <div className="mt-6 flex justify-between">
      {currentStep > 0 && (
        <button
          className="rounded-md bg-client-backgroundAlt px-4 py-2 text-sm text-white hover:bg-client-backgroundLight"
          onClick={(e) => onPrevious(e)}
        >
          Anterior
        </button>
      )}

      <div className="flex-grow" />
      {currentStep < totalSteps && !hideConfirmation && (
        <button
          className="rounded-md bg-client-accent px-4 py-2 text-sm text-white hover:bg-client-accentHover"
          onClick={(e) => onNext(e)}
        >
          {currentStep !== totalSteps - 1 ? "Siguiente" : "Confirmar"}
        </button>
      )}
    </div>
  );
}
