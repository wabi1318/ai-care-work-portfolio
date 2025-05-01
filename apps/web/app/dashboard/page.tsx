"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import {
  BarChart2,
  Brain,
  Calendar,
  Clock,
  Download,
  FileText,
  MessageSquare,
  Plus,
  Settings,
  Share2,
  Users2,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* サイドバー */}
        <div className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="bg-rose-600 text-white p-1.5 rounded-md">
                <Users2 size={18} />
              </div>
              <h1 className="font-bold text-gray-900">ケアポートフォリオ</h1>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-rose-50 text-rose-700"
            >
              <BarChart2 size={18} />
              ダッシュボード
            </Link>
            <Link
              href="/activities"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Calendar size={18} />
              活動記録
            </Link>
            <Link
              href="/portfolio"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
            >
              <FileText size={18} />
              ポートフォリオ
            </Link>
            <Link
              href="/ai-analysis"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Brain size={18} />
              AI分析
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Settings size={18} />
              設定
            </Link>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <span className="text-xs font-medium">佐</span>
              </div>
              <div>
                <p className="text-sm font-medium">佐藤 花子</p>
                <p className="text-xs text-gray-500">親 & 介護者</p>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* トップヘッダー */}
          <header className="bg-white border-b border-gray-200 py-4 px-6">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900">
                ダッシュボード
              </h1>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex items-center gap-2"
                >
                  <Share2 size={16} />
                  ポートフォリオを共有
                </Button>
                <Button
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 flex items-center gap-2"
                  asChild
                >
                  <Link href="/activity-log">
                    <Plus size={16} />
                    活動を記録
                  </Link>
                </Button>
              </div>
            </div>
          </header>

          {/* メインコンテンツエリア（スクロール可能） */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* 新機能のカード */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-rose-50 to-white border-rose-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-rose-100 p-3 rounded-full">
                      <MessageSquare className="text-rose-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        今日のこと、話しませんか？
                      </h3>
                      <p className="text-gray-600 mb-4">
                        AIとの自然な会話を通じて、あなたのケア活動を振り返りましょう。
                      </p>
                      <Button asChild className="bg-rose-600 hover:bg-rose-700">
                        <Link href="/ai-chat">AIと話す</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Calendar className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        カレンダーからケア活動を発見
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Googleカレンダーと連携して、予定からケア活動を自動的に抽出します。
                      </p>
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/calendar/settings">カレンダーと連携</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>総ケア時間</CardDescription>
                  <CardTitle className="text-2xl">1,248</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-green-600">先月比 +12%</p>
                    <Clock size={16} className="text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>特定されたスキル</CardDescription>
                  <CardTitle className="text-2xl">24</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-green-600">今月5つの新スキル</p>
                    <Brain size={16} className="text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>ポートフォリオ強度</CardDescription>
                  <CardTitle className="text-2xl">84%</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={84} className="h-2 mb-1" />
                  <p className="text-xs text-gray-500">
                    100%に達するには詳細を追加してください
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>
                    ポートフォリオダウンロード数
                  </CardDescription>
                  <CardTitle className="text-2xl">37</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-green-600">先週比 +8</p>
                    <Download size={16} className="text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* スキル分析 */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>スキル分析</CardTitle>
                      <CardDescription>
                        AIがケア活動から特定した職業スキル
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      すべてのスキルを表示
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-rose-100 p-1.5 rounded-full">
                            <BarChart2 className="text-rose-600" size={16} />
                          </div>
                          <h3 className="font-medium">マルチタスク能力</h3>
                        </div>
                        <span className="font-bold">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-rose-600 h-2.5 rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        複数の責任を同時に管理した47の活動に基づく
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-1.5 rounded-full">
                            <Brain className="text-blue-600" size={16} />
                          </div>
                          <h3 className="font-medium">問題解決 & 危機管理</h3>
                        </div>
                        <span className="font-bold">78%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: "78%" }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        迅速な判断を要する予期せぬ状況に関わる23の活動に基づく
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-green-100 p-1.5 rounded-full">
                            <MessageSquare
                              className="text-green-600"
                              size={16}
                            />
                          </div>
                          <h3 className="font-medium">
                            コミュニケーションスキル
                          </h3>
                        </div>
                        <span className="font-bold">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: "92%" }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        様々な相手との明確なコミュニケーションを必要とする56の活動に基づく
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-purple-100 p-1.5 rounded-full">
                            <Clock className="text-purple-600" size={16} />
                          </div>
                          <h3 className="font-medium">時間管理 & 計画力</h3>
                        </div>
                        <span className="font-bold">81%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-purple-600 h-2.5 rounded-full"
                          style={{ width: "81%" }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        複雑なスケジュールとリソース管理を含む38の活動に基づく
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 最近の活動 */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>最近の活動</CardTitle>
                      <CardDescription>最新のケア活動記録</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/activities">すべて表示</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        date: "今日, 9:30",
                        activity:
                          "仕事の会議の準備をしながら子供たちの朝の準備",
                        skills: ["マルチタスク", "時間管理"],
                        duration: "1時間15分",
                      },
                      {
                        date: "昨日, 16:15",
                        activity:
                          "高齢の親の医療予約のスケジュール調整を手伝う",
                        skills: ["コミュニケーション", "問題解決"],
                        duration: "45分",
                      },
                      {
                        date: "昨日, 19:30",
                        activity: "夕食の準備中に兄弟間の対立を解決",
                        skills: ["対立解決", "感情知性"],
                        duration: "30分",
                      },
                      {
                        date: "5月12日, 15:20",
                        activity: "家族の医療予約のための交通手段を調整",
                        skills: ["物流計画", "コミュニケーション"],
                        duration: "1時間",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-500">{item.date}</p>
                            <p className="font-medium mt-1">{item.activity}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.skills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-xs font-medium bg-rose-100 text-rose-700 px-2 py-1 rounded whitespace-nowrap">
                            {item.duration}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 職業への変換 */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>職業スキルへの変換</CardTitle>
                <CardDescription>
                  ケア活動が職場スキルにどのように変換されるか
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-rose-100 p-2 rounded-full">
                        <BarChart2 className="text-rose-600" size={20} />
                      </div>
                      <h3 className="font-semibold">
                        マルチタスク → プロジェクト管理
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      複数のケア責任を同時に管理する能力は、職業環境でのプロジェクト管理スキルに直接変換されます。
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">職場での関連性:</span>
                        <span className="font-medium">非常に高い</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Brain className="text-blue-600" size={20} />
                      </div>
                      <h3 className="font-semibold">危機管理 → 問題解決</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      予期せぬケア状況に対処した経験は、職場での課題に適用できる強力な問題解決能力を示しています。
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">職場での関連性:</span>
                        <span className="font-medium">高い</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <MessageSquare className="text-green-600" size={20} />
                      </div>
                      <h3 className="font-semibold">
                        ケアのコミュニケーション → 顧客関係
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      様々な年齢の家族と効果的にコミュニケーションする能力は、優れた顧客・関係者とのコミュニケーションに変換されます。
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">職場での関連性:</span>
                        <span className="font-medium">非常に高い</span>
                      </div>
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
