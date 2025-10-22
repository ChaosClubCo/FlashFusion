import { AgentTeasers } from './AgentTeasers';

/**
 * Demo page showing how to use the AgentTeasers component
 *
 * Usage:
 * 1. Import the component: import { AgentTeasers } from '@/components/AgentTeasers';
 * 2. Add it to your page: <AgentTeasers />
 *
 * The component is fully self-contained and doesn't require any props.
 * It includes all animations, state management, and styling internally.
 */
export function AgentTeasersDemo() {
  return (
    <div className="min-h-screen bg-background">
      <AgentTeasers />
    </div>
  );
}

export default AgentTeasersDemo;
