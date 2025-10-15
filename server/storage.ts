import { 
  type User, 
  type InsertUser,
  type EmailSubscription,
  type InsertEmailSubscription,
  type AnalyticsEvent,
  type InsertAnalyticsEvent,
  type FeatureFlags,
  type WorkflowRun,
  type InsertWorkflowRun,
  type GeneratedProject,
  type InsertGeneratedProject,
  users,
  emailSubscriptions,
  analyticsEvents,
  workflowRuns,
  generatedProjects,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserUsage(id: string, currentUsage: number): Promise<User | undefined>;

  // Email subscription methods
  createEmailSubscription(email: InsertEmailSubscription): Promise<EmailSubscription>;
  getEmailSubscription(email: string): Promise<EmailSubscription | undefined>;

  // Analytics methods
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsEvents(limit?: number): Promise<AnalyticsEvent[]>;

  // Feature flags
  getFeatureFlags(): Promise<FeatureFlags>;

  // Workflow methods
  createWorkflowRun(data: InsertWorkflowRun): Promise<WorkflowRun>;
  getWorkflowRun(id: string): Promise<WorkflowRun | undefined>;
  getWorkflowsByUser(userId: string): Promise<WorkflowRun[]>;
  updateWorkflowRun(id: string, data: Partial<Omit<WorkflowRun, 'id' | 'userId' | 'createdAt'>>): Promise<WorkflowRun | undefined>;

  // Generated project methods
  createGeneratedProject(data: InsertGeneratedProject): Promise<GeneratedProject>;
  getGeneratedProject(id: string): Promise<GeneratedProject | undefined>;
  getGeneratedProjectsByUser(userId: string): Promise<GeneratedProject[]>;
  deleteGeneratedProject(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private emailSubscriptions: Map<string, EmailSubscription>;
  private analyticsEvents: AnalyticsEvent[];
  private workflowRuns: Map<string, WorkflowRun>;
  private generatedProjects: Map<string, GeneratedProject>;
  private featureFlags: FeatureFlags;

  constructor() {
    this.users = new Map();
    this.emailSubscriptions = new Map();
    this.analyticsEvents = [];
    this.workflowRuns = new Map();
    this.generatedProjects = new Map();
    this.featureFlags = {
      PROMO_LAUNCH50: true,
      PWA_ENABLED: false,
      I18N_ENABLED: false,
      UPGRADE_MODAL_V2: false,
      REFERRAL_ENABLED: false,
      AGENT_TEASERS_ENABLED: false,
    };

    // Create a default demo user
    const demoUser: User = {
      id: 'demo-user-1',
      username: 'demo',
      password: 'hashed_password',
      plan: 'free',
      role: 'user',
      currentUsage: 3,
      usageLimit: 10,
    };
    this.users.set(demoUser.id, demoUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      plan: 'free',
      role: 'user',
      currentUsage: 0,
      usageLimit: 10,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserUsage(id: string, currentUsage: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, currentUsage };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createEmailSubscription(insertEmail: InsertEmailSubscription): Promise<EmailSubscription> {
    const existing = this.emailSubscriptions.get(insertEmail.email);
    if (existing) return existing;

    const subscription: EmailSubscription = {
      id: randomUUID(),
      email: insertEmail.email,
      subscribedAt: new Date(),
    };
    this.emailSubscriptions.set(insertEmail.email, subscription);
    return subscription;
  }

  async getEmailSubscription(email: string): Promise<EmailSubscription | undefined> {
    return this.emailSubscriptions.get(email);
  }

  async createAnalyticsEvent(insertEvent: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const event: AnalyticsEvent = {
      id: randomUUID(),
      name: insertEvent.name,
      route: insertEvent.route,
      props: insertEvent.props || null,
      timestamp: new Date(),
      consentGiven: insertEvent.consentGiven ?? false,
    };
    this.analyticsEvents.push(event);
    return event;
  }

  async getAnalyticsEvents(limit: number = 100): Promise<AnalyticsEvent[]> {
    return this.analyticsEvents
      .slice(-limit)
      .reverse();
  }

  async getFeatureFlags(): Promise<FeatureFlags> {
    return this.featureFlags;
  }

  async createWorkflowRun(data: InsertWorkflowRun): Promise<WorkflowRun> {
    const workflow: WorkflowRun = {
      id: randomUUID(),
      userId: data.userId,
      workflowType: data.workflowType,
      status: 'in_progress',
      currentStep: 1,
      totalSteps: data.totalSteps,
      configuration: data.configuration || null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.workflowRuns.set(workflow.id, workflow);
    return workflow;
  }

  async getWorkflowRun(id: string): Promise<WorkflowRun | undefined> {
    return this.workflowRuns.get(id);
  }

  async getWorkflowsByUser(userId: string): Promise<WorkflowRun[]> {
    return Array.from(this.workflowRuns.values()).filter(
      (workflow) => workflow.userId === userId
    );
  }

  async updateWorkflowRun(id: string, data: Partial<Omit<WorkflowRun, 'id' | 'userId' | 'createdAt'>>): Promise<WorkflowRun | undefined> {
    const workflow = this.workflowRuns.get(id);
    if (!workflow) return undefined;

    const updatedWorkflow = { 
      ...workflow, 
      ...data,
      completedAt: data.status === 'completed' ? new Date() : workflow.completedAt,
    };
    this.workflowRuns.set(id, updatedWorkflow);
    return updatedWorkflow;
  }

  async createGeneratedProject(data: InsertGeneratedProject): Promise<GeneratedProject> {
    const project: GeneratedProject = {
      id: randomUUID(),
      userId: data.userId,
      workflowRunId: data.workflowRunId || null,
      title: data.title,
      description: data.description || null,
      projectType: data.projectType,
      files: data.files,
      metadata: data.metadata || null,
      createdAt: new Date(),
    };
    this.generatedProjects.set(project.id, project);
    return project;
  }

  async getGeneratedProject(id: string): Promise<GeneratedProject | undefined> {
    return this.generatedProjects.get(id);
  }

  async getGeneratedProjectsByUser(userId: string): Promise<GeneratedProject[]> {
    return Array.from(this.generatedProjects.values())
      .filter((project) => project.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async deleteGeneratedProject(id: string): Promise<boolean> {
    return this.generatedProjects.delete(id);
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  private featureFlags: FeatureFlags = {
    PROMO_LAUNCH50: true,
    PWA_ENABLED: false,
    I18N_ENABLED: false,
    UPGRADE_MODAL_V2: false,
    REFERRAL_ENABLED: false,
    AGENT_TEASERS_ENABLED: false,
  };

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        id,
        plan: 'free',
        role: 'user',
        currentUsage: 0,
        usageLimit: 10,
      })
      .returning();
    return user;
  }

  async updateUserUsage(id: string, currentUsage: number): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ currentUsage })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async createEmailSubscription(insertEmail: InsertEmailSubscription): Promise<EmailSubscription> {
    // Check if already exists
    const existing = await this.getEmailSubscription(insertEmail.email);
    if (existing) return existing;

    const [subscription] = await db
      .insert(emailSubscriptions)
      .values({
        id: randomUUID(),
        email: insertEmail.email,
      })
      .returning();
    return subscription;
  }

  async getEmailSubscription(email: string): Promise<EmailSubscription | undefined> {
    const [subscription] = await db
      .select()
      .from(emailSubscriptions)
      .where(eq(emailSubscriptions.email, email));
    return subscription || undefined;
  }

  async createAnalyticsEvent(insertEvent: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [event] = await db
      .insert(analyticsEvents)
      .values({
        id: randomUUID(),
        name: insertEvent.name,
        route: insertEvent.route,
        props: insertEvent.props || null,
        consentGiven: insertEvent.consentGiven ?? false,
      })
      .returning();
    return event;
  }

  async getAnalyticsEvents(limit: number = 100): Promise<AnalyticsEvent[]> {
    const events = await db
      .select()
      .from(analyticsEvents)
      .orderBy(desc(analyticsEvents.timestamp))
      .limit(limit);
    return events;
  }

  async getFeatureFlags(): Promise<FeatureFlags> {
    return this.featureFlags;
  }

  async createWorkflowRun(data: InsertWorkflowRun): Promise<WorkflowRun> {
    const [workflow] = await db
      .insert(workflowRuns)
      .values({
        id: randomUUID(),
        ...data,
      })
      .returning();
    return workflow;
  }

  async getWorkflowRun(id: string): Promise<WorkflowRun | undefined> {
    const [workflow] = await db
      .select()
      .from(workflowRuns)
      .where(eq(workflowRuns.id, id));
    return workflow || undefined;
  }

  async getWorkflowsByUser(userId: string): Promise<WorkflowRun[]> {
    const workflows = await db
      .select()
      .from(workflowRuns)
      .where(eq(workflowRuns.userId, userId))
      .orderBy(desc(workflowRuns.createdAt));
    return workflows;
  }

  async updateWorkflowRun(id: string, data: Partial<Omit<WorkflowRun, 'id' | 'userId' | 'createdAt'>>): Promise<WorkflowRun | undefined> {
    const updateData: any = {};
    if (data.currentStep !== undefined) updateData.currentStep = data.currentStep;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.configuration !== undefined) updateData.configuration = data.configuration;
    if (data.status === 'completed') updateData.completedAt = new Date();

    const [workflow] = await db
      .update(workflowRuns)
      .set(updateData)
      .where(eq(workflowRuns.id, id))
      .returning();
    return workflow || undefined;
  }

  async createGeneratedProject(data: InsertGeneratedProject): Promise<GeneratedProject> {
    const [project] = await db
      .insert(generatedProjects)
      .values({
        id: randomUUID(),
        ...data,
      })
      .returning();
    return project;
  }

  async getGeneratedProject(id: string): Promise<GeneratedProject | undefined> {
    const [project] = await db
      .select()
      .from(generatedProjects)
      .where(eq(generatedProjects.id, id));
    return project || undefined;
  }

  async getGeneratedProjectsByUser(userId: string): Promise<GeneratedProject[]> {
    const projects = await db
      .select()
      .from(generatedProjects)
      .where(eq(generatedProjects.userId, userId))
      .orderBy(desc(generatedProjects.createdAt));
    return projects;
  }

  async deleteGeneratedProject(id: string): Promise<boolean> {
    const result = await db
      .delete(generatedProjects)
      .where(eq(generatedProjects.id, id));
    return true;
  }
}

// Initialize database storage
export const storage = new DatabaseStorage();

// Initialize demo user on startup
async function initializeDemoUser() {
  try {
    // Check if demo user exists by ID first (for consistency)
    let existingUser = await storage.getUser('demo-user-1');
    
    if (!existingUser) {
      // Create demo user with specific ID for frontend compatibility
      const [user] = await db
        .insert(users)
        .values({
          id: 'demo-user-1',
          username: 'demo',
          password: 'hashed_password',
          plan: 'free',
          role: 'user',
          currentUsage: 3,
          usageLimit: 10,
        })
        .returning();
      console.log('Demo user created successfully with ID: demo-user-1');
    } else {
      console.log('Demo user already exists');
    }
  } catch (error) {
    console.error('Error initializing demo user:', error);
  }
}

// Run initialization
initializeDemoUser();
