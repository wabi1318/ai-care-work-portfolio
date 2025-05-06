import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Supabase接続用のクライアント作成
async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Componentからの呼び出し時のエラーを無視
          }
        },
      },
    }
  );
}

// Supabase接続テスト用のエンドポイント
export async function GET() {
  try {
    const supabase = await createClient();

    // user テーブルをクエリしてみる
    const { data, error } = await supabase.from("users").select();

    console.log(data, error);
    if (error) {
      throw new Error(`Supabase接続エラー: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      message: "Supabase接続テスト成功",
      data,
    });
  } catch (error: unknown) {
    console.error("Supabase接続テストエラー:", error);
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json(
      { error: "Supabase接続テストに失敗しました", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // リクエストボディを解析
    const { activity, analysis, confirmed } = await req.json();

    // 必須データの検証
    if (!activity || !analysis || confirmed === undefined) {
      return NextResponse.json(
        { error: "必須データが不足しています" },
        { status: 400 }
      );
    }

    // 追加の必須フィールドの検証
    if (!activity.problem || !activity.solution || !activity.result) {
      return NextResponse.json(
        {
          error:
            "必須フィールド（発生した課題・解決策・成果や家族の反応）が不足しています",
        },
        { status: 400 }
      );
    }

    // ここでデータベースに保存する処理を実装
    // 例: Supabaseクライアントを使用して保存
    /*
    const { data, error } = await supabaseClient
      .from('activities')
      .insert({
        date: activity.date,
        activity_content: activity.activity_content,
        duration: activity.duration,
        problem: activity.problem,
        solution: activity.solution,
        emotion: activity.emotion,
        result: activity.result,
        skills: analysis.skills,
        resume_summary: analysis.resume_summary,
        confirmed: confirmed
      });
    
    if (error) {
      throw new Error(`データベース保存エラー: ${error.message}`);
    }
    */

    // 仮の成功レスポンス（実際の実装では上記のコメントアウト部分を使用）
    console.log("保存されたデータ:", { activity, analysis, confirmed });

    return NextResponse.json({
      success: true,
      message: "活動が正常に保存されました",
      // id: data?.id // 実際のデータベース実装時に使用
    });
  } catch (error: unknown) {
    console.error("保存処理エラー:", error);
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json(
      { error: "活動の保存に失敗しました", details: errorMessage },
      { status: 500 }
    );
  }
}
