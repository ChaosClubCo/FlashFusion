import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertEmailSubscriptionSchema,
  insertAnalyticsEventSchema,
  insertGenerationJobSchema,
  insertWorkflowRunSchema,
} from "@shared/schema";
import { z } from "zod";
import { rateLimitMiddleware } from "./rateLimit";
import { createGenerationJob, getGenerationJob, retryJob } from "./generation";
import { openai } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // CORS headers for all routes
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  // Feature flags endpoint
  app.get('/api/flags', async (req, res) => {
    try {
      const flags = await storage.getFeatureFlags();
      res.json(flags);
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      res.status(500).json({ error: 'Failed to fetch feature flags' });
    }
  });

  // Email subscription endpoint
  app.post('/api/subscribe', async (req, res) => {
    try {
      const validated = insertEmailSubscriptionSchema.parse(req.body);
      const subscription = await storage.createEmailSubscription(validated);
      res.json({ success: true, subscription });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid email format', details: error.errors });
      } else {
        console.error('Error creating subscription:', error);
        res.status(500).json({ error: 'Failed to create subscription' });
      }
    }
  });

  // Usage check endpoint
  app.post('/api/usage/check', async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }

      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isAtLimit = user.currentUsage >= user.usageLimit;
      const percentage = (user.currentUsage / user.usageLimit) * 100;

      res.json({
        currentUsage: user.currentUsage,
        usageLimit: user.usageLimit,
        isAtLimit,
        percentage,
        plan: user.plan,
      });
    } catch (error) {
      console.error('Error checking usage:', error);
      res.status(500).json({ error: 'Failed to check usage' });
    }
  });

  // Usage increment endpoint
  app.post('/api/usage/increment', async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }

      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.currentUsage >= user.usageLimit) {
        return res.status(403).json({ 
          error: 'Usage limit reached',
          currentUsage: user.currentUsage,
          usageLimit: user.usageLimit,
        });
      }

      const updatedUser = await storage.updateUserUsage(userId, user.currentUsage + 1);

      res.json({
        success: true,
        currentUsage: updatedUser?.currentUsage,
        usageLimit: updatedUser?.usageLimit,
      });
    } catch (error) {
      console.error('Error incrementing usage:', error);
      res.status(500).json({ error: 'Failed to increment usage' });
    }
  });

  // Analytics events endpoint
  app.post('/api/events', async (req, res) => {
    try {
      const { events } = req.body;

      if (!Array.isArray(events)) {
        return res.status(400).json({ error: 'Events must be an array' });
      }

      const createdEvents = [];

      for (const eventData of events) {
        const validated = insertAnalyticsEventSchema.parse({
          name: eventData.name,
          route: eventData.route,
          props: eventData.props ? JSON.stringify(eventData.props) : undefined,
          consentGiven: true, // Since events are only sent when consent is given
        });

        const event = await storage.createAnalyticsEvent(validated);
        createdEvents.push(event);
      }

      res.json({ 
        success: true, 
        count: createdEvents.length,
        events: createdEvents,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid event format', details: error.errors });
      } else {
        console.error('Error creating events:', error);
        res.status(500).json({ error: 'Failed to create events' });
      }
    }
  });

  // Get analytics events (for admin/debugging)
  app.get('/api/events', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const events = await storage.getAnalyticsEvents(limit);
      res.json({ events });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

  // Generation endpoint with rate limiting
  app.post('/api/generate', rateLimitMiddleware, async (req, res) => {
    try {
      const validated = insertGenerationJobSchema.parse(req.body);
      const job = await createGenerationJob(validated);
      
      res.json({
        success: true,
        jobId: job.id,
        status: job.status,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid request', details: error.errors });
      } else {
        console.error('Error creating generation job:', error);
        res.status(500).json({ error: 'Failed to create generation job' });
      }
    }
  });

  // Get generation job status
  app.get('/api/generate/:jobId', async (req, res) => {
    try {
      const { jobId } = req.params;
      const job = await getGenerationJob(jobId);

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.json({
        id: job.id,
        status: job.status,
        prompt: job.prompt,
        result: job.result ? JSON.parse(job.result) : null,
        errorMessage: job.errorMessage,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      res.status(500).json({ error: 'Failed to fetch job' });
    }
  });

  // Retry failed job
  app.post('/api/generate/:jobId/retry', async (req, res) => {
    try {
      const { jobId } = req.params;
      await retryJob(jobId);
      
      res.json({ success: true, message: 'Job queued for retry' });
    } catch (error) {
      console.error('Error retrying job:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to retry job' });
    }
  });

  // AI Code Generation with streaming
  app.post('/api/generate-code', async (req, res) => {
    try {
      const { prompt, type, userId, workflowId } = req.body;

      if (!prompt || !type || !userId) {
        return res.status(400).json({ error: 'Missing required fields: prompt, type, userId' });
      }

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Send initial progress
      res.write(`data: ${JSON.stringify({ type: 'progress', message: 'Initializing AI generation...', progress: 10 })}\n\n`);

      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const systemPrompt = `You are an expert full-stack developer. Generate production-ready code based on the user's requirements.

Type: ${type}
Requirements: ${prompt}

Generate a complete project with:
1. Clean, well-structured code following best practices
2. All necessary files (HTML, CSS, JavaScript/TypeScript, etc.)
3. Comments explaining key functionality
4. Ready to run without modifications

Respond with JSON in this exact format:
{
  "files": [
    {
      "path": "index.html",
      "content": "<!DOCTYPE html>..."
    },
    {
      "path": "styles.css",
      "content": "body { ... }"
    },
    {
      "path": "script.js",
      "content": "// Main application logic..."
    }
  ],
  "description": "Brief description of what was generated",
  "instructions": "How to run/use the generated code"
}`;

      res.write(`data: ${JSON.stringify({ type: 'progress', message: 'Generating code with AI...', progress: 30 })}\n\n`);

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 8192,
      });

      res.write(`data: ${JSON.stringify({ type: 'progress', message: 'Processing generated code...', progress: 80 })}\n\n`);

      const generatedContent = completion.choices[0]?.message?.content;
      
      if (!generatedContent) {
        throw new Error('No content generated');
      }

      const result = JSON.parse(generatedContent);

      res.write(`data: ${JSON.stringify({ type: 'progress', message: 'Saving project...', progress: 95 })}\n\n`);

      // Persist to database
      const project = await storage.createGeneratedProject({
        userId,
        workflowRunId: workflowId || null,
        title: result.description || 'AI Generated Project',
        description: prompt,
        projectType: type,
        files: JSON.stringify(result.files || []),
        metadata: JSON.stringify({
          model: 'gpt-5',
          instructions: result.instructions,
          generatedAt: new Date().toISOString(),
        }),
      });

      // Send final result with project ID
      res.write(`data: ${JSON.stringify({ 
        type: 'complete', 
        result: {
          ...result,
          projectId: project.id,
        }, 
        progress: 100 
      })}\n\n`);
      res.end();

    } catch (error) {
      console.error('Error generating code:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate code';
      try {
        res.write(`data: ${JSON.stringify({ type: 'error', error: errorMessage })}\n\n`);
        res.end();
      } catch (writeError) {
        console.error('Error writing error response:', writeError);
      }
    }
  });

  // Workflow endpoints
  app.post('/api/workflows', async (req, res) => {
    try {
      const validated = insertWorkflowRunSchema.parse(req.body);
      const workflow = await storage.createWorkflowRun(validated);
      res.json(workflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid workflow data', details: error.errors });
      } else {
        console.error('Error creating workflow:', error);
        res.status(500).json({ error: 'Failed to create workflow' });
      }
    }
  });

  app.get('/api/workflows/:id', async (req, res) => {
    try {
      const workflow = await storage.getWorkflowRun(req.params.id);
      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }
      res.json(workflow);
    } catch (error) {
      console.error('Error fetching workflow:', error);
      res.status(500).json({ error: 'Failed to fetch workflow' });
    }
  });

  app.get('/api/workflows/user/:userId', async (req, res) => {
    try {
      const workflows = await storage.getWorkflowsByUser(req.params.userId);
      res.json(workflows);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      res.status(500).json({ error: 'Failed to fetch workflows' });
    }
  });

  app.patch('/api/workflows/:id', async (req, res) => {
    try {
      const { currentStep, status, configuration } = req.body;
      const workflow = await storage.updateWorkflowRun(req.params.id, {
        currentStep,
        status,
        configuration: configuration ? JSON.stringify(configuration) : undefined,
      });
      if (!workflow) {
        res.status(404).json({ error: 'Workflow not found' });
        return;
      }
      res.json(workflow);
    } catch (error) {
      console.error('Error updating workflow:', error);
      res.status(500).json({ error: 'Failed to update workflow' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
