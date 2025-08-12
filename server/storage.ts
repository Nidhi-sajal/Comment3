import { 
  users, teams, integrations, posts, comments, intents, suggestions, activityLogs,
  type User, type InsertUser, type Team, type InsertTeam, type Integration, 
  type InsertIntegration, type Post, type InsertPost, type Comment, 
  type InsertComment, type Intent, type InsertIntent, type Suggestion, 
  type InsertSuggestion, type ActivityLog
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByClerkId(clerkId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;

  // Team operations
  getTeam(id: string): Promise<Team | undefined>;
  getUserTeams(userId: string): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;

  // Integration operations
  getIntegration(id: string): Promise<Integration | undefined>;
  getTeamIntegrations(teamId: string): Promise<Integration[]>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: string, integration: Partial<InsertIntegration>): Promise<Integration>;
  deleteIntegration(id: string): Promise<void>;

  // Post operations
  getPost(id: string): Promise<Post | undefined>;
  getTeamPosts(teamId: string, limit?: number): Promise<(Post & { integration: Integration })[]>;
  createPost(post: InsertPost): Promise<Post>;

  // Comment operations
  getPostComments(postId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;

  // Intent operations
  getTeamIntents(teamId: string): Promise<Intent[]>;
  createIntent(intent: InsertIntent): Promise<Intent>;

  // Suggestion operations
  getPostSuggestions(postId: string): Promise<Suggestion[]>;
  createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion>;
  updateSuggestion(id: string, suggestion: Partial<InsertSuggestion>): Promise<Suggestion>;

  // Activity logs
  createActivityLog(log: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<ActivityLog>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByClerkId(clerkId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Team operations
  async getTeam(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team || undefined;
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    return await db.select().from(teams).where(eq(teams.ownerUserId, userId));
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const [team] = await db
      .insert(teams)
      .values(insertTeam)
      .returning();
    return team;
  }

  // Integration operations
  async getIntegration(id: string): Promise<Integration | undefined> {
    const [integration] = await db.select().from(integrations).where(eq(integrations.id, id));
    return integration || undefined;
  }

  async getTeamIntegrations(teamId: string): Promise<Integration[]> {
    return await db
      .select()
      .from(integrations)
      .where(eq(integrations.teamId, teamId))
      .orderBy(desc(integrations.createdAt));
  }

  async createIntegration(insertIntegration: InsertIntegration): Promise<Integration> {
    const [integration] = await db
      .insert(integrations)
      .values(insertIntegration)
      .returning();
    return integration;
  }

  async updateIntegration(id: string, updateData: Partial<InsertIntegration>): Promise<Integration> {
    const [integration] = await db
      .update(integrations)
      .set(updateData)
      .where(eq(integrations.id, id))
      .returning();
    return integration;
  }

  async deleteIntegration(id: string): Promise<void> {
    await db.delete(integrations).where(eq(integrations.id, id));
  }

  // Post operations
  async getPost(id: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async getTeamPosts(teamId: string, limit: number = 50): Promise<(Post & { integration: Integration })[]> {
    return await db
      .select({
        id: posts.id,
        integrationId: posts.integrationId,
        platformPostId: posts.platformPostId,
        platform: posts.platform,
        authorPlatformId: posts.authorPlatformId,
        title: posts.title,
        body: posts.body,
        media: posts.media,
        fetchedAt: posts.fetchedAt,
        createdAt: posts.createdAt,
        integration: integrations,
      })
      .from(posts)
      .innerJoin(integrations, eq(posts.integrationId, integrations.id))
      .where(eq(integrations.teamId, teamId))
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db
      .insert(posts)
      .values(insertPost)
      .returning();
    return post;
  }

  // Comment operations
  async getPostComments(postId: string): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }

  // Intent operations
  async getTeamIntents(teamId: string): Promise<Intent[]> {
    return await db
      .select()
      .from(intents)
      .where(eq(intents.teamId, teamId))
      .orderBy(desc(intents.createdAt));
  }

  async createIntent(insertIntent: InsertIntent): Promise<Intent> {
    const [intent] = await db
      .insert(intents)
      .values(insertIntent)
      .returning();
    return intent;
  }

  // Suggestion operations
  async getPostSuggestions(postId: string): Promise<Suggestion[]> {
    return await db
      .select()
      .from(suggestions)
      .where(eq(suggestions.postId, postId))
      .orderBy(desc(suggestions.createdAt));
  }

  async createSuggestion(insertSuggestion: InsertSuggestion): Promise<Suggestion> {
    const [suggestion] = await db
      .insert(suggestions)
      .values(insertSuggestion)
      .returning();
    return suggestion;
  }

  async updateSuggestion(id: string, updateData: Partial<InsertSuggestion>): Promise<Suggestion> {
    const [suggestion] = await db
      .update(suggestions)
      .set(updateData)
      .where(eq(suggestions.id, id))
      .returning();
    return suggestion;
  }

  // Activity logs
  async createActivityLog(logData: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<ActivityLog> {
    const [log] = await db
      .insert(activityLogs)
      .values(logData)
      .returning();
    return log;
  }
}

export const storage = new DatabaseStorage();
