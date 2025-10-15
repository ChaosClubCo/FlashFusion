import { create } from 'zustand';
import type { WorkflowRun } from '@shared/schema';

export type WorkflowType = 'ai-creation' | 'publishing' | 'commerce' | 'analytics' | 'security' | 'quality';

export type WorkflowStepData = Record<string, any>;

interface WorkflowState {
  // Current workflow execution
  currentWorkflowId: string | null;
  workflowType: WorkflowType | null;
  currentStep: number;
  totalSteps: number;
  stepData: Record<number, WorkflowStepData>;
  isProcessing: boolean;
  
  // Completed workflows
  completedWorkflows: WorkflowRun[];
  
  // Actions
  startWorkflow: (workflowType: WorkflowType, totalSteps: number, workflowId: string) => void;
  setWorkflowId: (workflowId: string) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateStepData: (step: number, data: WorkflowStepData) => void;
  setProcessing: (isProcessing: boolean) => void;
  completeWorkflow: () => void;
  resetWorkflow: () => void;
  setCompletedWorkflows: (workflows: WorkflowRun[]) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  currentWorkflowId: null,
  workflowType: null,
  currentStep: 1,
  totalSteps: 1,
  stepData: {},
  isProcessing: false,
  completedWorkflows: [],

  startWorkflow: (workflowType, totalSteps, workflowId) => set({
    workflowType,
    totalSteps,
    currentStep: 1,
    stepData: {},
    currentWorkflowId: workflowId,
    isProcessing: false,
  }),

  setWorkflowId: (workflowId) => set({ currentWorkflowId: workflowId }),

  goToStep: (step) => {
    const { totalSteps } = get();
    if (step >= 1 && step <= totalSteps) {
      set({ currentStep: step });
    }
  },

  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps) {
      set({ currentStep: currentStep + 1 });
    }
  },

  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  updateStepData: (step, data) => {
    set((state) => ({
      stepData: {
        ...state.stepData,
        [step]: { ...state.stepData[step], ...data },
      },
    }));
  },

  setProcessing: (isProcessing) => set({ isProcessing }),

  completeWorkflow: () => {
    set({
      currentWorkflowId: null,
      workflowType: null,
      currentStep: 1,
      stepData: {},
      isProcessing: false,
    });
  },

  resetWorkflow: () => {
    set({
      currentWorkflowId: null,
      workflowType: null,
      currentStep: 1,
      totalSteps: 1,
      stepData: {},
      isProcessing: false,
    });
  },

  setCompletedWorkflows: (workflows) => set({ completedWorkflows: workflows }),
}));
