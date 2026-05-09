import { Router } from "express";
import { db } from "@workspace/db";
import { messagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { SendMessageBody, ListMessagesQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/messages", async (req, res) => {
  try {
    const query = ListMessagesQueryParams.safeParse(req.query);
    let messages;
    if (query.success && query.data.event_id) {
      messages = await db
        .select()
        .from(messagesTable)
        .where(eq(messagesTable.event_id, query.data.event_id))
        .orderBy(messagesTable.sent_at);
    } else {
      messages = await db.select().from(messagesTable).orderBy(messagesTable.sent_at);
    }
    res.json(
      messages.map((m) => ({
        ...m,
        sent_at: m.sent_at?.toISOString() ?? new Date().toISOString(),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list messages");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/messages", async (req, res) => {
  try {
    const body = SendMessageBody.safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: "Invalid request body" });
    const [message] = await db
      .insert(messagesTable)
      .values({
        content: body.data.content,
        sender_name: "You",
        is_own: true,
        event_id: body.data.event_id ?? null,
      })
      .returning();
    res.status(201).json({
      ...message,
      sent_at: message.sent_at?.toISOString() ?? new Date().toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to send message");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
