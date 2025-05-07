// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   try {
//     // TODO: ユーザー認証とデータベースからのスキル取得処理

//     // 仮のデータを返す（実際の実装ではデータベースから取得）
//     return NextResponse.json({
//       skills: [
//         {
//           id: "1",
//           name: "マルチタスク管理能力",
//           category: "multitasking",
//           activities_count: 22,
//           avg_proficiency: "高い",
//         },
//         {
//           id: "2",
//           name: "問題解決能力",
//           category: "problem_solving",
//           activities_count: 10,
//           avg_proficiency: "中程度",
//         },
//         {
//           id: "3",
//           name: "時間管理能力",
//           category: "time_management",
//           activities_count: 15,
//           avg_proficiency: "高い",
//         },
//         {
//           id: "4",
//           name: "コミュニケーション能力",
//           category: "communication",
//           activities_count: 18,
//           avg_proficiency: "高い",
//         },
//         {
//           id: "5",
//           name: "感情知性",
//           category: "emotional_intelligence",
//           activities_count: 12,
//           avg_proficiency: "高い",
//         },
//         {
//           id: "6",
//           name: "忍耐力",
//           category: "patience",
//           activities_count: 8,
//           avg_proficiency: "中程度",
//         },
//         {
//           id: "7",
//           name: "危機管理能力",
//           category: "crisis_management",
//           activities_count: 5,
//           avg_proficiency: "要向上",
//         },
//         {
//           id: "8",
//           name: "組織力",
//           category: "organizational_skills",
//           activities_count: 14,
//           avg_proficiency: "高い",
//         },
//       ],
//     });
//   } catch (error) {
//     console.error("スキル取得エラー:", error);
//     return NextResponse.json(
//       { error: "スキルの取得に失敗しました", details: error.message },
//       { status: 500 }
//     );
//   }
// }

// // 特定のスキルの詳細を取得するAPI
// export async function POST(req: Request) {
//   try {
//     const { id } = await req.json();

//     if (!id) {
//       return NextResponse.json(
//         { error: "スキルIDが指定されていません" },
//         { status: 400 }
//       );
//     }

//     // TODO: データベースから特定のスキル詳細を取得する処理

//     // 仮のデータを返す（実際の実装ではデータベースから取得）
//     return NextResponse.json({
//       skill: {
//         id: id,
//         name: "マルチタスク管理能力",
//         category: "multitasking",
//         activities_count: 22,
//         avg_proficiency: "高い",
//         activities: [
//           {
//             id: "act1",
//             date: "2025-05-03",
//             activity_content:
//               "子どもの朝の準備をしながら、オンライン会議の資料を確認した",
//             proficiency: "高い",
//             resume_summary:
//               "複数のタスクを同時に効率的に処理し、優先順位を適切に判断",
//           },
//           {
//             id: "act2",
//             date: "2025-05-05",
//             activity_content:
//               "親の通院に付き添いながら、仕事のメールに対応した",
//             proficiency: "高い",
//             resume_summary: "医療機関との対話と業務コミュニケーションを両立",
//           },
//           {
//             id: "act3",
//             date: "2025-05-10",
//             activity_content: "夕食の準備をしながら、子どもの宿題を手伝った",
//             proficiency: "中程度",
//             resume_summary: "同時進行でのリソース配分と時間管理を実践",
//           },
//         ],
//         resume_examples: [
//           "複数の責任を同時に効率よく管理し、優先順位を適切に判断するスキルを日常的に活用",
//           "家庭内の複数のニーズに対応しながら、各タスクの品質を維持する能力を発揮",
//           "限られた時間で複数のプロジェクトを同時に進行させ、締め切りを守る経験を積む",
//         ],
//       },
//     });
//   } catch (error) {
//     console.error("スキル詳細取得エラー:", error);
//     return NextResponse.json(
//       { error: "スキル詳細の取得に失敗しました", details: error.message },
//       { status: 500 }
//     );
//   }
// }
