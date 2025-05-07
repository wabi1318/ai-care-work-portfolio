import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     // APIエンドポイントからユーザーデータを取得
//     const apiUrl =
//       process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787/api";
//     const apiEndpoint = "/users";
//     const fullUrl = `${apiUrl}${apiEndpoint}`;

//     console.log("API呼び出しURL:", fullUrl);

//     const response = await fetch(fullUrl);

//     if (!response.ok) {
//       throw new Error(`API response error: ${response.status}`);
//     }

//     const data = await response.json();

//     if (!data.success) {
//       throw new Error("APIからのレスポンスが成功ではありません");
//     }

//     const usersData = data.data;

//     // データが取得できたか確認
//     console.log("取得したユーザーデータ:", usersData);

//     if (!usersData || usersData.length === 0) {
//       console.log("ユーザーデータが見つかりませんでした");
//     }

//     return NextResponse.json({
//       success: true,
//       message: "ユーザーデータ取得成功",
//       data: usersData,
//     });
//   } catch (error: unknown) {
//     console.error("ユーザーデータ取得エラー:", error);
//     const errorMessage =
//       error instanceof Error ? error.message : "不明なエラー";
//     return NextResponse.json(
//       { error: "ユーザーデータの取得に失敗しました", details: errorMessage },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    // リクエストボディからデータを取得
    const activityData = await request.json();

    // バリデーション
    if (!activityData) {
      return NextResponse.json(
        { success: false, message: "活動データが提供されていません" },
        { status: 400 }
      );
    }

    // APIエンドポイントにデータを送信
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787/api";
    const apiEndpoint = "/activities";
    const fullUrl = `${apiUrl}${apiEndpoint}`;

    console.log("活動データ保存 API呼び出しURL:", fullUrl);
    console.log("送信するデータ:", activityData);

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activityData),
    });

    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error("APIからのレスポンスが成功ではありません");
    }

    return NextResponse.json({
      success: true,
      message: "ケア労働分析結果の保存に成功しました",
      data: data.data,
    });
  } catch (error: unknown) {
    console.error("ケア労働分析結果保存エラー:", error);
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json(
      {
        success: false,
        error: "ケア労働分析結果の保存に失敗しました",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
