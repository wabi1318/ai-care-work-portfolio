// import { NextResponse } from "next/server"
// import { generateText } from "ai"
// import { openai } from "@ai-sdk/openai"

// export async function POST(req: Request) {
//   try {
//     const { text, date } = await req.json()

//     if (!text) {
//       return NextResponse.json({ error: "テキストが提供されていません" }, { status: 400 })
//     }

//     // OpenAI APIを使用して活動を分析
//     const prompt = `
// あなたはケア活動を分析するAIアシスタントです。以下のテキストからケア活動を抽出し、構造化されたJSONに変換してください。

// テキスト: "${text}"

// 以下の形式でJSONを返してください:
// {
//   "activities": [
//     {
//       "type": "活動タイプ", // childcare(育児), eldercare(高齢者ケア), healthcare(医療サポート), emotional(感情的サポート), household(家事管理), education(教育サポート), cooking(料理), other(その他)
//       "description": "活動の詳細な説明",
//       "duration": "推定所要時間" // 例: "1h 30min", "45min" など
//     },
//     // 他の活動...
//   ]
// }

// 注意:
// - 活動タイプは上記の定義されたカテゴリから最も適切なものを選んでください
// - 時間が明示されていない場合は、活動の性質から合理的な推定をしてください
// - 活動の説明は具体的かつ詳細にしてください
// - 複数の活動が含まれている場合は、それぞれを別々の活動として抽出してください
// - JSONのみを返してください。説明や前置きは不要です。
// `

//     const { text: resultText } = await generateText({
//       model: openai("gpt-4o"),
//       prompt,
//       temperature: 0.2, // より決定論的な結果のために低い温度を設定
//     })

//     // 結果のパース
//     try {
//       const result = JSON.parse(resultText)

//       // 日付を追加
//       if (result && result.activities) {
//         result.activities.forEach((activity) => {
//           activity.date = date
//         })
//       }

//       return NextResponse.json(result)
//     } catch (parseError) {
//       console.error("JSON解析エラー:", parseError)
//       return NextResponse.json({ error: "結果の解析に失敗しました", details: parseError.message }, { status: 500 })
//     }
//   } catch (error) {
//     console.error("分析エラー:", error)
//     return NextResponse.json({ error: "活動の分析に失敗しました", details: error.message }, { status: 500 })
//   }
// }
