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

    // 各活動を処理
    const savedActivities = await Promise.all(
      activities.map(async (activity: CareActivity) => {
        // 日付の形式を変換（YYYY-MM-DD形式）
        const startDate = new Date(activity.start);
        const formattedDate = startDate.toISOString().split("T")[0];

        // 問題と解決策の初期値
        const problem = "カレンダーから自動抽出されたため詳細未記入";
        const solution = "カレンダーから自動抽出されたため詳細未記入";
        const emotion = "記録なし";
        const result = "カレンダーから自動抽出されたため詳細未記入";

        // 活動データの整形
        const activityData = {
          date: formattedDate,
          activity_content: activity.description,
          duration: activity.durationMinutes,
          problem,
          solution,
          emotion,
          result,
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
