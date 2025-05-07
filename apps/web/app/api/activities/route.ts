import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const {
      date,
      activity_content,
      duration,
      problem,
      solution,
      emotion,
      result,
    } = await req.json();

    // 必須フィールドの検証
    if (!date || !activity_content || !duration) {
      return NextResponse.json(
        { error: "必須フィールド（日付・活動内容・所要時間）が不足しています" },
        { status: 400 }
      );
    }

    // 追加の必須フィールドの検証
    if (!problem || !solution || !result) {
      return NextResponse.json(
        {
          error:
            "必須フィールド（発生した課題・解決策・成果や家族の反応）が不足しています",
        },
        { status: 400 }
      );
    }

    // システムメッセージとユーザーメッセージの構築
    const systemMessage = `あなたは、家庭内のケア活動を職務経歴書向けに翻訳する支援者です。
ユーザーの活動記録から、どのようなスキルが表れていたかを読み取り、以下のような形で出力してください。
評価や点数付けはせず、活動の文脈の中にどのようなスキルが見られるか、どの程度関連性があるかを示してください。`;

    const userMessage = `以下は家庭内ケア活動の記録です。
この記録をもとに、次の情報を出力してください：

---
日付: ${date}
活動内容: ${activity_content}
所要時間: ${duration}分
課題: ${problem}
解決策: ${solution}
感情: ${emotion || "特になし"}
成果: ${result}
---

出力フォーマット:
1. 発揮されたスキルリスト（最大3件）
    - スキル名
    - 発揮傾向（例：強く見られる／よく見られる／少し見られる）
    - 活動との関連性の高さ（高い／中程度／低い）
    - 補足説明（なぜそのスキルが表れていると判断できるか、簡潔に）

2. 職務経歴書向け文例（2～3文、箇条書き）

以下の形式でJSONを返してください：
{
  "skills": [
    {
      "name": "スキル名",
      "tendency": "発揮傾向",
      "relevance": "関連性の高さ",
      "reason": "補足説明"
    }
  ],
  "resume_summary": [
    "履歴書向け文例1",
    "履歴書向け文例2"
  ]
}`;

    // OpenAI APIリクエスト
    const { text: resultText } = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemMessage,
      prompt: userMessage,
      temperature: 0.3,
    });

    // 結果のパース
    try {
      const result = JSON.parse(resultText);

      return NextResponse.json({
        success: true,
        activity: {
          date,
          activity_content,
          duration,
          problem,
          solution,
          emotion,
          result,
        },
        analysis: result,
      });
    } catch (parseError: unknown) {
      console.error("JSON解析エラー:", parseError);
      const errorMessage =
        parseError instanceof Error ? parseError.message : "不明なエラー";
      return NextResponse.json(
        { error: "LLM結果の解析に失敗しました", details: errorMessage },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("活動登録エラー:", error);
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json(
      { error: "活動の登録・分析に失敗しました", details: errorMessage },
      { status: 500 }
    );
  }
}

// 全活動を取得するAPI
export async function GET(req: Request) {
  try {
    // TODO: ユーザー認証とデータベースからの活動取得処理

    // 仮のデータを返す（実際の実装ではデータベースから取得）
    return NextResponse.json({
      activities: [
        {
          id: "1",
          date: "2025-05-03",
          activity_content: "子どもを保育園に送迎した",
          duration: 90,
          problem: "朝起きられず時間が押した",
          solution: "前日に服や持ち物を準備しておいた",
          emotion: "焦ったが冷静に対応",
          result: "時間通り送り届けた",
          skills: [
            {
              name: "時間管理",
              tendency: "強く見られる",
              relevance: "高い",
              reason: "朝の遅れに対応しつつ、予定通り送迎を完了している",
            },
            {
              name: "先見性と準備力",
              tendency: "よく見られる",
              relevance: "高い",
              reason: "前日に準備をしておくことで時間のリスクに対処している",
            },
            {
              name: "感情制御",
              tendency: "よく見られる",
              relevance: "中程度",
              reason: "焦った状況でも冷静に対応したと記述がある",
            },
          ],
          resume_summary: [
            "時間変更に柔軟に対応し、家庭内のスケジュール調整を的確に実行",
            "先を見越した準備と問題解決能力で効率的なタスク管理を実現",
          ],
        },
      ],
    });
  } catch (error: unknown) {
    console.error("活動取得エラー:", error);
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json(
      { error: "活動の取得に失敗しました", details: errorMessage },
      { status: 500 }
    );
  }
}
