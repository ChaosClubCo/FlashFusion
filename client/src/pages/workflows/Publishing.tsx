import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import { WorkflowWizard } from '@/components/workflows/WorkflowWizard';
import { useWorkflowStore } from '@/stores/workflowStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Rocket, Check } from 'lucide-react';
import { nanoid } from 'nanoid';

const STEPS = [
  { number: 1, name: 'Select Platforms' },
  { number: 2, name: 'Configuration' },
  { number: 3, name: 'Deploy' },
];

const PLATFORMS = [
  { id: 'vercel', name: 'Vercel', recommended: true },
  { id: 'netlify', name: 'Netlify' },
  { id: 'github-pages', name: 'GitHub Pages' },
  { id: 'render', name: 'Render' },
];

export default function Publishing() {
  const [, navigate] = useLocation();
  const { currentStep, stepData, updateStepData, nextStep, previousStep, startWorkflow, completeWorkflow } = useWorkflowStore();

  useEffect(() => {
    startWorkflow('publishing', STEPS.length, nanoid());
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
      <Helmet><title>One-Click Publishing - FlashFusion</title></Helmet>
      <WorkflowWizard steps={STEPS} onNext={handleNext} onBack={previousStep} backToOverview={true}>
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Select Deployment Platforms</h2>
            </div>
            {PLATFORMS.map(platform => (
              <Card key={platform.id} className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={stepData[1]?.platforms?.includes(platform.id)}
                      onCheckedChange={(checked) => {
                        const current = stepData[1]?.platforms || [];
                        updateStepData(1, {
                          platforms: checked 
                            ? [...current, platform.id]
                            : current.filter((p: string) => p !== platform.id)
                        });
                      }}
                    />
                    <CardTitle>{platform.name}</CardTitle>
                    {platform.recommended && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Recommended</span>}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
        {currentStep === 2 && (
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Deployment Configuration</h2>
            <p className="text-muted-foreground">Your settings are optimized automatically</p>
          </div>
        )}
        {currentStep === 3 && (
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold">Successfully Deployed!</h2>
          </div>
        )}
      </WorkflowWizard>
    </>
  );
}
