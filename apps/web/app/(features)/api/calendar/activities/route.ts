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
  description?: string;
  icon?: string;
}

// スキル定義の配列
const skillDefinitions = [
  {
    name: "マルチタスク管理能力",
    definition: "複数の作業を同時に進行し、適切に切り替えて遂行する能力",
    icon: "layers",
  },
  {
    name: "問題解決・危機対応力",
    definition: "課題を発見し、冷静に対応策を立案・実行する能力",
    icon: "brain",
  },
  {
    name: "コミュニケーション能力",
    definition: "相手の話を理解し、自分の考えを明確に伝える能力",
    icon: "message-square",
  },
  {
    name: "忍耐力・感情マネジメント",
    definition: "困難な状況下でも冷静さと前向きさを保つ能力",
    icon: "shield",
  },
  {
    name: "計画力・時間管理能力",
    definition: "目標達成に向けて計画を立て、優先順位を整理して遂行する能力",
    icon: "clock",
  },
  {
    name: "共感・傾聴力",
    definition: "相手の立場や感情に寄り添い、丁寧に話を聞く能力",
    icon: "ear",
  },
  {
    name: "サポート力",
    definition: "他者の立場に立ち、必要に応じて支援・補助を行う能力",
    icon: "hand-helping",
  },
];

// 発揮傾向を判定する関数
function getTendency(count: number): string {
  if (count >= 15) return "強く見られる";
  if (count >= 10) return "よく見られる";
  if (count >= 5) return "少し見られる";
  return "まれに見られる";
}

// スキル名からアイコンを取得する関数
function getSkillIcon(skillName: string): string {
  // 定義済みスキルから検索
  const definedSkill = skillDefinitions.find(
    (skill) => skill.name === skillName
  );
  if (definedSkill && definedSkill.icon) {
    return definedSkill.icon;
  }
  // デフォルトアイコン
  return "sparkles";
}

