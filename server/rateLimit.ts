import { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { rateLimits, users } from '@shared/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// Plan-based rate limits (requests per hour)
const RATE_LIMITS = {
  free: 10,
  pro: 100,
  enterprise: Infinity,
};

export async function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.body.userId || req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Get user to check their plan
    const [user] = await db.select().from(users).where(eq(users.id, userId as string));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const limit = RATE_LIMITS[user.plan as keyof typeof RATE_LIMITS] || RATE_LIMITS.free;

    // If unlimited (enterprise), skip rate limiting
    if (limit === Infinity) {
      return next();
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Try to increment existing rate limit window atomically
    const [updated] = await db
      .update(rateLimits)
      .set({ requestCount: sql`${rateLimits.requestCount} + 1` })
      .where(
        and(
          eq(rateLimits.userId, userId as string),
          gte(rateLimits.windowStart, oneHourAgo),
          sql`${rateLimits.requestCount} < ${limit}` // Only increment if under limit
        )
      )
      .returning();

    if (updated) {
      // Successfully incremented - request allowed
      return next();
    }

    // Check if blocked (at limit) or need new window
    const [existingLimit] = await db
      .select()
      .from(rateLimits)
      .where(
        and(
          eq(rateLimits.userId, userId as string),
          gte(rateLimits.windowStart, oneHourAgo)
        )
      );

    if (existingLimit) {
      // At limit - block request
      return res.status(429).json({
        error: 'Rate limit exceeded',
        limit,
        resetAt: new Date(existingLimit.windowStart.getTime() + 60 * 60 * 1000).toISOString(),
      });
    }

    // No active window - create new one
    await db.insert(rateLimits).values({
      id: randomUUID(),
      userId: userId as string,
      requestCount: 1,
      windowStart: new Date(),
    });

    next();
  } catch (error) {
    console.error('Rate limit error:', error);
    res.status(500).json({ error: 'Rate limiting failed' });
  }
}
