import { 
  type User, 
  type InsertUser,
  type EmailSubscription,
  type InsertEmailSubscription,
  type AnalyticsEvent,
  type InsertAnalyticsEvent,
  type FeatureFlags,
} from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private emailSubscriptions: Map<string, EmailSubscription>;
  private analyticsEvents: AnalyticsEvent[];
  private featureFlags: FeatureFlags;

  constructor() {
    this.users = new Map();
    this.emailSubscriptions = new Map();
    this.analyticsEvents = [];
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
}

export const storage = new MemStorage();
