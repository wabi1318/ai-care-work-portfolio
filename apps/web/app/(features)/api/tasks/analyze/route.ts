// import { NextResponse } from "next/server";
// import OpenAI from "openai";

// // OpenAIのAPIキーが設定されているか確認
// if (!process.env.OPENAI_API_KEY) {
//   throw new Error("OPENAI_API_KEY is not set");
// }

// // OpenAIクライアントのインスタンス化
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // タスクをケア活動として分析するAPI
// export async function POST(request: Request) {
//   try {
//     const { tasks } = await request.json();

//     // タスクがないか、空の配列の場合
//     if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "タスクデータがありません",
//         },
//         { status: 400 }
//       );
//     }

//     // OpenAIを使用してタスクからケア活動を抽出
//     const careActivities = await extractCareActivitiesFromTasks(tasks);

//     return NextResponse.json({
//       success: true,
//       careActivities,
//     });
//   } catch (error) {
//     console.error("タスク分析エラー:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           error instanceof Error ? error.message : "タスクの分析に失敗しました",
//       },
//       { status: 500 }
//     );
//   }
// }

// // タスクからケア活動を抽出する関数
// async function extractCareActivitiesFromTasks(tasks: any[]) {
//   // 関連するケア活動と思われるタスクを抽出するプロンプト
//   const prompt = `
//   あなたはケア活動の分析AIアシスタントです。以下のタスクリストを分析して、ケア活動（育児、介護、家族のサポートなど）に関連するタスクを特定してください。

//   各ケア活動について、以下の情報を抽出してください：
//   1. タスクのタイトル
//   2. タスクの説明（ケア活動としての解釈）
//   3. 関連するスキル（コミュニケーション、時間管理、問題解決、マルチタスク能力など）
//   4. 活動の推定所要時間（分単位）

//   タスクリスト:
//   ${JSON.stringify(tasks, null, 2)}

//   レスポンスは以下のJSON形式で返してください：
//   {
//     "careActivities": [
//       {
//         "id": "一意のID",
//         "taskTitle": "タスクのタイトル",
//         "description": "ケア活動としての説明",
//         "skills": ["スキル1", "スキル2", ...],
//         "duration": "活動時間の文字列表現（例：30分）",
//         "durationMinutes": 活動時間（分）,
//         "due": "期限日時（元データから）",
//         "completed": タスクが完了しているかどうかのブール値,
//         "updated": "更新日時（元データから）"
//       },
//       ...
//     ]
//   }

//   ケア活動に関連しないタスクは除外してください。確実にケア活動と判断できるタスクのみを抽出してください。
//   `;

//   // OpenAIのAPIを使用して分析
//   const response = await openai.chat.completions.create({
//     model: "gpt-4",
//     messages: [
//       {
//         role: "system",
//         content: "あなたはケア活動を分析するAIアシスタントです。",
//       },
//       {
//         role: "user",
//         content: prompt,
//       },
//     ],
//     response_format: { type: "json_object" },
//   });

//   // レスポンスのパース
//   const content = response.choices[0].message.content;
//   if (!content) {
//     throw new Error("AIからのレスポンスが空です");
//   }

//   try {
//     const parsedContent = JSON.parse(content);
//     return parsedContent.careActivities || [];
//   } catch (error) {
//     console.error("AIレスポンスのJSONパースエラー:", error, content);
//     throw new Error("AIレスポンスの解析に失敗しました");
//   }
// }
