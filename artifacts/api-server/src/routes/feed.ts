import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable, memoriesTable, messagesTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/feed/stats", async (req, res) => {
  try {
    const events = await db.select().from(eventsTable);
    const memories = await db.select().from(memoriesTable);
    const liveEvents = events.length;
    const peopleOut = events.reduce((sum, e) => sum + e.attendee_count, 0);
    const avgEnergy =
      liveEvents > 0
        ? Math.round(events.reduce((sum, e) => sum + e.energy_score, 0) / liveEvents)
        : 0;
    const memoriesTonight = memories.length;
    res.json({
      live_events: liveEvents,
      people_out: peopleOut,
      avg_energy: avgEnergy,
      memories_tonight: memoriesTonight,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get feed stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/feed/trending", async (req, res) => {
  try {
    const events = await db
      .select()
      .from(eventsTable)
      .orderBy(desc(eventsTable.energy_score))
      .limit(6);
    res.json(events);
  } catch (err) {
    req.log.error({ err }, "Failed to get trending events");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/feed/activity", async (req, res) => {
  try {
    const events = await db
      .select()
      .from(eventsTable)
      .orderBy(desc(eventsTable.energy_score))
      .limit(3);
    const memories = await db
      .select()
      .from(memoriesTable)
      .orderBy(desc(memoriesTable.created_at))
      .limit(2);

    const items: {
      id: number;
      type: string;
      label: string;
      description: string;
      timestamp: string;
    }[] = [];

    events.forEach((e, i) => {
      items.push({
        id: i + 1,
        type: "event",
        label: e.title,
        description: `${e.attendee_count} people attending · Energy ${e.energy_score}%`,
        timestamp: e.starts_at,
      });
    });

    memories.forEach((m, i) => {
      items.push({
        id: events.length + i + 1,
        type: "memory",
        label: m.title,
        description: `${m.moments_count} moments captured · ${m.vibe_matches} vibe matches`,
        timestamp: m.night_date,
      });
    });

    res.json(items);
  } catch (err) {
    req.log.error({ err }, "Failed to get recent activity");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
