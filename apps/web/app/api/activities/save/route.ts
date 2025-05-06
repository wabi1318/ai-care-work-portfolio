import { NextResponse } from "next/server";
import { db } from "@workspace/api";
import { users } from "@workspace/api/drizzle/schema";

// Drizzle接続テスト用のエンドポイント
export async function GET() {
  try {
    // Drizzle ORMを使ってusersテーブルをクエリ
    const usersData = await db.select().from(users);

    // データが取得できたか確認
    console.log("取得したユーザーデータ:", usersData);

    if (!usersData || usersData.length === 0) {
      console.log("ユーザーデータが見つかりませんでした");
    }

    return NextResponse.json({
      success: true,
      message: "Drizzle ORM接続テスト成功",
      data: usersData,
    });
  } catch (error: unknown) {
    console.error("データベース接続テストエラー:", error);
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json(
      { error: "データベース接続テストに失敗しました", details: errorMessage },
      { status: 500 }
    );
  }
}
