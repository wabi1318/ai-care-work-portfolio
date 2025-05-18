import { NextResponse } from "next/server";

// ケア関連キーワード
const CARE_KEYWORDS = {
  childcare: [
    "保育園",
    "幼稚園",
    "子ども",
    "子供",
    "送迎",
    "お迎え",
    "通学",
    "宿題",
    "勉強",
  ],
  eldercare: ["介護", "病院", "通院", "付き添い", "高齢", "親", "母", "父"],
  healthcare: ["病院", "診察", "健診", "検診", "医療"],
  household: ["家事", "掃除", "洗濯", "買い物", "ごみ", "修理"],
  cooking: ["料理", "食事", "夕食", "朝食", "昼食", "準備"],
  education: ["勉強", "学習", "宿題", "サポート", "教育"],
  emotional: ["相談", "話し合い", "ケア", "サポート"],
};

// スキルマッピング
const SKILLS_MAPPING = {
  childcare: ["時間管理", "柔軟性", "忍耐力", "コミュニケーション"],
  eldercare: ["共感力", "忍耐力", "問題解決", "コミュニケーション", "医療知識"],
  healthcare: ["問題解決", "共感力", "医療知識"],
  household: ["マルチタスク", "効率性", "計画力"],
  cooking: ["計画力", "時間管理", "創造性"],
  education: ["教育力", "忍耐力", "コミュニケーション"],
  emotional: ["傾聴力", "共感力", "感情管理"],
};

// イベントがケア活動かどうかを判断する関数
function analyzeCareActivity(event: any) {
  const summary = event.summary?.toLowerCase() || "";
  const description = event.description?.toLowerCase() || "";
  const location = event.location?.toLowerCase() || "";
  const fullText = `${summary} ${description} ${location}`.toLowerCase();

  // 各カテゴリのキーワードマッチングスコアを計算
  const categoryScores: Record<string, number> = {};

  for (const [category, keywords] of Object.entries(CARE_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (fullText.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    categoryScores[category] = score;
  }

  // 最もスコアの高いカテゴリを見つける
  let maxScore = 0;
  let matchedCategory = "";

  for (const [category, score] of Object.entries(categoryScores)) {
    if (score > maxScore) {
      maxScore = score;
      matchedCategory = category;
    }
  }

  // スコアが0の場合はケア活動ではない
  if (maxScore === 0) {
    return null;
  }

  // 所要時間を計算（分単位）
  let duration = 60; // デフォルト値
  if (event.start && event.end) {
    const start = new Date(
      event.start.dateTime || `${event.start.date}T00:00:00`
    );
    const end = new Date(event.end.dateTime || `${event.end.date}T23:59:59`);
    duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  }

  // 関連スキル（カテゴリに基づく）
  const skills =
    SKILLS_MAPPING[matchedCategory as keyof typeof SKILLS_MAPPING] || [];

  // 該当するカテゴリの翻訳
  const categoryTranslations: Record<string, string> = {
    childcare: "育児",
    eldercare: "高齢者ケア",
    healthcare: "医療サポート",
    household: "家事管理",
    cooking: "料理",
    education: "教育サポート",
    emotional: "感情的サポート",
  };

  return {
    id: event.id,
    eventSummary: event.summary,
    type: matchedCategory,
    typeName: categoryTranslations[matchedCategory] || "その他",
    skills: skills.slice(0, 3), // 最大3つのスキルを選択
    duration: `${duration}分`,
    durationMinutes: duration,
    selected: true, // デフォルトで選択状態
    start: event.start?.dateTime || event.start?.date,
    end: event.end?.dateTime || event.end?.date,
  };
}

export async function POST(request: Request) {
  try {
    const { events } = await request.json();

    if (!events || !Array.isArray(events)) {
      return NextResponse.json(
        { error: "イベントデータが正しくありません" },
        { status: 400 }
      );
    }

    // 各イベントを分析
    const careActivities = events.map(analyzeCareActivity).filter(Boolean); // nullを除外

    return NextResponse.json({ careActivities });
  } catch (error) {
    console.error("活動分析エラー:", error);
    return NextResponse.json(
      { error: "イベントの分析に失敗しました" },
      { status: 500 }
    );
  }
}
