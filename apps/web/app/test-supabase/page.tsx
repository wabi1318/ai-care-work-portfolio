"use client";

import { useState } from "react";

interface TestResult {
  success?: boolean;
  message?: string;
  data?: any;
  error?: string;
  details?: string;
}

export default function TestSupabasePage() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTestConnection = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/activities/save");
      const data: TestResult = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "APIリクエストエラー");
      }
      setResult(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "不明なエラー";
      setResult({ error: "接続テストに失敗しました", details: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Supabase 接続テスト</h1>
      <button onClick={handleTestConnection} disabled={loading}>
        {loading ? "テスト中..." : "接続テスト実行"}
      </button>

      {result && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2>テスト結果:</h2>
          {result.success ? (
            <p style={{ color: "green" }}>✅ {result.message}</p>
          ) : (
            <p style={{ color: "red" }}>❌ {result.error}</p>
          )}
          {result.details && (
            <p style={{ color: "red" }}>詳細: {result.details}</p>
          )}
          {result.data && (
            <div>
              <h3>取得データ (最初の1件):</h3>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  backgroundColor: "#eee",
                  padding: "10px",
                  borderRadius: "3px",
                }}
              >
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
