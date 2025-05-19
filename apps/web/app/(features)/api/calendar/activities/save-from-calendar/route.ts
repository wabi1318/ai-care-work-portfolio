import { NextResponse } from "next/server";

type CareActivity = {
  id: string;
  eventSummary: string;
  description: string;
  type: string;
  typeName: string;
  skills: string[];
  duration: string;
  durationMinutes: number;
  start: string;
  end: string;
  problem?: string;
  solution?: string;
  emotion?: string;
  result?: string;
};

export async function POST(req: Request) {
  try {
    const { activities } = await req.json();

    if (!activities || !Array.isArray(activities)) {
      return NextResponse.json(
        { error: "活動データが正しくありません" },
        { status: 400 }
      );
    }

    // 必須フィールドのバリデーション
    const invalidActivities = activities.filter(
      (activity: CareActivity) =>
        !activity.problem?.trim() ||
        !activity.solution?.trim() ||
        !activity.result?.trim()
    );

    if (invalidActivities.length > 0) {
      return NextResponse.json(
        {
          error: "必須項目が未入力です",
          details: "発生した課題、解決策、成果や家族の反応は必須項目です。",
          invalidIds: invalidActivities.map((activity) => activity.id),
        },
        { status: 400 }
      );
    }

    // 各活動を処理
    const savedActivities = await Promise.all(
      activities.map(async (activity: CareActivity) => {
        // 日付の形式を変換（YYYY-MM-DD形式）
        const startDate = new Date(activity.start);
        const formattedDate = startDate.toISOString().split("T")[0];

        // 活動データの整形
        const activityData = {
          date: formattedDate,
          activity_content: activity.description,
          duration: activity.durationMinutes,
          problem: activity.problem,
          solution: activity.solution,
          emotion: activity.emotion || "記録なし",
          result: activity.result,
          source: "calendar",
          source_id: activity.id,
          source_type: activity.type,
          skills: activity.skills.map((skill) => ({
            name: skill,
            tendency: "見られる",
            relevance: "中程度",
            reason: `${activity.typeName}に関連する活動から推定`,
          })),
        };

        // 実際のアプリケーションではここでデータを保存する処理を行う
        // 例: データベースへの保存

        return {
          id: crypto.randomUUID(), // 実際の実装ではデータベースで生成されるID
          ...activityData,
        };
      })
    );

    return NextResponse.json({
      success: true,
      message: `${savedActivities.length}件の活動を保存しました`,
      activities: savedActivities,
    });
  } catch (error) {
    console.error("活動保存エラー:", error);
    return NextResponse.json(
      { error: "活動の保存に失敗しました" },
      { status: 500 }
    );
  }
}
