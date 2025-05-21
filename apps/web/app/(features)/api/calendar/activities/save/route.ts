import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // リクエストボディからデータを取得
    const { activities } = await request.json();

    // バリデーション
    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return NextResponse.json(
        { success: false, message: "有効な活動データが提供されていません" },
        { status: 400 }
      );
    }

    // リクエストデータのログ出力
    console.log("送信データ:", JSON.stringify(activities, null, 2));

    // APIエンドポイントにデータを送信
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787/api";
    const apiEndpoint = "/activities"; // 既存の activities エンドポイントを使用
    const fullUrl = `${apiUrl}${apiEndpoint}`;

    console.log("API URL:", fullUrl);
    console.log(`${activities.length}件のアクティビティを保存します`);

    // 複数のアクティビティを保存した結果を格納する配列
    const results = [];

    // 各アクティビティを1つずつ処理するループ
    for (const activity of activities) {
      try {
        // 単一アクティビティ用のフォーマットに変換
        const requestBody = {
          activity: {
            date: activity.date,
            activity_content: activity.activity_content,
            // 数値形式に変換: "60分" -> 60
            duration:
              parseInt(String(activity.duration).replace(/[^0-9]/g, ""), 10) ||
              0,
            problem: activity.problem,
            solution: activity.solution,
            emotion: activity.emotion,
            result: activity.result,
          },
          analysis: {
            skills: activity.skills || [],
            resume_summary: activity.resume_summary || [],
          },
          confirmed: true,
        };

        console.log(`活動「${activity.activity_content}」を保存中...`);

        // APIリクエスト送信
        const response = await fetch(fullUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          // エラーレスポンスの詳細を取得して表示
          try {
            const errorData = await response.text();
            console.error(
              `活動「${activity.activity_content}」の保存に失敗:`,
              errorData
            );
          } catch (readError) {
            console.error("Failed to read error response:", readError);
          }

          results.push({
            success: false,
            activity,
            error: `API response error: ${response.status}`,
          });
          continue;
        }

        const data = await response.json();

        if (!data.success) {
          results.push({
            success: false,
            activity,
            error: "APIからのレスポンスが成功ではありません",
          });
          continue;
        }

        console.log(`活動「${activity.activity_content}」の保存に成功`);
        results.push({
          success: true,
          activity,
          data: data.data,
        });
      } catch (error) {
        console.error(
          `活動「${activity.activity_content}」の保存中にエラー:`,
          error
        );
        results.push({
          success: false,
          activity,
          error: error instanceof Error ? error.message : "不明なエラー",
        });
      }
    }

    // すべての結果を確認
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    return NextResponse.json({
      success: successCount > 0,
      message: `${successCount}件の活動を保存しました${failureCount > 0 ? `（${failureCount}件は失敗）` : ""}`,
      results,
    });
  } catch (error: unknown) {
    console.error("カレンダーケア活動保存エラー:", error);
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json(
      {
        success: false,
        error: "カレンダーからのケア活動の保存に失敗しました",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
