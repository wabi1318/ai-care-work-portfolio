"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Badge } from "@workspace/ui/components/badge";
import TopHeader from "@/app/components/TopHeader";
import SkillAnalysisResult, {
  SkillAnalysis,
  ResumeExample,
} from "@/app/components/SkillAnalysisResult";

import { useToast } from "@workspace/ui/hooks/use-toast";

export default function ActivityAnalysis() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<{
    activity: {
      date: string;
      activity_content: string;
      duration: number;
      problem?: string;
      solution?: string;
      emotion?: string;
      result?: string;
    };
    analysis: {
      skills: SkillAnalysis[];
      resume_summary: string[];
    };
  } | null>(null);

  useEffect(() => {
    // ローカルストレージから分析データを取得
    const storedData = localStorage.getItem("activityAnalysisResult");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setAnalysisData(parsedData);
      } catch (error) {
        console.error("分析データの解析エラー:", error);
        toast({
          title: "エラーが発生しました",
          description: "分析結果の読み込みに失敗しました",
          variant: "destructive",
        });
        router.push("/activity-log");
      }
    } else {
      // データがない場合は入力ページにリダイレクト
      toast({
        title: "データがありません",
        description: "活動データを入力してください",
      });
      router.push("/activity-log");
    }
    setIsLoading(false);
  }, [router, toast]);

  if (isLoading || !analysisData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-gray-400" />
          <p className="mt-2 text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  const { activity, analysis } = analysisData;

  // スキル分析結果を最大3件に制限
  const limitedSkills = analysis.skills.slice(0, 3);

  // 時間と分に変換
  const hours = Math.floor(activity.duration / 60);
  const minutes = activity.duration % 60;

  // 職務経歴書向け文例をResumeExampleの形式に変換
  const resumeExamples: ResumeExample[] = analysis.resume_summary.map(
    (text) => ({ text })
  );

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // DB保存用のAPIエンドポイント
      const response = await fetch("/api/activities/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activity: activity,
          analysis: analysis,
          confirmed: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "活動の保存に失敗しました");
      }

      toast({
        title: "活動を保存しました",
        description: "分析結果とともに記録されました",
      });

      // 保存成功後、ローカルストレージをクリアして活動一覧ページへ
      localStorage.removeItem("activityAnalysisResult");
      router.push("/activities");
    } catch (error) {
      console.error("保存エラー:", error);
      toast({
        title: "エラーが発生しました",
        description:
          error instanceof Error
            ? error.message
            : "予期せぬエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <TopHeader title="活動分析" showBackButton={true} />

      {/* メインコンテンツ */}
      <main className="container mx-auto py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">
                {activity.date}の活動分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 入力された活動セクション */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        入力された活動
                      </h3>
                      <p className="text-sm text-gray-500">
                        活動の詳細情報と振り返り
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-white p-4 space-y-6">
                      {/* 活動内容 */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          活動内容
                        </Label>
                        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[100px] whitespace-pre-wrap">
                          {activity.activity_content}
                        </div>
                      </div>

                      {/* 所要時間 */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          所要時間
                        </Label>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg min-w-[50px] text-center font-medium text-gray-900">
                            {hours}
                          </div>
                          <span className="text-gray-600">時間</span>
                          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg min-w-[50px] text-center font-medium text-gray-900">
                            {minutes}
                          </div>
                          <span className="text-gray-600">分</span>
                        </div>
                      </div>

                      {/* 発生した課題 */}
                      {activity.problem && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            発生した課題
                          </Label>
                          <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[80px] whitespace-pre-wrap">
                            {activity.problem}
                          </div>
                        </div>
                      )}

                      {/* 解決策 */}
                      {activity.solution && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            解決策
                          </Label>
                          <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[80px] whitespace-pre-wrap">
                            {activity.solution}
                          </div>
                        </div>
                      )}

                      {/* 感情・気分 */}
                      {activity.emotion && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            感情・気分
                          </Label>
                          <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[80px] whitespace-pre-wrap">
                            {activity.emotion}
                          </div>
                        </div>
                      )}

                      {/* 成果や家族の反応 */}
                      {activity.result && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            成果や家族の反応
                          </Label>
                          <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[80px] whitespace-pre-wrap">
                            {activity.result}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        活動分析結果
                      </h3>
                      <p className="text-sm text-gray-500">
                        この活動から抽出されたスキルと経験の分析
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-b border border-gray-200 rounded-xl  overflow-hidden">
                    <div className="grid gap-6">
                      <div>
                        <div className="bg-white p-4 rounded-lg border border-gray-100">
                          <SkillAnalysisResult
                            skills={limitedSkills}
                            resumeExamples={resumeExamples}
                            activityDescription={activity.activity_content}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ボタン */}
                <div className="pt-4 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/activity-log")}
                  >
                    キャンセル
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      "活動を保存"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
