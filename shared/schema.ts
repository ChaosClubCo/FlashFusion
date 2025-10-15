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

// Workflow runs - tracks each workflow execution
export const workflowRuns = pgTable("workflow_runs", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  workflowType: text("workflow_type").notNull(), // ai-creation, publishing, commerce, analytics, security, quality
  status: text("status").notNull().default("in_progress"), // in_progress, completed, failed
  currentStep: integer("current_step").notNull().default(1),
  totalSteps: integer("total_steps").notNull(),
  configuration: text("configuration"), // JSON string of workflow config
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Workflow steps - tracks individual steps within a workflow
export const workflowSteps = pgTable("workflow_steps", {
  id: varchar("id").primaryKey(),
  workflowRunId: varchar("workflow_run_id").notNull().references(() => workflowRuns.id),
  stepNumber: integer("step_number").notNull(),
  stepName: text("step_name").notNull(),
  status: text("status").notNull().default("pending"), // pending, active, completed, skipped
  data: text("data"), // JSON string of step-specific data
  completedAt: timestamp("completed_at"),
});

// Workflow results - stores final results and outputs
export const workflowResults = pgTable("workflow_results", {
  id: varchar("id").primaryKey(),
  workflowRunId: varchar("workflow_run_id").notNull().references(() => workflowRuns.id),
  resultType: text("result_type").notNull(), // code, deployment, analytics, security_report, quality_report
  resultData: text("result_data").notNull(), // JSON string of results
  files: text("files"), // JSON array of generated files
  metrics: text("metrics"), // JSON object of performance/quality metrics
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Generated projects - stores AI-generated code and files
export const generatedProjects = pgTable("generated_projects", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  workflowRunId: varchar("workflow_run_id").references(() => workflowRuns.id),
  title: text("title").notNull(),
  description: text("description"),
  projectType: text("project_type").notNull(), // webapp, mobileapp, api, component, etc.
  files: text("files").notNull(), // JSON array of {path, content}
  metadata: text("metadata"), // JSON object with additional info
  createdAt: timestamp("created_at").notNull().defaultNow(),
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

export const insertWorkflowRunSchema = createInsertSchema(workflowRuns).pick({
  userId: true,
  workflowType: true,
  totalSteps: true,
  configuration: true,
});

export const insertWorkflowStepSchema = createInsertSchema(workflowSteps).pick({
  workflowRunId: true,
  stepNumber: true,
  stepName: true,
  data: true,
});

export const insertWorkflowResultSchema = createInsertSchema(workflowResults).pick({
  workflowRunId: true,
  resultType: true,
  resultData: true,
  files: true,
  metrics: true,
});

export const insertGeneratedProjectSchema = createInsertSchema(generatedProjects).pick({
  userId: true,
  workflowRunId: true,
  title: true,
  description: true,
  projectType: true,
  files: true,
  metadata: true,
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
export type WorkflowRun = typeof workflowRuns.$inferSelect;
export type InsertWorkflowRun = z.infer<typeof insertWorkflowRunSchema>;
export type WorkflowStep = typeof workflowSteps.$inferSelect;
export type InsertWorkflowStep = z.infer<typeof insertWorkflowStepSchema>;
export type WorkflowResult = typeof workflowResults.$inferSelect;
export type InsertWorkflowResult = z.infer<typeof insertWorkflowResultSchema>;
export type GeneratedProject = typeof generatedProjects.$inferSelect;
export type InsertGeneratedProject = z.infer<typeof insertGeneratedProjectSchema>;

// Feature flags type
export type FeatureFlags = {
  PROMO_LAUNCH50: boolean;
  PWA_ENABLED: boolean;
  I18N_ENABLED: boolean;
  UPGRADE_MODAL_V2: boolean;
  REFERRAL_ENABLED: boolean;
  AGENT_TEASERS_ENABLED: boolean;
};
