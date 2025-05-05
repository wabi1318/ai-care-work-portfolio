import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { date, activity_content, duration, problem, emotion, result } =
      await req.json();

    // 必須フィールドの検証
    if (!date || !activity_content || !duration) {
      return NextResponse.json(
        { error: "必須フィールド（日付・活動内容・所要時間）が不足しています" },
        { status: 400 }
      );
    }

    // LLMプロンプト構築
    const prompt = `
あなたは職務経歴書作成支援の専門家です。ユーザーの日々の家庭内ケア記録から、職場で活かせるスキルを分析し、履歴書に記載可能な表現を出力してください。

以下は家庭内ケア活動の記録です。これをもとに、次の情報を出力してください：

---
日付: ${date}
活動内容: ${activity_content}
所要時間: ${duration}分
課題: ${problem || "特になし"}
感情: ${emotion || "記録なし"}
成果: ${result || "記録なし"}
---

出力:
1. 発揮されたスキルカテゴリ（3件程度）とそれぞれの熟練度（高い／中程度／要向上）
2. 職務経歴書向け文例（2〜3文、箇条書き）

以下の形式でJSONを返してください：
{
  "skills": [
    { "name": "スキル名", "proficiency": "熟練度" },
    { "name": "スキル名", "proficiency": "熟練度" },
    { "name": "スキル名", "proficiency": "熟練度" }
  ],
  "resume_summary": [
    "履歴書向け文例1",
    "履歴書向け文例2",
    "履歴書向け文例3"
  ]
}
`;

    // OpenAI APIリクエスト
    const { text: resultText } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      temperature: 0.3,
    });

    // 結果のパース
    try {
      const result = JSON.parse(resultText);

      // TODO: ここでデータベース保存処理を追加
      // Supabaseなどのクライアントを使用して保存
      console.log(result);

      // 保存完了後、結果を返す
      return NextResponse.json({
        success: true,
        activity: {
          date,
          activity_content,
          duration,
          problem,
          emotion,
          result,
        },
        analysis: result,
      });
    } catch (parseError) {
      console.error("JSON解析エラー:", parseError);
      return NextResponse.json(
        { error: "LLM結果の解析に失敗しました", details: parseError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("活動登録エラー:", error);
    return NextResponse.json(
      { error: "活動の登録・分析に失敗しました", details: error.message },
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
          emotion: "焦ったが冷静に対応",
          result: "時間通り送り届けた",
          skills: [
            { name: "時間管理能力", proficiency: "高い" },
            { name: "問題解決能力", proficiency: "中程度" },
            { name: "マルチタスク管理能力", proficiency: "高い" },
          ],
          resume_summary: [
            "限られた時間の中で家庭内のタスクを調整し、送迎を計画的に実行",
            "予定変更への柔軟な対応を行い、業務の優先度を調整した",
          ],
        },
      ],
    });
  } catch (error) {
    console.error("活動取得エラー:", error);
    return NextResponse.json(
      { error: "活動の取得に失敗しました", details: error.message },
      { status: 500 }
    );
  }
}
