import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertEmailSubscriptionSchema,
  insertAnalyticsEventSchema,
} from "@shared/schema";
import { z } from "zod";

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

  const httpServer = createServer(app);

  return httpServer;
}
