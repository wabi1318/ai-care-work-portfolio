"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  BarChart2,
  Brain,
  Clock,
  Download,
  MessageSquare,
  Award,
  Briefcase,
  FileText,
  Loader2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import { useEffect, useState } from "react";

// データ型の定義
type PortfolioData = {
  user: {
    name: string;
    email: string;
  };
  summary: {
    totalActivities: number;
    totalHours: number;
    topSkills: string[];
  };
  coreSkills: Array<{
    id: number;
    name: string;
    tendency: string;
    description: string;
    icon: string;
    color: string;
  }>;
  experiences: Array<{
    id: number;
    title: string;
    summary: string;
    color: string;
    starStatement: string;
    skillName: string;
  }>;
  bizEquivalents?: Array<{
    careSkill: string;
    bizEquivalent: string;
  }>;
};

// デフォルトデータ
const defaultData: PortfolioData = {
  user: {
    name: "佐藤 花子",
    email: "hanako.sato@example.com",
  },
  summary: {
    totalActivities: 0,
    totalHours: 0,
    topSkills: ["読み込み中..."],
  },
  coreSkills: [
    {
      id: 1,
      name: "マルチタスク能力",
      tendency: "強く見られる",
      description:
        "品質と細部への注意を維持しながら、複数の同時責任を一貫して管理。専門的な環境でのプロジェクト管理スキルに相当します。",
      icon: "BarChart2",
      color: "rose",
    },
    {
      id: 2,
      name: "問題解決 & 危機管理",
      tendency: "よく見られる",
      description:
        "状況を迅速に分析し、プレッシャーの下で効果的な解決策を実施する強い能力。予期せぬケア状況の処理を通じて実証されています。",
      icon: "Brain",
      color: "blue",
    },
    {
      id: 3,
      name: "コミュニケーションスキル",
      tendency: "強く見られる",
      description:
        "様々な相手やストレスの多い状況で効果的にコミュニケーションする優れた能力。顧客や関係者とのコミュニケーションに直接転用できます。",
      icon: "MessageSquare",
      color: "green",
    },
    {
      id: 4,
      name: "時間管理 & 計画力",
      tendency: "よく見られる",
      description:
        "複雑なスケジュールと物流を調整する能力が証明された優れた組織力。プロジェクト計画とリソース配分に適用可能です。",
      icon: "Clock",
      color: "purple",
    },
  ],
  experiences: [
    {
      id: 1,
      title: "危機管理",
      summary:
        "家庭の緊急事態を成功裏に管理し、迅速な思考と機転を実証。例：家族の日常を維持し、混乱を最小限に抑えながら緊急の配管修理を調整。",
      color: "rose",
      starStatement:
        "台所の水漏れが発生した際、修理業者の手配と家族の食事の準備を同時に行う必要がありました。即座に優先順位を決め、修理業者への明確な状況説明と家族への代替食事プランを実行。結果として、混乱を最小限に抑えながら効率的に問題を解決できました。この経験から得た危機対応能力は、職場でのプロジェクト中の予期せぬ問題への対応に活かせます。",
      skillName: "危機管理",
    },
    {
      id: 2,
      title: "対立解決",
      summary:
        "定期的に対人関係の対立を調停し、すべての当事者のニーズに対応するバランスの取れた解決策を見出しました。職場での意見の相違に適用可能な効果的なエスカレーション防止技術を開発。",
      color: "blue",
      starStatement:
        "兄弟間の資源（おもちゃ、親の時間）をめぐる頻繁な対立に対処するため、公平なルールシステムを構築し実装しました。各人の感情と視点を認識しながら、双方が納得できる解決策を見出すプロセスを設計。この結果、対立頻度が70%減少し、より協力的な家庭環境を実現しました。この調停スキルはチーム内の意見の相違や利害衝突の解決に応用できます。",
      skillName: "対立解決",
    },
    {
      id: 3,
      title: "医療調整",
      summary:
        "複雑な医療予約を調整し、薬のスケジュールを正確に管理。複雑なシステムをナビゲートし、詳細な記録を維持する能力を実証。",
      color: "green",
      starStatement:
        "高齢の親族のために複数の専門医との予約、投薬スケジュール、健康記録の管理システムを構築しました。医療情報を整理し、医師と効果的にコミュニケーションを取ることで、治療計画の一貫性を確保。結果として、薬の相互作用リスクを回避し、健康状態の改善に寄与しました。この経験で培った記録管理と情報整理能力は、プロジェクト管理や情報システム構築に転用できます。",
      skillName: "情報管理",
    },
    {
      id: 4,
      title: "マルチタスク管理",
      summary:
        "家事、育児、介護など複数の責任を同時に管理しながら、すべてのタスクの品質を確保。",
      color: "purple",
      starStatement:
        "育児と在宅勤務を同時に管理する中で、子どもの安全を確保しながら会議に参加し、期限のあるタスクを完了させました。この経験から得たプライオリティ設定能力は、複数のプロジェクトを同時に管理する場面で活かせます。",
      skillName: "マルチタスク能力",
    },
    {
      id: 5,
      title: "専門的コミュニケーション",
      summary:
        "医療や教育などの専門家と効果的にコミュニケーションを取り、複雑な情報を理解し伝える能力。",
      color: "amber",
      starStatement:
        "高齢の親族のために医療関係者と明確にコミュニケーションを取り、複雑な医療情報を理解しやすい形に翻訳することで、最適な治療決定をサポートしました。この経験はチーム間の情報伝達や顧客対応で役立ちます。",
      skillName: "コミュニケーションスキル",
    },
  ],
  bizEquivalents: [
    {
      careSkill: "危機管理",
      bizEquivalent: "リスクマネジメント",
    },
    {
      careSkill: "対立解決",
      bizEquivalent: "交渉・調停能力",
    },
    {
      careSkill: "情報管理",
      bizEquivalent: "情報システム管理",
    },
    {
      careSkill: "マルチタスク能力",
      bizEquivalent: "プロジェクト管理",
    },
    {
      careSkill: "コミュニケーションスキル",
      bizEquivalent: "クライアント/チームコミュニケーション",
    },
  ],
};

