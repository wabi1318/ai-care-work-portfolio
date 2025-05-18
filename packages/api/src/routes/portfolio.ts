import { Hono } from "hono";
import { Env } from "../db/client";
import { getDbClient } from "../helpers/dbClient";
import {
  careActivities,
  skills,
  activitySkills,
} from "../db/migrations/schema";
import { count, desc, eq, sum, sql, and } from "drizzle-orm";

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
      skillId: skills.id,
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

  // 各スキルの具体的なエピソード（reasons）を取得
  const skillsWithEpisodes = await Promise.all(
    topSkills.map(async (skill) => {
      // スキルに関連するactivity_skillsからreasonとactivityIdを取得
      const relatedReasons = await db
        .select({
          reason: activitySkills.reason,
          activityId: activitySkills.activityId,
        })
        .from(activitySkills)
        .where(eq(activitySkills.skillId, Number(skill.skillId)));

      // 関連するアクティビティの詳細情報を取得
      const activitiesDetails = await Promise.all(
        relatedReasons.map(async (item) => {
          if (!item.activityId) return null;

          const [activity] = await db
            .select({
              activityContent: careActivities.activityContent,
              problem: careActivities.problem,
              solution: careActivities.solution,
              result: careActivities.result,
            })
            .from(careActivities)
            .where(eq(careActivities.id, Number(item.activityId)));

          return {
            reason: item.reason,
            activityDetails: activity || null,
          };
        })
      );

      // スキル情報とエピソードを合わせて返す
      return {
        ...skill,
        episodes: activitiesDetails.filter(Boolean),
      };
    })
  );

  console.log(skillsWithEpisodes);

  return c.json({
    summary: summary[0] || { totalHours: 0, totalActivities: 0 },
    topSkills: skillsWithEpisodes || [],
  });
});
