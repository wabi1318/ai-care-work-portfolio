import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Google Taskの認証コールバック処理
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // エラーがある場合
    if (error) {
      console.error(`認証エラー: ${error}`);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/tasks/settings?error=${encodeURIComponent(
          "Googleアカウントへのアクセスが拒否されました"
        )}`
      );
    }

    // 認証コードがない場合
    if (!code) {
      console.error("認証コードがありません");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/tasks/settings?error=${encodeURIComponent(
          "認証情報が不足しています"
        )}`
      );
    }

    // 認証コードをアクセストークンに交換
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/tasks/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(`トークン取得エラー: ${errorText}`);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/tasks/settings?error=${encodeURIComponent(
          "認証処理中にエラーが発生しました"
        )}`
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Cookieにトークンを保存（30日間）
    const cookieStore = cookies();
    (await cookieStore).set("google_tasks_access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expires_in,
      path: "/",
    });

    if (refresh_token) {
      (await cookieStore).set("google_tasks_refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30日間
        path: "/",
      });
    }

    // 連携成功フラグを設定
    (
      await // 連携成功フラグを設定
      cookieStore
    ).set("tasks_connected", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30日間
      path: "/",
    });

    // 成功画面にリダイレクト
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/tasks/settings?success=true`
    );
  } catch (error) {
    console.error("認証コールバックエラー:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/tasks/settings?error=${encodeURIComponent(
        "認証処理中にエラーが発生しました"
      )}`
    );
  }
}
