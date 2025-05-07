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
import TopHeader from "@/components/TopHeader";
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
      <TopHeader />

      {/* メインコンテンツ */}
      <main className="container mx-auto py-8 px-4 md:px-6">
        {/* 戻るリンク */}
        <div className="mb-6">
          <Link
            href="/activity-log"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={20} />
            <span>活動入力に戻る</span>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">
                {activity.date}の活動分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="text-xs text-gray-500">活動内容</Label>
                  <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[100px] whitespace-pre-wrap">
                    {activity.activity_content}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">所要時間</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md min-w-[40px] text-center">
                        {hours}
                      </div>
                      <span>時間</span>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md min-w-[40px] text-center">
                        {minutes}
                      </div>
                      <span>分</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">
                    検出されたスキル
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2 p-2 border border-gray-200 rounded-md bg-gray-50">
                    {limitedSkills.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="bg-white">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-medium text-gray-900 mb-4">
                    詳細な分析結果:
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <h4 className="font-medium p-4 border-b border-gray-200">
                      「{activity.activity_content.substring(0, 30)}...」の分析
                    </h4>
                    <SkillAnalysisResult
                      skills={limitedSkills}
                      resumeExamples={resumeExamples}
                      activityDescription={activity.activity_content}
                    />
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
