import { NextResponse } from "next/server";
import OpenAI from "openai";

// OpenAIのAPIキーが設定されているか確認
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

// OpenAIクライアントのインスタンス化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ケア活動を分析してスキルと職務経歴を抽出するAPI
export async function POST(request: Request) {
  try {
    const { activities } = await request.json();

    // 活動データの検証
    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "活動データがありません",
        },
        { status: 400 }
      );
    }

    // 各活動の分析結果
    const results = [];

    // 各活動を分析
    for (const activity of activities) {
      try {
        const analysis = await analyzeActivity(activity);
        results.push({
          success: true,
          activity,
          analysis,
        });
      } catch (error) {
        console.error(
          `活動「${activity.activity_content}」の分析エラー:`,
          error
        );
        results.push({
          success: false,
          activity,
          error: error instanceof Error ? error.message : "分析に失敗しました",
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("ケア活動分析エラー:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "活動の分析に失敗しました",
      },
      { status: 500 }
    );
  }
}

// 活動を分析する関数
async function analyzeActivity(activity: any) {
  const prompt = `
  あなたは、ケア活動（介護・育児・家族支援）から職業スキルを抽出するAI専門家です。以下のケア活動を分析し、含まれる職業スキルと職務経歴書に使える文例を抽出してください。

  ## ケア活動の内容
  - 活動内容: ${activity.activity_content}
  - 発生した課題: ${activity.problem || "記載なし"}
  - 実施した解決策: ${activity.solution || "記載なし"}
  - 感情・気分: ${activity.emotion || "記載なし"}
  - 成果・家族の反応: ${activity.result || "記載なし"}
  - 活動時間: ${activity.duration || "不明"}

  ## 分析して抽出すること
  1. この活動に含まれる職業スキル（5つまで）
    - スキル名
    - スキルレベル（初級/中級/上級）
    - 職場での応用例

  2. 職務経歴書に使える文例（3つ）
    - 簡潔で具体的な文章で、ビジネスシーンでも通用する表現にしてください
    - 主語は「私は」で開始してください
    - それぞれ違う角度からスキルを表現してください

  ## 出力形式
  結果は以下のJSON形式で返してください：
  {
    "skills": [
      {
        "name": "スキル名",
        "level": "スキルレベル",
        "application": "職場での応用例"
      }
    ],
    "resume_summary": ["文例1", "文例2", "文例3"]
  }
  `;

  // OpenAIのAPIを使用して分析
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "あなたはケア活動から職業スキルを分析する専門家です。",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  // レスポンスのパース
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("AIからのレスポンスが空です");
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    console.error("AIレスポンスのJSONパースエラー:", error, content);
    throw new Error("AIレスポンスの解析に失敗しました");
  }
}
