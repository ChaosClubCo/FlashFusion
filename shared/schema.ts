import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (existing)
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  plan: text("plan").notNull().default("free"), // free, pro, enterprise
  role: text("role").notNull().default("user"),
  currentUsage: integer("current_usage").notNull().default(0),
  usageLimit: integer("usage_limit").notNull().default(10),
});

// Email subscriptions
export const emailSubscriptions = pgTable("email_subscriptions", {
  id: varchar("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
});

// Analytics events
export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  route: text("route").notNull(),
  props: text("props"), // JSON string
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  consentGiven: boolean("consent_given").notNull().default(false),
});

// Generation jobs
export const generationJobs = pgTable("generation_jobs", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  prompt: text("prompt").notNull(),
  result: text("result"), // Generated output (JSON string)
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Rate limit tracking
export const rateLimits = pgTable("rate_limits", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  requestCount: integer("request_count").notNull().default(0),
  windowStart: timestamp("window_start").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEmailSubscriptionSchema = createInsertSchema(emailSubscriptions).pick({
  email: true,
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).pick({
  name: true,
  route: true,
  props: true,
  consentGiven: true,
});

export const insertGenerationJobSchema = createInsertSchema(generationJobs).pick({
  userId: true,
  prompt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type EmailSubscription = typeof emailSubscriptions.$inferSelect;
export type InsertEmailSubscription = z.infer<typeof insertEmailSubscriptionSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type GenerationJob = typeof generationJobs.$inferSelect;
export type InsertGenerationJob = z.infer<typeof insertGenerationJobSchema>;
export type RateLimit = typeof rateLimits.$inferSelect;

// Feature flags type
export type FeatureFlags = {
  PROMO_LAUNCH50: boolean;
  PWA_ENABLED: boolean;
  I18N_ENABLED: boolean;
  UPGRADE_MODAL_V2: boolean;
  REFERRAL_ENABLED: boolean;
  AGENT_TEASERS_ENABLED: boolean;
};
