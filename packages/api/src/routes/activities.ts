import { Hono } from "hono";
import { Env } from "../db/client.js";
import { getDbClient } from "../helpers/dbClient.js";
import {
  careActivities,
  activitySkills,
  skills,
} from "../db/migrations/schema.js";
import { eq } from "drizzle-orm";

export const activitiesRoutes = new Hono<{ Bindings: Env }>()
  // 活動一覧取得
  .get("/activities", async (c) => {
    const db = getDbClient(c);
    const allActivities = await db.select().from(careActivities);

    return c.json({
      success: true,
      data: allActivities,
    });
  })
  // 活動登録
  .post("/activities", async (c) => {
    try {
      const body = await c.req.json();
      const { activity, analysis, confirmed } = body;

      // 必須フィールドの検証
      if (!activity || !analysis || !confirmed) {
        return c.json(
          {
            success: false,
            error:
              "必須データ（活動情報・分析結果・確認フラグ）が不足しています",
          },
          400
        );
      }

      const db = getDbClient(c);

      // 仮のユーザーID（実際の実装では認証から取得）
      const userId = 1;

      // 職務経歴書向け文例をJSONに変換
      const resumeSummary = JSON.stringify(analysis.resume_summary);

      // 活動を保存
      const [savedActivity] = await db
        .insert(careActivities)
        .values({
          userId,
          date: activity.date,
          activityContent: activity.activity_content,
          duration: activity.duration,
          problem: activity.problem || null,
          solution: activity.solution || null,
          emotion: activity.emotion || null,
          result:
            typeof activity.result === "object"
              ? JSON.stringify(activity.result)
              : activity.result || null,
          resumeSummary,
        })
        .returning();

      if (!savedActivity) {
        throw new Error("活動の保存に失敗しました");
      }

      // スキルの保存
      for (const skillData of analysis.skills) {
        // スキル名でスキルを検索
        let [existingSkill] = await db
          .select()
          .from(skills)
          .where(eq(skills.name, skillData.name));

        // スキルが存在しない場合は新規作成
        if (!existingSkill) {
          [existingSkill] = await db
            .insert(skills)
            .values({
              name: skillData.name,
              category: "自動検出", // デフォルトカテゴリ
            })
            .returning();
        }

        if (!existingSkill) {
          console.error(`スキル「${skillData.name}」の登録に失敗しました`);
          continue;
        }

        // アクティビティとスキルの関連付け
        await db.insert(activitySkills).values({
          activityId: savedActivity.id,
          skillId: existingSkill.id,
          tendency: skillData.tendency,
          relevance: skillData.relevance,
          reason: skillData.reason,
          source: "LLM分析", // ソース情報
        });
      }

      return c.json({
        success: true,
        message: "活動とスキル分析結果を保存しました",
        data: {
          activityId: savedActivity.id,
        },
      });
    } catch (error: unknown) {
      console.error("活動保存エラー:", error);
      const errorMessage =
        error instanceof Error ? error.message : "不明なエラー";

      return c.json(
        {
          success: false,
          error: "活動の保存に失敗しました",
          details: errorMessage,
        },
        500
      );
    }
  });
