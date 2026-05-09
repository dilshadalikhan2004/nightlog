import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const memoriesTable = pgTable("memories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  energy_score: integer("energy_score").notNull().default(85),
  night_date: text("night_date").notNull(),
  moments_count: integer("moments_count").notNull().default(0),
  vibe_matches: integer("vibe_matches").notNull().default(0),
  status: text("status").notNull().default("ready"),
  event_id: integer("event_id"),
  created_at: timestamp("created_at").defaultNow(),
});

export const timelineItemsTable = pgTable("timeline_items", {
  id: serial("id").primaryKey(),
  memory_id: integer("memory_id").notNull(),
  label: text("label").notNull(),
  description: text("description").notNull(),
  time: text("time").notNull(),
  order: integer("order").notNull().default(0),
});

export const insertMemorySchema = createInsertSchema(memoriesTable).omit({ id: true, created_at: true });
export type InsertMemory = z.infer<typeof insertMemorySchema>;
export type Memory = typeof memoriesTable.$inferSelect;
export type TimelineItem = typeof timelineItemsTable.$inferSelect;
