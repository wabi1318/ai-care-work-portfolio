import { Hono } from "hono";
import { Env } from "../db/client.js";
import { getDbClient } from "../helpers/dbClient.js";
import { users } from "../db/migrations/schema.js";

export const usersRoutes = new Hono<{ Bindings: Env }>()
  // 記事一覧取得
  .get("/users", async (c) => {
    const db = getDbClient(c);
    const allUsers = await db.select().from(users);

    return c.json({
      success: true,
      data: allUsers,
    });
  });
