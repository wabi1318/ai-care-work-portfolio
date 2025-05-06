import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "メッセージが提供されていません" },
        { status: 400 }
      );
    }

    // システムプロンプトを作成
    const systemPrompt = `
あなたはユーザーの1日の行動をヒアリングし、その中に含まれるケア労働や支援行動を抽出し、スキル分類するアシスタントです。
たとえユーザーが"ケア"だと自覚していなくても、感情的サポート、段取り力、家族支援、家事、育児、介護などがあれば抽出してください。

会話は自然に進めてください。ユーザーの話を聞き、共感し、適切な質問をして詳細を引き出してください。
十分な情報が集まったと判断したら、ケア活動の抽出と分析を行ってください。

ケア活動を抽出する際は、以下のフォーマットで返してください：

1. 自然な会話の応答（ユーザーへの返信）
2. 抽出したケア活動の要約（日本語で）
3. 以下のJSON形式でケア活動の詳細：

\`\`\`json
{
  "careActivities": [
    {
      "description": "活動の詳細な説明",
      "type": "活動タイプ", // childcare(育児), eldercare(高齢者ケア), healthcare(医療サポート), emotional(感情的サポート), household(家事管理), education(教育サポート), cooking(料理), other(その他)
      "skills": ["スキル1", "スキル2", ...], // 例: "マルチタスク", "問題解決", "コミュニケーション", "感情的サポート", "時間管理", "対立解決", "危機管理", "忍耐力", "適応力", "調整力", "交渉力", "教育力"
      "duration": "推定所要時間" // 例: "1時間30分", "45分" など（オプション）
    },
    // 他の活動...
  ]
}
\`\`\`

JSONは必ず上記の形式で返してください。ユーザーの会話から十分な情報が得られない場合は、careActivitiesは空の配列を返してください。
`;

    // ユーザーの最新メッセージを取得
    const userMessage = messages[messages.length - 1].content;

    // OpenAI APIを使用して応答を生成
    const { text: resultText } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userMessage,
      temperature: 0.7,
    });

    // 応答からJSONを抽出
    let message = resultText;
    let careActivities = [];

    const jsonMatch = resultText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const jsonData = JSON.parse(jsonMatch[1]);
        careActivities = jsonData.careActivities || [];

        // JSONを除いたメッセージ部分を抽出
        message = resultText.replace(/```json\n[\s\S]*?\n```/, "").trim();
      } catch (error) {
        console.error("JSON解析エラー:", error);
      }
    }

    return NextResponse.json({
      message,
      careActivities,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "チャット処理に失敗しました", details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        error: "チャット処理に失敗しました",
        details: "不明なエラーが発生しました",
      },
      { status: 500 }
    );
  }
}
