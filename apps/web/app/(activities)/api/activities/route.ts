import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

// スキルの型定義
interface Skill {
  id: number;
  name: string;
  definition: string;
  category?: string;
  count?: number;
}

// スキル定義の配列
const skillDefinitions = [
  {
    name: "マルチタスク管理能力",
    definition: "複数の作業を同時に進行し、適切に切り替えて遂行する能力",
  },
  {
    name: "問題解決・危機対応力",
    definition: "課題を発見し、冷静に対応策を立案・実行する能力",
  },
  {
    name: "コミュニケーション能力",
    definition: "相手の話を理解し、自分の考えを明確に伝える能力",
  },
  {
    name: "忍耐力・感情マネジメント",
    definition: "困難な状況下でも冷静さと前向きさを保つ能力",
  },
  {
    name: "計画力・時間管理能力",
    definition: "目標達成に向けて計画を立て、優先順位を整理して遂行する能力",
  },
  {
    name: "共感・傾聴力",
    definition: "相手の立場や感情に寄り添い、丁寧に話を聞く能力",
  },
  {
    name: "サポート力",
    definition: "他者の立場に立ち、必要に応じて支援・補助を行う能力",
  },
];

// 発揮傾向を判定する関数
function getTendency(count: number): string {
  if (count >= 15) return "強く見られる";
  if (count >= 10) return "よく見られる";
  if (count >= 5) return "少し見られる";
  return "まれに見られる";
}

// バックエンドAPIからスキル一覧を取得する関数
async function fetchSkills() {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787/api";
    const response = await fetch(`${apiUrl}/skills`);

    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error("APIからのレスポンスが成功ではありません");
    }

    return data.data || [];
  } catch (error) {
    console.error("スキル取得エラー:", error);
    return []; // エラー時は空配列を返す
  }
}

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

    // バックエンドAPIからスキル一覧を取得
    const allSkills = await fetchSkills();

    // スキル名の一覧を作成
    const skillNames = allSkills
      .map((skill: Skill) => skill.name)
      .filter(Boolean);

    // システムメッセージとユーザーメッセージの構築
    const systemMessage = `あなたは、家庭内のケア活動を職務経歴書向けに翻訳する支援者です。
ユーザーの活動記録から、どのようなスキルが表れていたかを読み取り、以下のような形で出力してください。
評価や点数付けはせず、活動の文脈の中にどのようなスキルが見られるか、どの程度関連性があるかを示してください。

スキルの抽出は以下の優先順位で行ってください：

1. 以下のスキル定義を最優先で参照してください：
${JSON.stringify(skillDefinitions, null, 2)}

2. 次に、データベースに登録されている以下のスキルを参照してください：
${skillNames.length > 0 ? skillNames.join("、") : "（登録済みスキルはありません）"}

3. 上記のいずれにも該当しないが、活動記録に明らかに表れているスキルがある場合は、適切なスキル名を新たに提案することも可能です。

各スキルには次の情報を含めて出力してください：
- スキル名（定義にない場合は、適切な名称を提案）
- 定義（定義にない場合は、そのスキルの簡潔な説明）
- なぜそのスキルが活動と関連していると判断できるか
- 関連性の高さ（高い／中程度／低い）`;

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
    - 活動との関連性の高さ（高い／中程度／低い）
    - 補足説明（なぜそのスキルが表れていると判断できるか、簡潔に）

2. 職務経歴書向け文例（2～3文、箇条書き）

以下の形式でJSONを返してください：
{
  "skills": [
    {
      "name": "スキル名",
      "relevance": "関連性の高さ",
      "reason": "補足説明"
    }
  ],
  "resume_summary": [
    "履歴書向け文例1",
    "履歴書向け文例2"
  ]
}

なお、以下のスキル名は既にデータベースに登録されているため、可能であればこれらを優先して使用してください：
${skillNames.length > 0 ? skillNames.join("、") : "（登録済みスキルはありません）"}`;

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

      // 各スキルに発揮傾向を追加
      if (result.skills && Array.isArray(result.skills)) {
        result.skills = result.skills.map((skill: any) => {
          // DBに登録されているスキルを検索
          const dbSkill = allSkills.find(
            (s: Skill) => s.name.toLowerCase() === skill.name.toLowerCase()
          );

          // 発揮傾向を設定
          let tendency = "まれに見られる"; // デフォルト値

          if (dbSkill && typeof dbSkill.count === "number") {
            tendency = getTendency(dbSkill.count);
          }

          // スキルに発揮傾向を追加
          return {
            ...skill,
            tendency,
          };
        });
      }

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
