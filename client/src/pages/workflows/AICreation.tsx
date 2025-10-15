import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import { WorkflowWizard } from '@/components/workflows/WorkflowWizard';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useCreateWorkflow, useUpdateWorkflow } from '@/hooks/useWorkflowAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Code2, FileImage, MessageSquare, Palette, Sparkles } from 'lucide-react';
import { nanoid } from 'nanoid';

const STEPS = [
  { number: 1, name: 'Select Type', icon: <Sparkles className="w-4 h-4" /> },
  { number: 2, name: 'Configure', icon: <Code2 className="w-4 h-4" /> },
  { number: 3, name: 'Generate', icon: <Sparkles className="w-4 h-4" /> },
  { number: 4, name: 'Complete', icon: <Sparkles className="w-4 h-4" /> },
];

const CREATION_TYPES = [
  {
    id: 'full-stack-app',
    icon: Code2,
    title: 'Full-Stack Application',
    description: 'Complete web application with frontend, backend, and database',
    estimatedTime: '2-3 minutes',
  },
  {
    id: 'content-marketing',
    icon: MessageSquare,
    title: 'Content Marketing Suite',
    description: 'Blog posts, social media content, and marketing materials',
    estimatedTime: '30 seconds-2 minutes',
  },
  {
    id: 'visual-assets',
    icon: Palette,
    title: 'Visual Assets & Branding',
    description: 'Logos, images, brand kits, and visual identity',
    estimatedTime: '1-2 minutes',
  },
  {
    id: 'code-components',
    icon: FileImage,
    title: 'Code Components & APIs',
    description: 'Reusable components, API endpoints, and integrations',
    estimatedTime: '1-2 minutes',
  },
];

export default function AICreation() {
  const [, navigate] = useLocation();
  const { currentStep, stepData, updateStepData, nextStep, previousStep, startWorkflow, completeWorkflow, setProcessing, currentWorkflowId, setWorkflowId } = useWorkflowStore();
  const [progress, setProgress] = useState(0);
  const createWorkflow = useCreateWorkflow();
  const updateWorkflow = useUpdateWorkflow();

  useEffect(() => {
    // Initialize workflow - will update ID from server response
    startWorkflow('ai-creation', STEPS.length, '');
    
    // Create workflow in database and update with server-generated ID
    console.log('[AICreation] Creating workflow via API...');
    createWorkflow.mutate({
      userId: 'demo-user-1',
      workflowType: 'ai-creation',
      totalSteps: STEPS.length,
    }, {
      onSuccess: (serverWorkflow) => {
        console.log('[AICreation] Workflow created with ID:', serverWorkflow.id);
        // Update store with server-generated workflow ID
        setWorkflowId(serverWorkflow.id);
      },
      onError: (error) => {
        console.error('[AICreation] Failed to create workflow:', error);
      },
    });
  }, []);

  useEffect(() => {
    // Auto-start generation simulation when we reach step 3
    if (currentStep === 3) {
      setProcessing(true);
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setProcessing(false);
            nextStep();
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Cleanup interval on unmount or step change
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const handleNext = async () => {
    if (currentStep === 4) {
      // Mark workflow as completed
      if (currentWorkflowId) {
        console.log('[AICreation] Completing workflow:', currentWorkflowId);
        await updateWorkflow.mutateAsync({
          id: currentWorkflowId,
          data: {
            status: 'completed',
            currentStep: 4,
          },
        });
      }
      completeWorkflow();
      navigate('/workflows');
    } else {
      // Update step progress in database
      if (currentWorkflowId) {
        console.log('[AICreation] Updating workflow step:', currentWorkflowId, 'to step', currentStep + 1);
        await updateWorkflow.mutateAsync({
          id: currentWorkflowId,
          data: {
            currentStep: currentStep + 1,
          },
        });
      }
      nextStep();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      previousStep();
    }
  };

  const canGoNext = () => {
    if (currentStep === 1) return !!stepData[1]?.creationType;
    if (currentStep === 2) return !!stepData[2]?.description;
    return true;
  };

  return (
    <>
      <Helmet>
        <title>AI-Powered Creation - FlashFusion</title>
      </Helmet>

      <WorkflowWizard
        steps={STEPS}
        onNext={handleNext}
        onBack={handleBack}
        canGoNext={canGoNext()}
        isLastStep={currentStep === 4}
        backToOverview={true}
      >
        {/* Step 1: Select Creation Type */}
        {currentStep === 1 && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">AI-Powered Creation</h2>
              <p className="text-muted-foreground">
                Generate stunning content, code, and creative assets in seconds with advanced AI models
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CREATION_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = stepData[1]?.creationType === type.id;

                return (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all hover-elevate active-elevate-2 ${
                      isSelected ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => updateStepData(1, { creationType: type.id })}
                    data-testid={`card-creation-type-${type.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{type.title}</CardTitle>
                          <CardDescription>{type.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Estimated Time: {type.estimatedTime}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Configure Your Creation */}
        {currentStep === 2 && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Configure Your Creation</h2>
              <p className="text-muted-foreground">
                Customize the AI generation for your specific needs
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Creation Details</CardTitle>
                <CardDescription>Describe what you want to create</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description">Describe what you want to create</Label>
                  <Textarea
                    id="description"
                    placeholder="E.g., A modern React app for task management with real-time collaboration..."
                    value={stepData[2]?.description || ''}
                    onChange={(e) => updateStepData(2, { description: e.target.value })}
                    className="min-h-32"
                    data-testid="input-creation-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label>AI Model</Label>
                  <Select
                    value={stepData[2]?.model || 'claude-sonnet'}
                    onValueChange={(value) => updateStepData(2, { model: value })}
                  >
                    <SelectTrigger data-testid="select-ai-model">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claude-sonnet">Claude 4.5 Sonnet (Fastest)</SelectItem>
                      <SelectItem value="gpt-4">GPT-4 Turbo</SelectItem>
                      <SelectItem value="claude-opus">Claude 4 Opus (Best Quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Generate */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <Sparkles className="w-16 h-16 mx-auto text-primary animate-pulse" />
              <h2 className="text-3xl font-bold">Generating Your Creation</h2>
              <p className="text-muted-foreground">
                AI is crafting your {CREATION_TYPES.find(t => t.id === stepData[1]?.creationType)?.title.toLowerCase()}...
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Progress value={progress} className="mb-4" />
                <p className="text-sm text-center text-muted-foreground">
                  {progress}% Complete
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Complete */}
        {currentStep === 4 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold">Creation Complete!</h2>
              <p className="text-muted-foreground">
                Your AI-powered creation is ready to use
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Generated Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-sm">frontend/</span>
                    </div>
                    <span className="text-sm text-muted-foreground">12 files</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-sm">backend/</span>
                    </div>
                    <span className="text-sm text-muted-foreground">8 files</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-sm">database/</span>
                    </div>
                    <span className="text-sm text-muted-foreground">3 files</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">Preview</Button>
              <Button className="flex-1">Download Files</Button>
            </div>
          </div>
        )}
      </WorkflowWizard>
    </>
  );
}
