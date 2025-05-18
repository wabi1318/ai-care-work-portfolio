import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// アクセストークンを更新する関数
async function refreshAccessToken(refreshToken: string) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`トークン更新エラー: ${data.error}`);
    }

    // 新しいアクセストークンをCookieに保存
    (
      await // 新しいアクセストークンをCookieに保存
      cookies()
    ).set("google_access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: data.expires_in,
      path: "/",
    });

    return data.access_token;
  } catch (error) {
    console.error("トークン更新エラー:", error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    // 期間パラメータ取得（デフォルトは3日前から今日まで）
    const timeMin =
      url.searchParams.get("timeMin") ||
      new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const timeMax = url.searchParams.get("timeMax") || new Date().toISOString();

    // アクセストークン取得
    let accessToken = (await cookies()).get("google_access_token")?.value;
    const refreshToken = (await cookies()).get("google_refresh_token")?.value;

    // アクセストークンがない場合
    if (!accessToken) {
      // リフレッシュトークンがある場合は更新を試みる
      if (refreshToken) {
        accessToken = await refreshAccessToken(refreshToken);
      } else {
        return NextResponse.json(
          { error: "認証情報がありません。再度連携してください" },
          { status: 401 }
        );
      }
    }

    // Google Calendar APIからイベント取得
    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // レスポンス処理
    if (calendarResponse.status === 401) {
      // 認証エラーの場合、トークンを更新して再試行
      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);
        const retryResponse = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`,
          {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          }
        );

        if (!retryResponse.ok) {
          const errorData = await retryResponse.json();
          throw new Error(`カレンダーAPI再試行エラー: ${errorData.error}`);
        }

        const calendarData = await retryResponse.json();
        return NextResponse.json({ events: calendarData.items });
      } else {
        // リフレッシュトークンがない場合
        return NextResponse.json(
          { error: "認証の有効期限が切れました。再度連携してください" },
          { status: 401 }
        );
      }
    }

    if (!calendarResponse.ok) {
      const errorData = await calendarResponse.json();
      throw new Error(`カレンダーAPIエラー: ${errorData.error}`);
    }

    const calendarData = await calendarResponse.json();
    return NextResponse.json({ events: calendarData.items });
  } catch (error) {
    console.error("カレンダーイベント取得エラー:", error);
    return NextResponse.json(
      { error: "カレンダーイベントの取得に失敗しました" },
      { status: 500 }
    );
  }
}
