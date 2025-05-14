import { Hono } from "hono";
import { Env } from "../db/client";
import { getDbClient } from "../helpers/dbClient";
import { careActivities, skills } from "../db/migrations/schema";
import { count, desc, eq, sum } from "drizzle-orm";

export const portfolioRoutes = new Hono<{ Bindings: Env }>();

portfolioRoutes.get("/summary", async (c) => {
  console.log("ポートフォリオデータ取得APIが呼び出されました");
  const db = getDbClient(c);
  const summary = await db
    .select({
      totalHours: sum(careActivities.duration),
      totalActivities: count(),
    })
    .from(careActivities)
    .where(eq(careActivities.userId, 1)); // ユーザーIDを1に固定（仮）

  const topSkills = await db
    .select({
      skillName: skills.name,
      skillCount: skills.count,
    })
    .from(skills)
    .where(eq(skills.userId, 1)) // ユーザーIDを1に固定（仮）
    .orderBy(desc(skills.count))
    .limit(4);

  return c.json({
    summary: summary[0] || { totalHours: 0, totalActivities: 0 },
    topSkills: topSkills || [],
  });
});
