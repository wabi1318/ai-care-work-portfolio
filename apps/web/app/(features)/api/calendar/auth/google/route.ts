import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Google OAuth設定
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/calendar/auth/google/callback`;

// 認証URLを生成
export async function GET() {
  const scope = encodeURIComponent(
    "https://www.googleapis.com/auth/calendar.readonly"
  );
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  return NextResponse.json({ authUrl });
}

// 認証コールバック
export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "認証コードがありません" },
        { status: 400 }
      );
    }

    // トークン取得
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("トークン取得エラー:", tokenData);
      return NextResponse.json(
        { error: "Google認証に失敗しました" },
        { status: 500 }
      );
    }

    // Cookieにトークンを保存（セキュリティ対策を本番環境では強化すること）
    (
      await // Cookieにトークンを保存（セキュリティ対策を本番環境では強化すること）
      cookies()
    ).set("google_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenData.expires_in,
      path: "/",
    });

    if (tokenData.refresh_token) {
      (await cookies()).set("google_refresh_token", tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30日
        path: "/",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Google認証エラー:", error);
    return NextResponse.json(
      { error: "認証処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
