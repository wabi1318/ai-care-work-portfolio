"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@workspace/ui/hooks/use-toast";

interface ActivityFormProps {
  apiEndpoint: string;
  onSuccess?: () => void;
}

export default function ActivityForm({
  apiEndpoint,
  onSuccess,
}: ActivityFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    activity_content: "",
    duration: 60,
    problem: "",
    solution: "",
    emotion: "",
    result: "",
    description: "",
  });

  // フォーム入力の処理
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // セレクトボックスの変更処理
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, emotion: value }));
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 必須フィールドの検証
    if (!formData.problem || !formData.solution || !formData.result) {
      toast({
        title: "入力エラー",
        description: "発生した課題、解決策、成果や家族の反応は必須項目です",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // APIリクエスト
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "活動の登録に失敗しました");
      }

      const result = await response.json();

      toast({
        title: "活動を分析しました",
      });

      // 分析結果をローカルストレージに保存
      localStorage.setItem("activityAnalysisResult", JSON.stringify(result));

      // 分析結果ページに遷移
      router.push("/activity-analysis");
    } catch (error) {
      console.error("活動登録エラー:", error);
      toast({
        title: "エラーが発生しました",
        description:
          error instanceof Error
            ? error.message
            : "予期せぬエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>新しいケア活動を記録</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 日付 */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="date">日付</Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* 活動内容 */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="activity_content">活動内容</Label>
            <Textarea
              id="activity_content"
              name="activity_content"
              placeholder="例：子どもを保育園に送迎した"
              value={formData.activity_content}
              onChange={handleChange}
              required
              className="min-h-[100px]"
            />
          </div>

          {/* 所要時間 */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="duration">所要時間（分）</Label>
            <Input
              type="number"
              id="duration"
              name="duration"
              min={1}
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>

          {/* 課題 */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="problem">発生した課題</Label>
            <Textarea
              id="problem"
              name="problem"
              placeholder="例：朝起きられず準備が遅れた"
              value={formData.problem}
              onChange={handleChange}
              required
              className="min-h-[80px]"
            />
          </div>

          {/* 解決策 */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="solution">解決策</Label>
            <Textarea
              id="solution"
              name="solution"
              placeholder="例：前日に服や持ち物を準備しておいた"
              value={formData.solution}
              onChange={handleChange}
              required
              className="min-h-[80px]"
            />
          </div>

          {/* 感情 */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="emotion">感情・気分（任意）</Label>
            <Select onValueChange={handleSelectChange} value={formData.emotion}>
              <SelectTrigger>
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="選択なし">選択なし</SelectItem>
                <SelectItem value="喜び">喜び</SelectItem>
                <SelectItem value="焦り">焦り</SelectItem>
                <SelectItem value="不安">不安</SelectItem>
                <SelectItem value="充実">充実</SelectItem>
                <SelectItem value="疲労">疲労</SelectItem>
                <SelectItem value="冷静">冷静</SelectItem>
                <SelectItem value="イライラ">イライラ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 結果 */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="result">成果や家族の反応</Label>
            <Textarea
              id="result"
              name="result"
              placeholder="例：時間通り送り届けることができた"
              value={formData.result}
              onChange={handleChange}
              required
              className="min-h-[80px]"
            />
          </div>

          {/* 送信ボタン */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                分析中...
              </>
            ) : (
              "活動を記録してスキル分析"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
