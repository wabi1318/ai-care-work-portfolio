"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ArrowLeft,
  Calendar,
  CheckSquare,
  Loader2,
  Settings,
} from "lucide-react";
import { toast } from "@workspace/ui/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Label } from "@workspace/ui/components/label";
import Sidebar from "@/app/components/Sidebar";
import TopHeader from "@/app/components/TopHeader";

// 実際の設定コンポーネント
function IntegratedSettingsContent() {
  // カレンダー設定
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarDays, setCalendarDays] = useState("7");

  // タスク設定
  const [tasksConnected, setTasksConnected] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksDays, setTasksDays] = useState("7");

  const searchParams = useSearchParams();

  // ページロード時の処理
  useEffect(() => {
    // 接続状態をCookieから取得
    const calendarStatus = getCookie("calendar_connected");
    const tasksStatus = getCookie("tasks_connected");
    setCalendarConnected(calendarStatus === "true");
    setTasksConnected(tasksStatus === "true");

    // URLパラメータからの成功/エラーメッセージ処理
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const type = searchParams.get("type");

    if (success) {
      const serviceName = type === "tasks" ? "Google Task" : "Googleカレンダー";
      toast({
        title: `${serviceName}と連携しました`,
        description: `${serviceName}との連携が完了しました。`,
      });
    }

    if (error) {
      toast({
        title: "連携に失敗しました",
        description: error,
        variant: "destructive",
      });
    }
  }, [searchParams]);

  // Googleカレンダーとの連携
  const handleConnectCalendar = async () => {
    setCalendarLoading(true);

    try {
      const response = await fetch("/api/calendar/auth/google");
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error("認証URLの取得に失敗しました");
      }
    } catch (error) {
      console.error("連携エラー:", error);
      toast({
        title: "連携に失敗しました",
        description:
          "Googleカレンダーとの連携に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
      setCalendarLoading(false);
    }
  };

  // Google Taskとの連携
  const handleConnectTasks = async () => {
    setTasksLoading(true);

    try {
      const response = await fetch("/api/tasks/auth/google");
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error("認証URLの取得に失敗しました");
      }
    } catch (error) {
      console.error("連携エラー:", error);
      toast({
        title: "連携に失敗しました",
        description:
          "Google Taskとの連携に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
      setTasksLoading(false);
    }
  };

  // カレンダー連携の解除
  const handleDisconnectCalendar = async () => {
    setCalendarLoading(true);

    try {
      document.cookie =
        "google_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "google_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "calendar_connected=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      setCalendarConnected(false);

      toast({
        title: "連携を解除しました",
        description: "Googleカレンダーとの連携を解除しました。",
      });
    } catch (error) {
      console.error("連携解除エラー:", error);
      toast({
        title: "連携解除に失敗しました",
        description:
          "Googleカレンダーとの連携解除に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setCalendarLoading(false);
    }
  };

  // タスク連携の解除
  const handleDisconnectTasks = async () => {
    setTasksLoading(true);

    try {
      document.cookie =
        "google_tasks_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "google_tasks_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "tasks_connected=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      setTasksConnected(false);

      toast({
        title: "連携を解除しました",
        description: "Google Taskとの連携を解除しました。",
      });
    } catch (error) {
      console.error("連携解除エラー:", error);
      toast({
        title: "連携解除に失敗しました",
        description:
          "Google Taskとの連携解除に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setTasksLoading(false);
    }
  };

  // カレンダー取得日数設定の保存
  const handleSaveCalendarDays = () => {
    setCookie("calendar_days", calendarDays);
    toast({
      title: "設定を保存しました",
      description: `カレンダーの取得日数を${calendarDays}日に設定しました。`,
    });
  };

  // タスク取得日数設定の保存
  const handleSaveTasksDays = () => {
    setCookie("tasks_days", tasksDays);
    toast({
      title: "設定を保存しました",
      description: `タスクの取得日数を${tasksDays}日に設定しました。`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <TopHeader
          title="設定"
          showBackButton={false}
          showActionButton={true}
        />

        <main className="py-8 px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Googleカレンダー連携カード */}
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Googleカレンダー連携</CardTitle>
                    <CardDescription>
                      カレンダーと連携して、予定からケア活動を自動的に抽出します
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* 接続状態 */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full ${calendarConnected ? "bg-green-500" : "bg-gray-300"}`}
                      />
                      <div>
                        <h3 className="font-medium">接続状態</h3>
                        <p className="text-sm text-gray-500">
                          {calendarConnected
                            ? "Googleカレンダーと連携中"
                            : "未接続"}
                        </p>
                      </div>
                    </div>
                    {!calendarConnected ? (
                      <Button
                        onClick={handleConnectCalendar}
                        disabled={calendarLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {calendarLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            接続中...
                          </>
                        ) : (
                          <>
                            <Calendar className="mr-2 h-4 w-4" />
                            接続する
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={handleDisconnectCalendar}
                        disabled={calendarLoading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {calendarLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            解除中...
                          </>
                        ) : (
                          "連携を解除"
                        )}
                      </Button>
                    )}
                  </div>

                  {/* 説明文 */}
                  <div className="space-y-2 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                    <p>• 直近1週間の予定のタイトルと時間のみを取得します</p>
                    <p>
                      • 予定の内容はAIによる分析のみに使用され、保存されません
                    </p>
                    <p>
                      • カレンダーの予定は読み取り専用で、変更は一切行いません
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Task連携カード */}
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CheckSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Google Task連携</CardTitle>
                    <CardDescription>
                      Google
                      Taskと連携して、タスクからケア活動を自動的に抽出します
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* 接続状態 */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full ${tasksConnected ? "bg-green-500" : "bg-gray-300"}`}
                      />
                      <div>
                        <h3 className="font-medium">接続状態</h3>
                        <p className="text-sm text-gray-500">
                          {tasksConnected ? "Google Taskと連携中" : "未接続"}
                        </p>
                      </div>
                    </div>
                    {!tasksConnected ? (
                      <Button
                        onClick={handleConnectTasks}
                        disabled={tasksLoading}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {tasksLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            接続中...
                          </>
                        ) : (
                          <>
                            <CheckSquare className="mr-2 h-4 w-4" />
                            接続する
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={handleDisconnectTasks}
                        disabled={tasksLoading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {tasksLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            解除中...
                          </>
                        ) : (
                          "連携を解除"
                        )}
                      </Button>
                    )}
                  </div>

                  {/* 説明文 */}
                  <div className="space-y-2 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                    <p>• 直近1週間のタスクのタイトルと期限のみを取得します</p>
                    <p>
                      • タスクの内容はAIによる分析のみに使用され、保存されません
                    </p>
                    <p>• タスクは読み取り専用で、変更は一切行いません</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

// Suspenseでラップした設定ページ
export default function IntegratedSettings() {
  return (
    <Suspense fallback={<div className="p-8 text-center">読み込み中...</div>}>
      <IntegratedSettingsContent />
    </Suspense>
  );
}
