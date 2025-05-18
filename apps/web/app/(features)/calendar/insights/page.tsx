"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@workspace/ui/hooks/use-toast";
import { ToastAction } from "@workspace/ui/components/toast";
import { Badge } from "@workspace/ui/components/badge";

// カレンダーイベントの型定義
type CalendarEvent = {
  id: string;
  summary: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
};

// ケア活動候補の型定義
type CareCandidate = {
  id: string;
  eventSummary: string;
  description: string;
  type: string;
  typeName: string;
  skills: string[];
  duration: string;
  durationMinutes: number;
  selected: boolean;
  start: string;
  end: string;
};

export default function CalendarInsights() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [careCandidates, setCareCandidates] = useState<CareCandidate[]>([]);

  const fetchCalendarEvents = async () => {
    setIsLoading(true);

    try {
      // 3日前から昨日までの期間を設定
      const today = new Date();
      const threeDaysAgo = new Date(today);
      threeDaysAgo.setDate(today.getDate() - 3);
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      // クエリパラメータとして期間を設定
      const params = new URLSearchParams({
        timeMin: threeDaysAgo.toISOString(),
        timeMax: yesterday.toISOString(),
      });

      // カレンダーイベントの取得
      const eventsResponse = await fetch(
        `/api/calendar/events?${params.toString()}`
      );

      if (!eventsResponse.ok) {
        const errorData = await eventsResponse.json();
        throw new Error(
          errorData.error || "カレンダーイベントの取得に失敗しました"
        );
      }

      const eventsData = await eventsResponse.json();
      const fetchedEvents = eventsData.events || [];
      setEvents(fetchedEvents);

      // イベントがない場合は早期リターン
      if (fetchedEvents.length === 0) {
        setIsLoading(false);
        return;
      }

      // ケア活動候補の分析
      const analysisResponse = await fetch("/api/calendar/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events: fetchedEvents }),
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        throw new Error(errorData.error || "ケア活動の分析に失敗しました");
      }

      const analysisData = await analysisResponse.json();
      setCareCandidates(analysisData.careActivities || []);
    } catch (error) {
      console.error("カレンダー取得エラー:", error);
      toast({
        title: "カレンダーの取得に失敗しました",
        description:
          error instanceof Error ? error.message : "もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // カレンダーイベントの取得とケア活動の分析
  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  // 候補の選択状態を切り替え
  const toggleCandidateSelection = (id: string) => {
    setCareCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id
          ? { ...candidate, selected: !candidate.selected }
          : candidate
      )
    );
  };

  // 選択された候補を保存
  const saveSelectedCandidates = async () => {
    const selectedCandidates = careCandidates.filter(
      (candidate) => candidate.selected
    );

    if (selectedCandidates.length === 0) {
      toast({
        title: "選択されたケア活動がありません",
        description: "少なくとも1つのケア活動を選択してください。",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // APIを呼び出して選択された活動を保存
      const response = await fetch("/api/activities/save-from-calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activities: selectedCandidates }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "保存に失敗しました");
      }

      const data = await response.json();

      toast({
        title: "活動が記録されました",
        description: `${selectedCandidates.length}件のケア活動が正常に記録されました。`,
        action: (
          <ToastAction altText="活動一覧を見る">
            <Link href="/activities">活動一覧を見る</Link>
          </ToastAction>
        ),
      });

      // 活動一覧ページにリダイレクト
      router.push("/activities");
    } catch (error) {
      console.error("保存エラー:", error);
      toast({
        title: "保存に失敗しました",
        description:
          error instanceof Error ? error.message : "もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 日付をフォーマット
  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/calendar/settings"
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">
              カレンダーからのケア活動抽出
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>予定表からのケア活動</CardTitle>
                  <CardDescription>
                    カレンダーから抽出されたケア活動候補です。確認して保存してください。
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={fetchCalendarEvents}
                  disabled={isLoading}
                >
                  <RefreshCw
                    size={14}
                    className={isLoading ? "animate-spin" : ""}
                  />
                  更新
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-rose-600 animate-spin mb-4" />
                  <p className="text-gray-500">
                    カレンダーからケア活動を抽出しています...
                  </p>
                </div>
              ) : careCandidates.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                    ケア活動が見つかりませんでした
                  </h3>
                  <p className="text-gray-500">
                    カレンダーにケア活動と思われる予定がないか、まだ分析が完了していません。
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {careCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="border border-gray-200 rounded-lg p-4 relative"
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={`candidate-${candidate.id}`}
                            checked={candidate.selected}
                            onCheckedChange={() =>
                              toggleCandidateSelection(candidate.id)
                            }
                            className="mt-1"
                          />
                          <div className="flex flex-col">
                            <Label
                              htmlFor={`candidate-${candidate.id}`}
                              className="font-medium text-gray-800 cursor-pointer mb-1"
                            >
                              {candidate.eventSummary}
                            </Label>

                            <div className="flex items-center text-sm text-gray-600">
                              <Clock size={14} className="mr-1" />
                              <span>
                                {formatTime(candidate.start)} 〜{" "}
                                {formatTime(candidate.end)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button
                      className="bg-rose-600 hover:bg-rose-700"
                      onClick={saveSelectedCandidates}
                      disabled={
                        isSubmitting ||
                        careCandidates.filter((c) => c.selected).length === 0
                      }
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          保存中...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          選択した活動を保存
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                asChild
              >
                <Link href="/activity-log">手動で記録</Link>
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                asChild
              >
                <Link href="/ai-chat">AIと会話して記録</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
