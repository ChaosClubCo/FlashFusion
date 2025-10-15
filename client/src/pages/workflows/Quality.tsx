import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import { WorkflowWizard } from '@/components/workflows/WorkflowWizard';
import { useWorkflowStore } from '@/stores/workflowStore';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Check } from 'lucide-react';
import { nanoid } from 'nanoid';

const STEPS = [
  { number: 1, name: 'Run Checks' },
  { number: 2, name: 'Configure' },
  { number: 3, name: 'Results' },
];

export default function Quality() {
  const [, navigate] = useLocation();
  const { currentStep, nextStep, previousStep, startWorkflow, completeWorkflow } = useWorkflowStore();

  useEffect(() => {
    startWorkflow('quality', STEPS.length, nanoid());
  }, []);

  const handleNext = () => {
    if (currentStep === 3) {
      completeWorkflow();
      navigate('/workflows');
    } else {
      nextStep();
    }
  };

  return (
    <>
      <Helmet><title>Quality Assurance - FlashFusion</title></Helmet>
      <WorkflowWizard steps={STEPS} onNext={handleNext} onBack={previousStep} backToOverview={true}>
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Quality Assurance</h2>
            </div>
            <Card className="hover-elevate">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-teal-500" />
                  <CardTitle>Code Quality Analysis</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </div>
        )}
        {currentStep === 2 && (
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Quality Standards Configuration</h2>
          </div>
        )}
        {currentStep === 3 && (
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold">Quality Assurance Complete!</h2>
            <p className="text-muted-foreground">Overall Quality Score: 100%</p>
          </div>
        )}
      </WorkflowWizard>
    </>
  );
}
