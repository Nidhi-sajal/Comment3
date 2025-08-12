import { sql, relations } from "drizzle-orm";
import { pgTable, uuid, text, varchar, timestamp, json, pgEnum, boolean, integer, real, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const platformEnum = pgEnum('platform', ['reddit', 'instagram', 'x']);
export const roleEnum = pgEnum('role', ['admin', 'editor', 'viewer']);
export const toneEnum = pgEnum('tone', ['friendly', 'formal', 'witty', 'neutral']);
export const suggestionStatusEnum = pgEnum('suggestion_status', ['pending', 'approved', 'rejected', 'posted', 'failed']);

// Tables
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  clerkId: text("clerk_id").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerUserId: uuid("owner_user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: uuid("team_id").references(() => teams.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  role: roleEnum("role").notNull().default('viewer'),
  invitedAt: timestamp("invited_at").defaultNow().notNull(),
  acceptedAt: timestamp("accepted_at"),
}, (table) => ({
  teamIdIdx: index("team_members_team_id_idx").on(table.teamId),
  userIdIdx: index("team_members_user_id_idx").on(table.userId),
}));

export const integrations = pgTable("integrations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: uuid("team_id").references(() => teams.id).notNull(),
  platform: platformEnum("platform").notNull(),
  platformAccountId: text("platform_account_id").notNull(),
  displayName: text("display_name").notNull(),
  accessToken: text("access_token").notNull(), // Should be encrypted in production
  refreshToken: text("refresh_token"),
  scopes: json("scopes").$type<string[]>(),
  expiresAt: timestamp("expires_at"),
  meta: json("meta"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  teamIdIdx: index("integrations_team_id_idx").on(table.teamId),
  platformIdx: index("integrations_platform_idx").on(table.platform),
  platformAccountIdx: index("integrations_platform_account_idx").on(table.platformAccountId),
}));

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  integrationId: uuid("integration_id").references(() => integrations.id).notNull(),
  platformPostId: text("platform_post_id").notNull(),
  platform: platformEnum("platform").notNull(),
  authorPlatformId: text("author_platform_id").notNull(),
  title: text("title"),
  body: text("body"),
  media: json("media").$type<string[]>(),
  fetchedAt: timestamp("fetched_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  integrationIdIdx: index("posts_integration_id_idx").on(table.integrationId),
  platformPostIdIdx: index("posts_platform_post_id_idx").on(table.platformPostId),
}));

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: uuid("post_id").references(() => posts.id).notNull(),
  platformCommentId: text("platform_comment_id"),
  authorHandle: text("author_handle").notNull(),
  text: text("text").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  fetchedAt: timestamp("fetched_at").defaultNow().notNull(),
});

export const intents = pgTable("intents", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: uuid("team_id").references(() => teams.id).notNull(),
  name: text("name").notNull(),
  tone: toneEnum("tone").notNull().default('neutral'),
  confidenceThreshold: real("confidence_threshold").default(0.7),
  brandVoice: text("brand_voice"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  teamIdIdx: index("intents_team_id_idx").on(table.teamId),
  nameIdx: index("intents_name_idx").on(table.name),
}));

export const intentVariations = pgTable("intent_variations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  intentId: uuid("intent_id").references(() => intents.id).notNull(),
  text: text("text").notNull(),
  weight: integer("weight").default(10),
  enabled: boolean("enabled").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const suggestions = pgTable("suggestions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: uuid("post_id").references(() => posts.id).notNull(),
  generatedBy: text("generated_by").notNull(), // 'ai' | 'template'
  intentId: uuid("intent_id").references(() => intents.id),
  text: text("text").notNull(),
  tone: text("tone"),
  confidence: real("confidence"),
  status: suggestionStatusEnum("status").notNull().default('pending'),
  workerLogs: json("worker_logs"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
}, (table) => ({
  postIdIdx: index("suggestions_post_id_idx").on(table.postId),
  statusIdx: index("suggestions_status_idx").on(table.status),
}));

export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: uuid("team_id").references(() => teams.id).notNull(),
  actorUserId: uuid("actor_user_id").references(() => users.id),
  type: text("type").notNull(),
  payload: json("payload"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  teamIdIdx: index("activity_logs_team_id_idx").on(table.teamId),
  actorUserIdIdx: index("activity_logs_actor_user_id_idx").on(table.actorUserId),
  typeIdx: index("activity_logs_type_idx").on(table.type),
}));

export const billingSubscriptions = pgTable("billing_subscriptions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: uuid("team_id").references(() => teams.id).notNull(),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull(),
  plan: text("plan").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const webhookEvents = pgTable("webhook_events", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  integrationId: uuid("integration_id").references(() => integrations.id),
  platform: text("platform").notNull(),
  eventType: text("event_type").notNull(),
  rawPayload: json("raw_payload").notNull(),
  verified: boolean("verified").default(false),
  receivedAt: timestamp("received_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  teams: many(teams),
  teamMembers: many(teamMembers),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  owner: one(users, { fields: [teams.ownerUserId], references: [users.id] }),
  members: many(teamMembers),
  integrations: many(integrations),
  intents: many(intents),
  activityLogs: many(activityLogs),
  billingSubscriptions: many(billingSubscriptions),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, { fields: [teamMembers.teamId], references: [teams.id] }),
  user: one(users, { fields: [teamMembers.userId], references: [users.id] }),
}));

export const integrationsRelations = relations(integrations, ({ one, many }) => ({
  team: one(teams, { fields: [integrations.teamId], references: [teams.id] }),
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  integration: one(integrations, { fields: [posts.integrationId], references: [integrations.id] }),
  comments: many(comments),
  suggestions: many(suggestions),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
}));

export const intentsRelations = relations(intents, ({ one, many }) => ({
  team: one(teams, { fields: [intents.teamId], references: [teams.id] }),
  variations: many(intentVariations),
  suggestions: many(suggestions),
}));

export const intentVariationsRelations = relations(intentVariations, ({ one }) => ({
  intent: one(intents, { fields: [intentVariations.intentId], references: [intents.id] }),
}));

export const suggestionsRelations = relations(suggestions, ({ one }) => ({
  post: one(posts, { fields: [suggestions.postId], references: [posts.id] }),
  intent: one(intents, { fields: [suggestions.intentId], references: [intents.id] }),
  approver: one(users, { fields: [suggestions.approvedBy], references: [users.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
});

export const insertIntegrationSchema = createInsertSchema(integrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  fetchedAt: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  fetchedAt: true,
});

export const insertIntentSchema = createInsertSchema(intents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSuggestionSchema = createInsertSchema(suggestions).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;

export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Intent = typeof intents.$inferSelect;
export type InsertIntent = z.infer<typeof insertIntentSchema>;

export type Suggestion = typeof suggestions.$inferSelect;
export type InsertSuggestion = z.infer<typeof insertSuggestionSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type WebhookEvent = typeof webhookEvents.$inferSelect;
