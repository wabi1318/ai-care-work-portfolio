import { NextResponse } from "next/server";
import { generateUnicornStory } from "../../../../../packages/api/llm/example";

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    // 環境変数からAPIキーを取得
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OpenAI APIキーが設定されていません。環境変数を確認してください。",
        },
        { status: 500 }
      );
    }

    const result = await generateUnicornStory(input, apiKey);

    if (!result.success) {
      return NextResponse.json(
        { error: "ユニコーンの物語生成に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      text: result.text,
    });
  } catch (error: unknown) {
    console.error("ユニコーンストーリーAPI エラー:", error);
    return NextResponse.json(
      {
        error: "リクエスト処理中にエラーが発生しました",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
