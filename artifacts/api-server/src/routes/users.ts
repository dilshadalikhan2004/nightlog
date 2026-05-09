import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateMyProfileBody } from "@workspace/api-zod";

const router = Router();

const MY_USER_ID = 1;

router.get("/users/me", async (req, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, MY_USER_ID));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    req.log.error({ err }, "Failed to get profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/users/me", async (req, res) => {
  try {
    const body = UpdateMyProfileBody.safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: "Invalid request body" });
    const [user] = await db
      .update(usersTable)
      .set(body.data)
      .where(eq(usersTable.id, MY_USER_ID))
      .returning();
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    req.log.error({ err }, "Failed to update profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await db.select().from(usersTable);
    res.json(users);
  } catch (err) {
    req.log.error({ err }, "Failed to list users");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
