import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const fullUrl = `${apiUrl}/summary`;

    const response = await fetch(fullUrl);

    if (!response.ok) {
      console.error(`API応答エラー: ${response.status}`);
      throw new Error(`API response error: ${response.status}`);
    }

    const data = await response.json();
    console.log("バックエンドAPIからのデータ:", data);

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("ポートフォリオ取得エラー:", error);
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json(
      { error: "ポートフォリオの取得に失敗しました", details: errorMessage },
      { status: 500 }
    );
  }
}

// ポートフォリオのエクスポート
export async function POST(req: Request) {
  try {
    const { format, sections } = await req.json();

    if (!format || !sections) {
      return NextResponse.json(
        { error: "エクスポート形式とセクションの指定が必要です" },
        { status: 400 }
      );
    }

    // TODO: 実際のエクスポート機能実装（PDF生成など）

    return NextResponse.json({
      success: true,
      message: `${format}形式でのエクスポートが完了しました`,
      download_url: `/exports/portfolio_${Date.now()}.${format}`,
    });
  } catch (error: unknown) {
    console.error("エクスポートエラー:", error);
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json(
      {
        error: "ポートフォリオのエクスポートに失敗しました",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
