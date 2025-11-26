import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  const { t } = useTranslation('pricing');
  
  const steps = [
    { number: 1, label: t('steps.plan') },
    { number: 2, label: t('steps.customize') },
    { number: 3, label: t('steps.account') },
    { number: 4, label: t('steps.review') },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-border -z-10">
          <div 
            className="h-full bg-secondary transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          
          return (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-secondary text-white'
                    : isCurrent
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : step.number}
              </div>
              <div
                className={`mt-2 text-xs font-medium text-center ${
                  isCurrent ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};