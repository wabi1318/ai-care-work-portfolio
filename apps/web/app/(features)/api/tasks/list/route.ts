import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// タスク一覧を取得するAPI
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeMin = searchParams.get("timeMin");
    const timeMax = searchParams.get("timeMax");

    // アクセストークンの取得
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get(
      "google_tasks_access_token"
    )?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error:
            "アクセストークンがありません。Google Taskに接続してください。",
        },
        { status: 401 }
      );
    }

    // タスクリストの取得（一般的にはデフォルトの'@default'タスクリストを使用）
    const taskListsResponse = await fetch(
      `https://tasks.googleapis.com/tasks/v1/users/@me/lists`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!taskListsResponse.ok) {
      throw new Error(
        `タスクリスト取得エラー: ${taskListsResponse.statusText}`
      );
    }

    const taskListsData = await taskListsResponse.json();
    const taskLists = taskListsData.items || [];

    if (taskLists.length === 0) {
      return NextResponse.json({
        success: true,
        tasks: [],
      });
    }

    // デフォルトタスクリストのID（通常は最初のリストを使用）
    const defaultTaskListId = taskLists[0].id;

    // クエリパラメータの作成
    const queryParams = new URLSearchParams();
    queryParams.append("maxResults", "100"); // 最大取得数

    // 完了済み・未完了両方のタスクを取得
    queryParams.append("showCompleted", "true");
    queryParams.append("showHidden", "true");

    // 期間指定がある場合
    if (timeMin) {
      queryParams.append("dueMin", timeMin);
    }
    if (timeMax) {
      queryParams.append("dueMax", timeMax);
    }

    // タスクの取得
    const tasksResponse = await fetch(
      `https://tasks.googleapis.com/tasks/v1/lists/${defaultTaskListId}/tasks?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!tasksResponse.ok) {
      throw new Error(`タスク取得エラー: ${tasksResponse.statusText}`);
    }

    const tasksData = await tasksResponse.json();
    const tasks = tasksData.items || [];

    return NextResponse.json({
      success: true,
      tasks: tasks,
    });
  } catch (error) {
    console.error("タスク取得エラー:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "タスクの取得に失敗しました",
      },
      { status: 500 }
    );
  }
}
