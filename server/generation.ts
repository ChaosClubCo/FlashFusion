import { db } from './db';
import { generationJobs, users } from '@shared/schema';
import { eq, or } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import type { GenerationJob } from '@shared/schema';

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
  // Simulate API call delay (1-3 seconds)
  const delay = Math.random() * 2000 + 1000;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Simulate generation result
  return {
    prompt,
    generated: `AI generated response for: "${prompt}"`,
    timestamp: new Date().toISOString(),
    model: 'gpt-4',
    tokens: Math.floor(Math.random() * 1000) + 100,
  };
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
