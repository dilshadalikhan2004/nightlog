import { Router } from "express";
import { db } from "@workspace/db";
import { memoriesTable, timelineItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateMemoryBody,
  GetMemoryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/memories", async (req, res) => {
  try {
    const memories = await db.select().from(memoriesTable).orderBy(memoriesTable.created_at);
    res.json(memories.reverse());
  } catch (err) {
    req.log.error({ err }, "Failed to list memories");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/memories", async (req, res) => {
  try {
    const body = CreateMemoryBody.safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: "Invalid request body" });
    const [memory] = await db.insert(memoriesTable).values({
      ...body.data,
      energy_score: 80 + Math.floor(Math.random() * 19),
      moments_count: Math.floor(Math.random() * 20) + 5,
      vibe_matches: Math.floor(Math.random() * 30) + 5,
      status: "ready",
    }).returning();
    res.status(201).json({ ...memory, timeline: [] });
  } catch (err) {
    req.log.error({ err }, "Failed to create memory");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/memories/:id", async (req, res) => {
  try {
    const params = GetMemoryParams.safeParse({ id: Number(req.params.id) });
    if (!params.success) return res.status(400).json({ error: "Invalid id" });
    const [memory] = await db.select().from(memoriesTable).where(eq(memoriesTable.id, params.data.id));
    if (!memory) return res.status(404).json({ error: "Memory not found" });
    const timeline = await db
      .select()
      .from(timelineItemsTable)
      .where(eq(timelineItemsTable.memory_id, params.data.id))
      .orderBy(timelineItemsTable.order);
    res.json({ ...memory, timeline });
  } catch (err) {
    req.log.error({ err }, "Failed to get memory");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
