"use client";

import { useState } from "react";
import { Button } from "../../../../packages/ui/src/components/button";
import { Input } from "../../../../packages/ui/src/components/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../packages/ui/src/components/card";

export default function UnicornStoryPage() {
  const [input, setInput] = useState(
    "ユニコーンについての短いおやすみ話を書いてください。"
  );
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateStory = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/unicorn-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "APIリクエストに失敗しました");
      }

      const data = await response.json();
      setStory(data.text);
    } catch (error) {
      console.error("エラー:", error);
      setError(
        error instanceof Error
          ? error.message
          : "物語の生成中にエラーが発生しました。もう一度お試しください。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        ユニコーン物語ジェネレーター
      </h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>プロンプトを入力してください</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="プロンプトを入力..."
              className="w-full"
            />

            {story && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-lg">{story}</p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
                <p>{error}</p>
                {error.includes("APIキー") && (
                  <p className="mt-2 text-sm">
                    注意: このアプリケーションを実行するには、OpenAI
                    APIキーが必要です。
                    <code className="bg-gray-100 px-1 rounded">
                      apps/web/.env.local
                    </code>
                    ファイルに
                    <code className="bg-gray-100 px-1 rounded">
                      OPENAI_API_KEY=あなたのAPIキー
                    </code>
                    を 設定してください。
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={generateStory}
            disabled={isLoading || !input.trim()}
            className="w-full"
          >
            {isLoading ? "生成中..." : "物語を生成"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
