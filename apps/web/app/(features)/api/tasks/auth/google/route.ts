import { NextResponse } from "next/server";

// スコープの設定
const SCOPES = [
  "https://www.googleapis.com/auth/tasks",
  "https://www.googleapis.com/auth/tasks.readonly",
];

// Google Task認証URLを生成するエンドポイント
export async function GET() {
  try {
    // 環境変数のチェック
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error("GOOGLE_CLIENT_ID environment variable is not set");
    }

    // リダイレクトURLの設定
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/tasks/auth/google/callback`;

    // OAuth認証URLの構築
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.append("client_id", process.env.GOOGLE_CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", redirectUri);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", SCOPES.join(" "));
    authUrl.searchParams.append("access_type", "offline");
    authUrl.searchParams.append("prompt", "consent");

    // フロントエンドに認証URLを返す
    return NextResponse.json({
      success: true,
      authUrl: authUrl.toString(),
    });
  } catch (error) {
    console.error("Google Task認証URLの生成エラー:", error);
    return NextResponse.json(
      {
        success: false,
        error: "認証URLの生成に失敗しました",
      },
      { status: 500 }
    );
  }
}
