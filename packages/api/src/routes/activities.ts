import { Hono } from "hono";
import { Env } from "../db/client";
import { getDbClient } from "../helpers/dbClient";
import {
  careActivities,
  activitySkills,
  skills,
} from "../db/migrations/schema";
import { eq } from "drizzle-orm";

export const activitiesRoutes = new Hono<{ Bindings: Env }>()
  // スキル一覧取得
  .get("/skills", async (c) => {
    try {
      const db = getDbClient(c);
      const allSkills = await db.select().from(skills);
      console.log(allSkills);

      return c.json({
        success: true,
        data: allSkills,
      });
    } catch (error: unknown) {
      console.error("スキル取得エラー:", error);
      const errorMessage =
        error instanceof Error ? error.message : "不明なエラー";

      return c.json(
        {
          success: false,
          error: "スキルの取得に失敗しました",
          details: errorMessage,
        },
        500
      );
    }
  })
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

        // スキルが存在する場合はカウントを+1更新
        if (existingSkill) {
          const currentCount = existingSkill.count
            ? Number(existingSkill.count)
            : 0;
          const newCount = currentCount + 1;

          console.log(
            `スキル「${skillData.name}」のカウントを更新: ${currentCount} → ${newCount}`
          );

          await db
            .update(skills)
            .set({ count: newCount })
            .where(eq(skills.id, existingSkill.id))
            .returning();

          // 更新後のスキル情報を取得
          [existingSkill] = await db
            .select()
            .from(skills)
            .where(eq(skills.id, existingSkill.id));

          console.log(`更新後のスキル情報:`, existingSkill);
        } else {
          // スキルが存在しない場合は新規作成（countを1で初期化）
          [existingSkill] = await db
            .insert(skills)
            .values({
              name: skillData.name,
              category: "自動検出", // デフォルトカテゴリ
              count: 1, // 初回利用で1を設定
              description: skillData.description || null, // 説明文を保存
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
