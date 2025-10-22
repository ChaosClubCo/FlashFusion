import { db } from './db';
import { generationJobs, users } from '@shared/schema';
import { eq, or } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import type { GenerationJob } from '@shared/schema';
import { openai } from './openai';

// Job queue (in-memory for simplicity, could be Redis in production)
const jobQueue: string[] = [];
let isProcessing = false;
let isInitialized = false;

interface GenerateRequest {
  userId: string;
  prompt: string;
}

export async function createGenerationJob(data: GenerateRequest): Promise<GenerationJob> {
  const jobId = randomUUID();

  // Create job in database
  const [job] = await db
    .insert(generationJobs)
    .values({
      id: jobId,
      userId: data.userId,
      prompt: data.prompt,
      status: 'pending',
    })
    .returning();

  // Initialize queue on first job if needed
  if (!isInitialized) {
    await initializeQueue();
    isInitialized = true;
  }

  // Add to queue
  jobQueue.push(jobId);

  // Start processing if not already running
  if (!isProcessing) {
    processQueue();
  }

  return job;
}

// Rehydrate queue on server startup
export async function initializeQueue() {
  try {
    // Find all pending or processing jobs
    const stuckJobs = await db
      .select()
      .from(generationJobs)
      .where(
        or(
          eq(generationJobs.status, 'pending'),
          eq(generationJobs.status, 'processing')
        )
      );

    console.log(`Rehydrating ${stuckJobs.length} pending/processing jobs`);

    // Reset processing jobs to pending and add all to queue
    for (const job of stuckJobs) {
      if (job.status === 'processing') {
        await db
          .update(generationJobs)
          .set({ status: 'pending' })
          .where(eq(generationJobs.id, job.id));
      }
      jobQueue.push(job.id);
    }

    // Start processing
    if (jobQueue.length > 0 && !isProcessing) {
      processQueue();
    }
  } catch (error) {
    console.error('Error initializing queue:', error);
  }
}

export async function getGenerationJob(jobId: string): Promise<GenerationJob | undefined> {
  const [job] = await db
    .select()
    .from(generationJobs)
    .where(eq(generationJobs.id, jobId));
  return job || undefined;
}

async function processQueue() {
  if (isProcessing || jobQueue.length === 0) return;

  isProcessing = true;

  while (jobQueue.length > 0) {
    const jobId = jobQueue.shift();
    if (!jobId) continue;

    try {
      // Update job status to processing
      await db
        .update(generationJobs)
        .set({ status: 'processing' })
        .where(eq(generationJobs.id, jobId));

      // Get job details
      const job = await getGenerationJob(jobId);
      if (!job) continue;

      // Simulate generation (replace with actual AI generation)
      const result = await simulateGeneration(job.prompt);

      // Update job as completed
      await db
        .update(generationJobs)
        .set({
          status: 'completed',
          result: JSON.stringify(result),
          completedAt: new Date(),
        })
        .where(eq(generationJobs.id, jobId));

    } catch (error) {
      console.error(`Job ${jobId} failed:`, error);
      
      // Mark job as failed
      await db
        .update(generationJobs)
        .set({
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date(),
        })
        .where(eq(generationJobs.id, jobId));
    }
  }

  isProcessing = false;
}

async function simulateGeneration(prompt: string): Promise<any> {
  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are FlashFusion AI, an expert full-stack application generator. Generate production-ready code based on user prompts.

Return your response as a JSON object with the following structure:
{
  "appName": "string",
  "description": "string",
  "techStack": ["string"],
  "files": [
    {
      "path": "string",
      "content": "string",
      "language": "string"
    }
  ],
  "installCommands": ["string"],
  "runCommands": ["string"],
  "features": ["string"]
}

Generate complete, working code that follows best practices.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    return {
      prompt,
      generated: result,
      timestamp: new Date().toISOString(),
      model: completion.model,
      tokens: completion.usage?.total_tokens || 0,
      finishReason: completion.choices[0].finish_reason,
    };
  } catch (error) {
    console.error('OpenAI generation error:', error);

    // Fallback to simulation if OpenAI fails (e.g., no API key)
    console.warn('Falling back to simulated generation');

    return {
      prompt,
      generated: {
        appName: extractAppName(prompt),
        description: `Generated app based on: ${prompt}`,
        techStack: ["React", "TypeScript", "Tailwind CSS", "Express.js"],
        files: [
          {
            path: "src/App.tsx",
            content: `// Generated app for: ${prompt}\nimport React from 'react';\n\nfunction App() {\n  return <div>Your app here</div>;\n}\n\nexport default App;`,
            language: "typescript"
          }
        ],
        installCommands: ["npm install"],
        runCommands: ["npm run dev"],
        features: ["Basic setup", "TypeScript support", "React framework"]
      },
      timestamp: new Date().toISOString(),
      model: 'simulated',
      tokens: 0,
      simulationMode: true,
    };
  }
}

function extractAppName(prompt: string): string {
  // Simple extraction of app name from prompt
  const words = prompt.split(' ').filter(w => w.length > 2);
  return words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Retry logic for failed jobs
export async function retryJob(jobId: string): Promise<void> {
  const job = await getGenerationJob(jobId);
  if (!job || job.status !== 'failed') {
    throw new Error('Job not found or not in failed state');
  }

  // Reset job to pending
  await db
    .update(generationJobs)
    .set({
      status: 'pending',
      errorMessage: null,
      completedAt: null,
    })
    .where(eq(generationJobs.id, jobId));

  // Add back to queue
  jobQueue.push(jobId);

  if (!isProcessing) {
    processQueue();
  }
}
