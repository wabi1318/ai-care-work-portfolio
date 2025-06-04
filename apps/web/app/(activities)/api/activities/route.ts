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

// 活動データの型定義
interface Activity {
  date: string;
  activity_content: string;
  duration: number;
  problem?: string;
  solution?: string;
  emotion?: string;
  result?: string;
  source?: "manual" | "calendar" | "tasks"; // データソースを追加
}

// リクエストの型定義
interface SingleActivityRequest {
  date: string;
  activity_content: string;
  duration: number;
  problem: string;
  solution: string;
  emotion?: string;
  result: string;
}

interface MultipleActivitiesRequest {
  activities: Activity[];
  source?: "calendar" | "tasks";
}

// スキル定義の配列
const skillDefinitions = [
  {
    name: "主体性",
    definition: "物事に進んで取り組み、自ら一歩踏み出す力",
    icon: "zap",
  },
  {
    name: "自己主張性",
    definition: "自分の権利や意見を率直に示し、必要な場面で声を上げられる力",
    icon: "megaphone",
  },
  {
    name: "働きかけ力",
    definition: "周囲を巻き込み、行動を促す影響力",
    icon: "handshake",
  },
  {
    name: "実行力",
    definition: "目的を定め、計画どおりに行動を完遂する力",
    icon: "check-circle",
  },
  {
    name: "粘り強さ",
    definition: "障害に直面しても目標達成まで粘り強く取り組む力",
    icon: "repeat",
  },
  {
    name: "達成動機",
    definition: "高い基準を設定し、それを達成しようと努力する動機づけ",
    icon: "target",
  },
  {
    name: "課題発見力",
    definition: "現状を分析し、目的や課題を明らかにする力",
    icon: "search",
  },
  {
    name: "計画力",
    definition: "課題解決に向けたプロセスを具体化し準備する力",
    icon: "calendar-clock",
  },
  {
    name: "創造力",
    definition: "新しい価値やアイデアを生み出す力",
    icon: "lightbulb",
  },
  {
    name: "柔軟性",
    definition: "意見の違いや変化に適切に適応する力",
    icon: "shuffle",
  },
  {
    name: "発信力",
    definition: "自分の考えをわかりやすく伝える力",
    icon: "mic",
  },
  {
    name: "傾聴力",
    definition: "相手の意見を丁寧に聴き、理解する力",
    icon: "ear",
  },
  {
    name: "社交性",
    definition: "初対面でも人と交流し、関係を築く力",
    icon: "users",
  },
  {
    name: "共感性",
    definition: "他者の感情や視点を感じ取り、理解・共鳴する力",
    icon: "heart",
  },
  {
    name: "信頼性",
    definition: "約束を守り誠実に振る舞うことで信頼を獲得する力",
    icon: "shield-check",
  },
  {
    name: "規律性・責任感",
    definition: "社会のルールや他者との約束を守り、責任を果たす姿勢",
    icon: "clipboard-check",
  },
  {
    name: "自制心",
    definition: "衝動や欲求をコントロールし、注意を維持する力",
    icon: "lock",
  },
  {
    name: "ストレスマネジメント",
    definition: "ストレス要因を認識し、心身の安定を保つ力",
    icon: "heart-pulse",
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
  const definedSkill = skillDefinitions.find(
    (skill) => skill.name === skillName
  );
  if (definedSkill && definedSkill.icon) {
    return definedSkill.icon;
  }
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
    return [];
  }
}

// 単一活動を分析する関数
async function analyzeSingleActivity(
  activity: SingleActivityRequest,
  allSkills: Skill[]
): Promise<any> {
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
    throw new Error(
      "必須フィールド（日付・活動内容・所要時間）が不足しています"
    );
  }

  if (!problem || !solution || !result) {
    throw new Error(
      "必須フィールド（発生した課題・解決策・成果や家族の反応）が不足しています"
    );
  }

  const skillNames = allSkills
    .map((skill: Skill) => skill.name)
    .filter(Boolean);

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
---`;

  const { text: resultText } = await generateText({
    model: openai("gpt-4o-mini"),
    system: systemMessage,
    prompt: userMessage,
    temperature: 0.4,
  });

  const analysisResult = JSON.parse(resultText);

  // 各スキルに発揮傾向とアイコンを追加
  if (analysisResult.skills && Array.isArray(analysisResult.skills)) {
    analysisResult.skills = analysisResult.skills.map((skill: any) => {
      const icon = getSkillIcon(skill.name);
      const dbSkill = allSkills.find(
        (s: Skill) => s.name.toLowerCase() === skill.name.toLowerCase()
      );

      let tendency = "まれに見られる";
      if (dbSkill) {
        tendency = getTendency(Number(dbSkill.count));
      }

      return {
        ...skill,
        tendency,
        icon,
        description: dbSkill?.description || skill.description,
      };
    });
  }

  return analysisResult;
}

// 複数活動を分析する関数
async function analyzeMultipleActivities(
  activities: Activity[],
  allSkills: Skill[]
): Promise<any[]> {
  const processedActivities = [];

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

    try {
      // 必須フィールドの検証
      if (!date || !activity_content || !duration) {
        processedActivities.push({
          success: false,
          activity,
          error: "必須フィールド（日付・活動内容・所要時間）が不足しています",
        });
        continue;
      }

      if (!problem || !solution || !result) {
        processedActivities.push({
          success: false,
          activity,
          error:
            "必須フィールド（発生した課題・解決策・成果や家族の反応）が不足しています",
        });
        continue;
      }

      // 単一活動の分析関数を再利用
      const analysisResult = await analyzeSingleActivity(
        {
          date,
          activity_content,
          duration,
          problem,
          solution,
          emotion,
          result,
        },
        allSkills
      );

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
    } catch (error) {
      console.error("活動分析エラー:", error);
      const errorMessage =
        error instanceof Error ? error.message : "不明なエラー";

      processedActivities.push({
        success: false,
        activity,
        error: "活動の分析に失敗しました",
        details: errorMessage,
      });
    }
  }

  return processedActivities;
}

// POSTエンドポイント - 単一または複数活動の分析
export async function POST(req: Request) {
  try {
    const requestBody = await req.json();

    // バックエンドAPIからスキル一覧を取得
    const allSkills = await fetchSkills();

    // リクエストが単一活動か複数活動かを判定
    if ("activities" in requestBody && Array.isArray(requestBody.activities)) {
      // 複数活動の処理
      const { activities } = requestBody as MultipleActivitiesRequest;

      if (activities.length === 0) {
        return NextResponse.json(
          { error: "活動データが含まれていません" },
          { status: 400 }
        );
      }

      const results = await analyzeMultipleActivities(activities, allSkills);

      return NextResponse.json({
        success: true,
        results,
      });
    } else {
      // 単一活動の処理
      const activity = requestBody as SingleActivityRequest;

      const analysisResult = await analyzeSingleActivity(activity, allSkills);

      return NextResponse.json({
        success: true,
        activity: {
          date: activity.date,
          activity_content: activity.activity_content,
          duration: activity.duration,
          problem: activity.problem,
          solution: activity.solution,
          emotion: activity.emotion,
          result: activity.result,
        },
        analysis: analysisResult,
      });
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
