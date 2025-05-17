import { Hono } from "hono";
import { Env } from "../db/client";
import { getDbClient } from "../helpers/dbClient";
import { careActivities, skills } from "../db/migrations/schema";
import { count, desc, eq, sum } from "drizzle-orm";

export const portfolioRoutes = new Hono<{ Bindings: Env }>();

portfolioRoutes.get("/summary", async (c) => {
  const db = getDbClient(c);

  // 仮のユーザーID（実際の実装では認証から取得）
  const userId = 1;

  // アクティビティの集計データ取得
  const summary = await db
    .select({
      totalHours: sum(careActivities.duration),
      totalActivities: count(),
    })
    .from(careActivities)
    .where(eq(careActivities.userId, userId));

  // トップスキルの取得
  const topSkills = await db
    .select({
      skillName: skills.name,
      skillCount: skills.count,
      skillDescription: skills.description,
      skillIcon: skills.icon,
      skillTendency: skills.tendency,
    })
    .from(skills)
    .where(eq(skills.userId, userId))
    .orderBy(desc(skills.count))
    .limit(4);

  console.log(topSkills);

  return c.json({
    summary: summary[0] || { totalHours: 0, totalActivities: 0 },
    topSkills: topSkills || [],
  });
});
