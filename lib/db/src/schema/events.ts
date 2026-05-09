import { pgTable, serial, text, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  venue: text("venue").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  energy_score: integer("energy_score").notNull().default(80),
  attendee_count: integer("attendee_count").notNull().default(0),
  starts_at: text("starts_at").notNull(),
  ends_at: text("ends_at"),
  color_theme: text("color_theme").notNull().default("linear-gradient(135deg,#8b6fff,#ff4d9a)"),
  joined: boolean("joined").notNull().default(false),
  distance_km: real("distance_km"),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(eventsTable).omit({ id: true, created_at: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof eventsTable.$inferSelect;
