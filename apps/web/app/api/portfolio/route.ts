import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // TODO: ユーザー認証とデータベースからのスキル集計

    // 仮の集計データを返す（実装ではデータベースから取得・集計）
    return NextResponse.json({
      skills: [
        {
          name: "時間管理能力",
          category: "time_management",
          activities_count: 15,
          average_proficiency: "高い",
          resume_examples: [
            "育児や家事のタスクを効率的に管理し、期限内に多くの責任を遂行",
            "複数の家族メンバーのスケジュールを調整し、適切な優先順位付けを実施",
          ],
        },
        {
          name: "マルチタスク管理能力",
          category: "multitasking",
          activities_count: 22,
          average_proficiency: "高い",
          resume_examples: [
            "同時に複数の要求に対応しながら、各タスクの品質を維持",
            "子どもの世話をしながら、食事準備や家事を並行して効率的に実行",
          ],
        },
        {
          name: "問題解決能力",
          category: "problem_solving",
          activities_count: 10,
          average_proficiency: "中程度",
          resume_examples: [
            "予期せぬ状況に迅速に適応し、創造的な解決策を見出す能力を発揮",
            "リソースが限られた中で、効果的な代替手段を考案・実行",
          ],
        },
        {
          name: "コミュニケーション能力",
          category: "communication",
          activities_count: 18,
          average_proficiency: "高い",
          resume_examples: [
            "様々な年齢層や状況に応じたコミュニケーションスタイルを適応",
            "複雑な情報を簡潔かつ明確に伝える能力を日常的に発揮",
          ],
        },
        {
          name: "感情知性",
          category: "emotional_intelligence",
          activities_count: 12,
          average_proficiency: "高い",
          resume_examples: [
            "困難な状況下でも冷静さを保ち、他者の感情ニーズに適切に対応",
            "複数の利害関係者間の調整を行い、合意形成を促進",
          ],
        },
      ],
      career_matches: [
        {
          title: "プロジェクトマネージャー",
          skill_match: 87,
          key_skills: ["時間管理能力", "マルチタスク管理能力", "問題解決能力"],
        },
        {
          title: "チームリーダー",
          skill_match: 92,
          key_skills: ["コミュニケーション能力", "感情知性", "問題解決能力"],
        },
        {
          title: "カスタマーサポートマネージャー",
          skill_match: 85,
          key_skills: ["感情知性", "コミュニケーション能力", "問題解決能力"],
        },
      ],
      total_activities: 45,
      most_recent_activity: "2025-05-10",
    });
  } catch (error) {
    console.error("ポートフォリオ取得エラー:", error);
    return NextResponse.json(
      { error: "ポートフォリオの取得に失敗しました", details: error.message },
      { status: 500 }
    );
  }
}

// ポートフォリオのエクスポート
export async function POST(req: Request) {
  try {
    const { format, sections } = await req.json();

    if (!format || !sections) {
      return NextResponse.json(
        { error: "エクスポート形式とセクションの指定が必要です" },
        { status: 400 }
      );
    }

    // TODO: 実際のエクスポート機能実装（PDF生成など）

    return NextResponse.json({
      success: true,
      message: `${format}形式でのエクスポートが完了しました`,
      download_url: `/exports/portfolio_${Date.now()}.${format}`,
    });
  } catch (error) {
    console.error("エクスポートエラー:", error);
    return NextResponse.json(
      {
        error: "ポートフォリオのエクスポートに失敗しました",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
