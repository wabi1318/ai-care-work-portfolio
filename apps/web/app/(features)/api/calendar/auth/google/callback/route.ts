import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

// Google OAuth設定
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/calendar/auth/google/callback`;

export async function GET(request: NextRequest) {
  try {
    // URLからコードを取得
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (!code) {
      // エラーの場合はカレンダー設定ページにリダイレクト（エラーパラメータ付き）
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/calendar/settings?error=認証コードがありません`
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
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/calendar/settings?error=Google認証に失敗しました`
      );
    }

    // Cookieにトークンを保存
    (
      await // Cookieにトークンを保存
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

    // 接続状態を保存
    (
      await // 接続状態を保存
      cookies()
    ).set("calendar_connected", "true", {
      httpOnly: false, // フロントエンドからアクセス可能にする
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30日
      path: "/",
    });

    // 成功したらカレンダー設定ページにリダイレクト
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/calendar/settings?success=true`
    );
  } catch (error) {
    console.error("Google認証エラー:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/calendar/settings?error=認証処理中にエラーが発生しました`
    );
  }
}
