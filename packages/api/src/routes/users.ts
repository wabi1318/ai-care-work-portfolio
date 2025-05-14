import { Hono } from "hono";
import { Env } from "../db/client";
import { getDbClient } from "../helpers/dbClient";
import { users } from "../db/migrations/schema";
import { eq } from "drizzle-orm";
export const usersRoutes = new Hono<{ Bindings: Env }>()
  // 記事一覧取得
  .get("/users", async (c) => {
    const db = getDbClient(c);
    const allUsers = await db.select().from(users);

    return c.json({
      success: true,
      data: allUsers,
    });
  })
  .get("/users/:id", async (c) => {
    const db = getDbClient(c);
    const { id } = c.req.param();
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(id)));
    return c.json({ success: true, data: user });
  });
