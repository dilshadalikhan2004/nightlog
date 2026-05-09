import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListEventsQueryParams,
  CreateEventBody,
  GetEventParams,
  JoinEventParams,
  GetEventEnergyParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/events", async (req, res) => {
  try {
    const query = ListEventsQueryParams.safeParse(req.query);
    const events = await db.select().from(eventsTable).orderBy(eventsTable.energy_score);
    res.json(events.reverse());
  } catch (err) {
    req.log.error({ err }, "Failed to list events");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/events", async (req, res) => {
  try {
    const body = CreateEventBody.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ error: "Invalid request body" });
    }
    const themes = [
      "linear-gradient(135deg,#8b6fff,#ff4d9a)",
      "linear-gradient(135deg,#00d4ff,#8b6fff)",
      "linear-gradient(135deg,#ff4d9a,#f6d67d)",
      "linear-gradient(135deg,#f6d67d,#8b6fff)",
    ];
    const colorTheme = themes[Math.floor(Math.random() * themes.length)];
    const [event] = await db.insert(eventsTable).values({
      ...body.data,
      color_theme: colorTheme,
      energy_score: 75 + Math.floor(Math.random() * 25),
    }).returning();
    res.status(201).json(event);
  } catch (err) {
    req.log.error({ err }, "Failed to create event");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/events/:id", async (req, res) => {
  try {
    const params = GetEventParams.safeParse({ id: Number(req.params.id) });
    if (!params.success) return res.status(400).json({ error: "Invalid id" });
    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, params.data.id));
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    req.log.error({ err }, "Failed to get event");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/events/:id/join", async (req, res) => {
  try {
    const params = JoinEventParams.safeParse({ id: Number(req.params.id) });
    if (!params.success) return res.status(400).json({ error: "Invalid id" });
    const [event] = await db
      .update(eventsTable)
      .set({ joined: true, attendee_count: db.$count(eventsTable) as unknown as number })
      .where(eq(eventsTable.id, params.data.id))
      .returning();

    const [current] = await db.select().from(eventsTable).where(eq(eventsTable.id, params.data.id));
    if (!current) return res.status(404).json({ error: "Event not found" });
    const [updated] = await db
      .update(eventsTable)
      .set({ joined: true, attendee_count: current.attendee_count + 1 })
      .where(eq(eventsTable.id, params.data.id))
      .returning();
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to join event");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/events/:id/energy", async (req, res) => {
  try {
    const params = GetEventEnergyParams.safeParse({ id: Number(req.params.id) });
    if (!params.success) return res.status(400).json({ error: "Invalid id" });
    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, params.data.id));
    if (!event) return res.status(404).json({ error: "Event not found" });
    const liveScore = Math.max(70, Math.min(99, event.energy_score + Math.floor(Math.random() * 6) - 2));
    res.json({
      event_id: event.id,
      score: liveScore,
      attendee_count: event.attendee_count,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get event energy");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
