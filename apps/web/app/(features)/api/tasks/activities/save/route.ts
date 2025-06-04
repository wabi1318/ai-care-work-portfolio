import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// ケア活動をデータベースに保存するAPI
export async function POST(request: Request) {
  try {
    const { activities } = await request.json();

    // 活動データの検証
    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "活動データがありません",
        },
        { status: 400 }
      );
    }

    // 各活動のデータベース保存結果
    const results = [];

    // 各活動を保存（ここでは模擬的な保存処理）
    for (const activity of activities) {
      try {
        // 実際のプロジェクトではデータベース保存ロジックを実装
        // ここでは成功したと仮定

        // 本来はここでデータベースに保存する処理を実装
        // 例: await db.insert('care_activities').values(activity)

        console.log(`活動を保存しました: ${activity.activity_content}`);

        results.push({
          success: true,
          activity,
          message: "活動を保存しました",
        });
      } catch (error) {
        console.error(
          `活動「${activity.activity_content}」の保存エラー:`,
          error
        );
        results.push({
          success: false,
          activity,
          error: error instanceof Error ? error.message : "保存に失敗しました",
        });
      }
    }

    // 関連パスのキャッシュを再検証
    revalidatePath("/activities");
    revalidatePath("/portfolio");
    revalidatePath("/dashboard");

    return NextResponse.json({
      success: true,
      savedCount: results.filter((r) => r.success).length,
      results,
    });
  } catch (error) {
    console.error("ケア活動保存エラー:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "活動の保存に失敗しました",
      },
      { status: 500 }
    );
  }
}