// スキル定義をLLMに渡す際にアイコン情報を除外する関数
function getSkillDefinitionsForLLM() {
  return skillDefinitions.map(({ name, definition }) => ({
    name,
    definition,
  }));
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
    const { activities } = await req.json();

    // 配列形式のデータかチェック
    if (!Array.isArray(activities)) {
      return NextResponse.json(
        { error: "活動データは配列形式で送信してください" },
        { status: 400 }
      );
    }

    // 配列が空でないことを確認
    if (activities.length === 0) {
      return NextResponse.json(
        { error: "活動データが含まれていません" },
        { status: 400 }
      );
    }

    // バックエンドAPIからスキル一覧を取得
    const allSkills = await fetchSkills();

    // スキル名の一覧を作成
    const skillNames = allSkills
      .map((skill: Skill) => skill.name)
      .filter(Boolean);

    // 各活動を処理して結果を格納する配列
    const processedActivities = [];

    // 各活動に対して処理を実行
    for (const activity of activities) {
      const {
        date,
        activity_content,
        duration,
        problem,
        solution,
        emotion,
        result,
      } = activity;

      // 必須フィールドの検証
      if (!date || !activity_content || !duration) {
        processedActivities.push({
          success: false,
          activity,
          error: "必須フィールド（日付・活動内容・所要時間）が不足しています",
        });
        continue;
      }

      // 追加の必須フィールドの検証
      if (!problem || !solution || !result) {
        processedActivities.push({
          success: false,
          activity,
          error:
            "必須フィールド（発生した課題・解決策・成果や家族の反応）が不足しています",
        });
        continue;
      }

      // システムメッセージとユーザーメッセージの構築
      const systemMessage = `あなたは、家庭内のケア活動を職務経歴書向けに翻訳する支援者です。
ユーザーの活動記録から、どのようなスキルが表れていたかを読み取り、指定された形式で出力してください。
評価や点数付けはせず、活動の文脈の中にどのようなスキルが見られるか、その関連性の高さを示してください。

**スキルの抽出優先順位:**
1. 以下のスキル定義を最優先で参照してください：
${JSON.stringify(getSkillDefinitionsForLLM(), null, 2)}

2. 次に、データベースに登録されている以下のスキルを参照してください：
${skillNames.length > 0 ? skillNames.join("、") : "（登録済みスキルはありません）"}
可能な限りこれらのスキル名を優先して使用してください。

3. 上記のいずれにも該当しないが、活動記録に明らかに表れているスキルがある場合は、適切なスキル名を新たに提案することも可能です。

**関連性の高さの判断基準:**
- 高い: 活動内容に直接的かつ明確にそのスキルの実行が記載されている、またはそのスキルが活動の核心である。
- 中程度: 課題への対応や解決策の実施、成果の達成など、活動の背景や結果としてそのスキルが強く推測される。
- 低い: 活動記録の断片的な情報や全体的な文脈から、そのスキルが推測される程度である。
※関連性が「低い」と判断されるスキルは出力しないでください。関連性が「高い」または「中程度」のスキルのみを抽出してください。

**出力形式:**
JSON形式で以下の情報を返してください。

{
  "skills": [
    {
      "name": "スキル名", // 提案スキル名も含む
      "relevance": "関連性の高さ", // 高い／中程度
      "reason": "補足説明", // なぜそのスキルが表れていると判断できるか、簡潔に
      "description": "スキルの詳細説明" // スキルの定義と、実務や職場でどのように活かせるかの説明を含める
    }
    // 最大3件のスキルを含める
  ],
  "resume_summary": [
    "職務経歴書向け文例1",
    "職務経歴書向け文例2",
    "職務経歴書向け文例3"
  ]
}`;

      const userMessage = `以下は家庭内ケア活動の記録です。
この記録をもとに、システムメッセージで定義された形式に従ってスキル抽出と職務経歴書向け文例の生成を行ってください。
スキルの説明（description）は「スキルの定義＋そのスキルが職場でどのように活かせるか」の形式で、50字程度で記述してください。

例：「サポート力」の場合 → 「他者の立場に立ち、必要に応じて支援・補助を行う能力。チームや他者の業務を補助しながら全体を支えるような協働の場面で役立ちます。」

---
日付: ${date}
活動内容: ${activity_content}
所要時間: ${duration}分
課題: ${problem}
解決策: ${solution}
感情: ${emotion || "特になし"}
成果: ${result}
---

`;

      // OpenAI APIリクエスト
      try {
        const { text: resultText } = await generateText({
          model: openai("gpt-4o-mini"),
          system: systemMessage,
          prompt: userMessage,
          temperature: 0.3,
        });

        // 結果のパース
        try {
          const analysisResult = JSON.parse(resultText);

          // 各スキルに発揮傾向とアイコンを追加
          if (analysisResult.skills && Array.isArray(analysisResult.skills)) {
            analysisResult.skills = analysisResult.skills.map((skill: any) => {
              // スキル名からアイコンを取得
              const icon = getSkillIcon(skill.name);

              // DBに登録されているスキルを検索
              const dbSkill = allSkills.find(
                (s: Skill) => s.name.toLowerCase() === skill.name.toLowerCase()
              );

              // 発揮傾向を設定
              let tendency = "まれに見られる"; // デフォルト値

              if (dbSkill) {
                tendency = getTendency(Number(dbSkill.count));
              }

              // スキルに発揮傾向とアイコンを追加
              return {
                ...skill,
                tendency,
                icon,
                // DBに登録済みのスキルの場合は既存の説明を使用
                description: dbSkill?.description || skill.description,
              };
            });
          }

          // 処理結果を追加
          processedActivities.push({
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
            analysis: analysisResult,
          });
        } catch (parseError) {
          console.error("JSON解析エラー:", parseError);
          const errorMessage =
            parseError instanceof Error ? parseError.message : "不明なエラー";

          processedActivities.push({
            success: false,
            activity,
            error: "LLM結果の解析に失敗しました",
            details: errorMessage,
          });
        }
      } catch (llmError) {
        console.error("LLM API呼び出しエラー:", llmError);
        const errorMessage =
          llmError instanceof Error ? llmError.message : "不明なエラー";

        processedActivities.push({
          success: false,
          activity,
          error: "活動の分析に失敗しました",
          details: errorMessage,
        });
      }
    }

    return NextResponse.json({
      success: true,
      results: processedActivities,
    });
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