export default function Portfolio() {
  const [portfolioData, setPortfolioData] =
    useState<PortfolioData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // APIからデータを取得する関数
  const fetchPortfolioData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/portfolio`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`API response error: ${response.status}`);
      }

      const apiData = await response.json();

      // APIデータとデフォルトデータをマージ
      setPortfolioData({
        ...defaultData,
        summary: {
          totalActivities: apiData.summary?.totalActivities || 0,
          totalHours: apiData.summary?.totalHours || 0,
          topSkills: apiData.topSkills?.map(
            (skill: { skillName: string }) => skill.skillName
          ) || ["データなし"],
        },
      });

      setError(null);
    } catch (error) {
      console.error("Failed to fetch portfolio data:", error);
      setError(
        error instanceof Error ? error.message : "不明なエラーが発生しました"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // コンポーネントマウント時に一度だけデータを取得
  useEffect(() => {
    fetchPortfolioData();
  }, []); // 空の依存配列で一度だけ実行

  const { user, summary, coreSkills, experiences } = portfolioData;

  // アイコンマッピング
  const iconMap = {
    BarChart2: BarChart2,
    Brain: Brain,
    MessageSquare: MessageSquare,
    Clock: Clock,
    Award: Award,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">
            ポートフォリオデータを読み込み中...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-xl mb-4">エラーが発生しました</div>
          <p className="text-gray-700 mb-4">{error}</p>
          <Button onClick={fetchPortfolioData}>再試行</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Sidebar />

        {/* メインコンテンツ */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* トップヘッダー */}
          <TopHeader />
          {/* メインコンテンツエリア（スクロール可能） */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* 専門的概要セクション */}

            <Card>
              <CardContent className="p-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-4xl mx-auto">
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-3">
                      あなたの実績とスキル概要
                    </h4>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-4 flex-1 flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <FileText className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-blue-800">活動記録数</p>
                          <p className="font-bold text-xl">
                            {summary.totalActivities}件
                          </p>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 flex-1 flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Clock className="text-green-600" size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-green-800">総活動時間</p>
                          <p className="font-bold text-xl">
                            {summary.totalHours}時間
                          </p>
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 flex-1 flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <Award className="text-purple-600" size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-purple-800">主要スキル</p>
                          <p className="font-bold text-lg">
                            {summary.topSkills[0]}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      {summary.totalHours}
                      時間以上の記録されたケア経験を持つ献身的な介護者で、
                      {summary.topSkills.join("、")}
                      において優れたスキルを発揮します。複雑な状況を管理し、物流を調整し、プレッシャーの下で冷静さを保つ能力が証明されています。適応性、感情知性、効率的なリソース管理を重視する専門的な環境でこれらの転用可能なスキルを活かすことを目指しています。
                    </p>
                  </div>

                  {/* コアコンピテンシーセクション */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-3">
                      あなたの主要スキルと発揮傾向
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {coreSkills.map((skill) => {
                        const IconComponent =
                          iconMap[skill.icon as keyof typeof iconMap] || Award;
                        return (
                          <div key={skill.id}>
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`bg-${skill.color}-100 p-1.5 rounded-full`}
                                >
                                  <IconComponent
                                    className={`text-${skill.color}-600`}
                                    size={16}
                                  />
                                </div>
                                <h3 className="font-medium">{skill.name}</h3>
                              </div>
                              <span
                                className={`text-sm px-2 py-1 rounded-full bg-${skill.color}-50 text-${skill.color}-700 border border-${skill.color}-200`}
                              >
                                {skill.tendency}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {skill.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 統合されたハイライトとエピソードセクション */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-3">
                      具体的なストーリー
                    </h4>
                    <div className="space-y-6">
                      {experiences.map((experience) => (
                        <div
                          key={experience.id}
                          className={`border border-${experience.color}-200 rounded-lg overflow-hidden`}
                        >
                          {/* ヘッダー部分 */}
                          <div
                            className={`bg-${experience.color}-50 p-3 border-b border-${experience.color}-200`}
                          >
                            <div className="flex justify-between">
                              <h5
                                className={`font-medium text-${experience.color}-800 flex items-center gap-2`}
                              >
                                {experience.title}
                              </h5>
                            </div>
                          </div>

                          {/* コンテンツ部分 */}
                          <div className="p-4">
                            {/* 概要 */}
                            <div className="mb-3">
                              <h6 className="text-sm font-medium text-gray-700 mb-1">
                                概要:
                              </h6>
                              <p className="text-sm text-gray-600">
                                {experience.summary}
                              </p>
                            </div>

                            {/* STAR形式のエピソード */}
                            <div>
                              <h6 className="text-sm font-medium text-gray-700 mb-1">
                                状況・課題・行動・結果:
                              </h6>
                              <p className="text-sm text-gray-600">
                                {experience.starStatement}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ビジネス転換マッピングセクション */}
                  {/* <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-3">
                      ケアスキルをビジネススキルに変換
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              ケアスキル
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              等価なビジネススキル
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {bizEquivalents.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.careSkill}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.bizEquivalent}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div> */}

                  {/* フッターセクション */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3">
                      このポートフォリオについて
                    </h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700 mb-3">
                        このポートフォリオは、日常のケア活動から抽出したビジネススキルを可視化したものです。家事や育児、介護などの経験を通じて培われた実践的能力を、企業環境で活かせる具体的なスキルとして整理しています。
                      </p>
                      <p className="text-sm text-gray-700">
                        スキル内容や経歴についてさらに詳しい情報が必要な場合は、
                        {user.name}（{user.email}
                        ）までお気軽にお問い合わせください。
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
