import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  sender_name: text("sender_name").notNull(),
  is_own: boolean("is_own").notNull().default(false),
  event_id: integer("event_id"),
  sent_at: timestamp("sent_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messagesTable).omit({ id: true, sent_at: true });
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messagesTable.$inferSelect;
