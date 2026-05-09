import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const invitesTable = pgTable("invites", {
  id: serial("id").primaryKey(),
  event_id: integer("event_id").notNull(),
  event_title: text("event_title").notNull(),
  sender_name: text("sender_name").notNull(),
  recipient_username: text("recipient_username").notNull(),
  status: text("status").notNull().default("pending"),
  starts_at: text("starts_at").notNull(),
  attendee_count: integer("attendee_count").notNull().default(0),
  message: text("message"),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertInviteSchema = createInsertSchema(invitesTable).omit({ id: true, created_at: true });
export type InsertInvite = z.infer<typeof insertInviteSchema>;
export type Invite = typeof invitesTable.$inferSelect;
