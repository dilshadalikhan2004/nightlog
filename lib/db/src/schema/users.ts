import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  bio: text("bio").notNull().default(""),
  nights_count: integer("nights_count").notNull().default(0),
  memories_count: integer("memories_count").notNull().default(0),
  circles_count: integer("circles_count").notNull().default(0),
  vibe_label: text("vibe_label").notNull().default(""),
  avatar_gradient: text("avatar_gradient").notNull().default("linear-gradient(135deg,#8b6fff,#00d4ff)"),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, created_at: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
