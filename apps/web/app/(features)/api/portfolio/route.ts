import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

// スキル概要文生成関数
async function generateSkillSummaryWithLLM(data: {
  topSkills: Array<{ skillName: string | null; skillCount: number | null }>;
  totalHours: number | null;
  totalActivities: number;
}) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI APIキーが設定されていません");
      return null;
    }

    // スキル名の配列を生成
    const skillNames = data.topSkills
      .filter((s) => s.skillName)
      .map((s) => s.skillName as string);

    const skillText =
      skillNames.length > 0
        ? skillNames.join("、")
        : "まだスキルが記録されていません";

    // systemプロンプト
    const systemPrompt =
      "あなたは、家事・育児・介護などの無償ケア労働で培われたスキルを、職場で活用できる具体的な能力として特定し、可視化するAIアシスタントです。提供されたデータに基づき、対象者の経験とスキルを魅力的に可視化してください。";

    // ユーザープロンプト
    const userPrompt = `以下に、ケア労働の経験に関するデータと、そこから生成されるスキル概要文の例を示します。
    これらの例を参考にして、最後に提供されるデータに基づいたスキル概要文を生成してください。
    
    --- 例 ---
    データ:
    - 記録された活動数: 50件
    - 総活動時間: 735時間
    - 主要スキル: 問題解決力・危機対応力、計画力・時間管理能力、忍耐力・感情マネジメント
    
    出力:
    735時間以上のケア経験を通じて、問題解決力・危機対応力、計画力・時間管理能力、忍耐力・感情マネジメントなど、多様なスキルを発揮してきました。複雑な状況の中でも関係者との調整や優先順位の判断を行い、プレッシャーの中でも冷静さを保つ力が証明されています。適応力や感情知性、効率的なリソース管理が求められる環境で、これらの経験を活かして貢献したいと考えています。

    --- 提供データ ---
    次のデータからスキル概要文を生成してください：
    - 記録された活動数: ${data.totalActivities}件
    - 総活動時間: ${data.totalHours || 0}時間
    - 主要スキル: ${skillText}
    
    以下の点を含む約175文字の文章を作成: 1) 得られたスキルの説明 2) 職場環境での活かし方
    「○○時間以上のケア経験を通じて～」というスタイルで始めてください。
    `;
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
    });

    return text || null;
  } catch (error) {
    console.error("スキル概要文生成エラー:", error);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("API URLが設定されていません");
    }

    const response = await fetch(`${apiUrl}/summary`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`API応答エラー: ${response.status}`);
      throw new Error(`API response error: ${response.status}`);
    }

    const data = await response.json();

    // スキル概要文を動的に生成
    if (data.topSkills && data.topSkills.length > 0 && data.summary) {
      const skillSummary = await generateSkillSummaryWithLLM({
        topSkills: data.topSkills,
        totalHours: data.summary.totalHours
          ? Number(data.summary.totalHours)
          : null,
        totalActivities: data.summary.totalActivities || 0,
      });

      // 生成されたスキル概要文をレスポンスに追加
      data.generatedSkillSummary = skillSummary;
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("ポートフォリオ取得エラー:", error);
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json(
      { error: "ポートフォリオの取得に失敗しました", details: errorMessage },
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
  } catch (error: unknown) {
    console.error("エクスポートエラー:", error);
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json(
      {
        error: "ポートフォリオのエクスポートに失敗しました",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
