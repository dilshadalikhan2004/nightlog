import { Router } from "express";
import { db } from "@workspace/db";
import { invitesTable, eventsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateInviteBody,
  AcceptInviteParams,
  DeclineInviteParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/invites", async (req, res) => {
  try {
    const invites = await db.select().from(invitesTable).orderBy(invitesTable.created_at);
    res.json(invites.reverse());
  } catch (err) {
    req.log.error({ err }, "Failed to list invites");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/invites", async (req, res) => {
  try {
    const body = CreateInviteBody.safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: "Invalid request body" });
    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, body.data.event_id));
    if (!event) return res.status(404).json({ error: "Event not found" });
    const [invite] = await db.insert(invitesTable).values({
      event_id: body.data.event_id,
      event_title: event.title,
      sender_name: "You",
      recipient_username: body.data.recipient_username,
      message: body.data.message ?? null,
      status: "pending",
      starts_at: event.starts_at,
      attendee_count: event.attendee_count,
    }).returning();
    res.status(201).json(invite);
  } catch (err) {
    req.log.error({ err }, "Failed to create invite");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/invites/:id/accept", async (req, res) => {
  try {
    const params = AcceptInviteParams.safeParse({ id: Number(req.params.id) });
    if (!params.success) return res.status(400).json({ error: "Invalid id" });
    const [invite] = await db
      .update(invitesTable)
      .set({ status: "accepted" })
      .where(eq(invitesTable.id, params.data.id))
      .returning();
    if (!invite) return res.status(404).json({ error: "Invite not found" });
    res.json(invite);
  } catch (err) {
    req.log.error({ err }, "Failed to accept invite");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/invites/:id/decline", async (req, res) => {
  try {
    const params = DeclineInviteParams.safeParse({ id: Number(req.params.id) });
    if (!params.success) return res.status(400).json({ error: "Invalid id" });
    const [invite] = await db
      .update(invitesTable)
      .set({ status: "declined" })
      .where(eq(invitesTable.id, params.data.id))
      .returning();
    if (!invite) return res.status(404).json({ error: "Invite not found" });
    res.json(invite);
  } catch (err) {
    req.log.error({ err }, "Failed to decline invite");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
