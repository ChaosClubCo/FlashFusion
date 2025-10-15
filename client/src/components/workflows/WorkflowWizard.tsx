import { useWorkflowStore } from '@/stores/workflowStore';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft } from 'lucide-react';
import { Link } from 'wouter';

interface WorkflowStep {
  number: number;
  name: string;
  icon?: React.ReactNode;
}

interface WorkflowWizardProps {
  steps: WorkflowStep[];
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
  isLastStep?: boolean;
  backToOverview?: boolean;
}

export function WorkflowWizard({
  steps,
  children,
  onBack,
  onNext,
  canGoBack = true,
  canGoNext = true,
  isLastStep = false,
  backToOverview = false,
}: WorkflowWizardProps) {
  const { currentStep, isProcessing } = useWorkflowStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Progress Header */}
      <div className="border-b bg-background/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-6">
            {backToOverview ? (
              <Link href="/workflows">
                <a className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate active-elevate-2 px-3 py-1.5 rounded-md" data-testid="link-back-to-overview">
                  <ChevronLeft className="w-4 h-4" />
                  Back to Overview
                </a>
              </Link>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Workflow {currentStep} of {steps.length}
              </div>
            )}
          </div>

          {/* Progress Breadcrumbs */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              const isFuture = stepNumber > currentStep;

              return (
                <div key={stepNumber} className="flex items-center">
                  <div className="flex items-center gap-2">
                    {/* Step Circle */}
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                        isCompleted
                          ? 'bg-primary text-primary-foreground'
                          : isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                      data-testid={`step-indicator-${stepNumber}`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : step.icon ? (
                        step.icon
                      ) : (
                        <span className="text-sm font-medium">{stepNumber}</span>
                      )}
                    </div>

                    {/* Step Name */}
                    <div className="hidden md:block">
                      <div
                        className={`text-sm font-medium transition-colors ${
                          isActive
                            ? 'text-foreground'
                            : isFuture
                            ? 'text-muted-foreground'
                            : 'text-foreground'
                        }`}
                      >
                        {step.name}
                      </div>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {stepNumber < steps.length && (
                    <div
                      className={`h-px w-8 mx-2 transition-colors ${
                        isCompleted ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="container py-8">
        {children}
      </div>

      {/* Navigation Footer */}
      <div className="border-t bg-background/50 backdrop-blur-sm sticky bottom-0">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={!canGoBack || isProcessing || currentStep === 1}
              data-testid="button-wizard-back"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={onNext}
              disabled={!canGoNext || isProcessing}
              data-testid="button-wizard-next"
            >
              {isLastStep ? 'Complete' : 'Continue'}
              {isProcessing && <span className="ml-2">...</span>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
