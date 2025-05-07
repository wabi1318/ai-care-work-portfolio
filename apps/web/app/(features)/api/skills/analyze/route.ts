// import { NextResponse } from "next/server";
// import { generateText } from "ai";
// import { openai } from "@ai-sdk/openai";

// export async function POST(req: Request) {
//   try {
//     const { activity_content, problem, emotion, result } = await req.json();

//     // 必須フィールドの検証
//     if (!activity_content) {
//       return NextResponse.json(
//         { error: "活動内容が提供されていません" },
//         { status: 400 }
//       );
//     }

//     // プロンプト構築
//     const prompt = `
// あなたは職務経歴書作成支援の専門家です。ユーザーの家庭内ケア記録から、職場で活かせるスキルを分析し、履歴書に記載可能な表現を出力してください。

// 以下は家庭内ケア活動の記録です：

// ---
// 活動内容: ${activity_content}
// 課題: ${problem || "特になし"}
// 感情: ${emotion || "記録なし"}
// 成果: ${result || "記録なし"}
// ---

// 出力:
// 1. 発揮されたスキルカテゴリ（3件程度）とそれぞれの熟練度（高い／中程度／要向上）
// 2. 職務経歴書向け文例（2〜3文、箇条書き）

// 以下の形式でJSONを返してください：
// {
//   "skills": [
//     { "name": "スキル名", "proficiency": "熟練度" },
//     { "name": "スキル名", "proficiency": "熟練度" },
//     { "name": "スキル名", "proficiency": "熟練度" }
//   ],
//   "resume_summary": [
//     "履歴書向け文例1",
//     "履歴書向け文例2",
//     "履歴書向け文例3"
//   ]
// }
// `;

//     // OpenAI APIリクエスト
//     const { text: resultText } = await generateText({
//       model: openai("gpt-4-turbo"),
//       prompt,
//       temperature: 0.3,
//     });

//     // 結果のパース
//     try {
//       const result = JSON.parse(resultText);

//       return NextResponse.json({
//         success: true,
//         analysis: result,
//       });
//     } catch (parseError) {
//       console.error("JSON解析エラー:", parseError);
//       return NextResponse.json(
//         { error: "LLM結果の解析に失敗しました", details: parseError.message },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("スキル分析エラー:", error);
//     return NextResponse.json(
//       { error: "スキル分析に失敗しました", details: error.message },
//       { status: 500 }
//     );
//   }
// }
