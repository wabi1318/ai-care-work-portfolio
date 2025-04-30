import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import {
  BarChart2,
  Brain,
  Calendar,
  FileText,
  Settings,
  Users2,
  Zap,
  Briefcase,
  ArrowRight,
  MessageSquare,
  Clock,
} from "lucide-react"

export default function AIAnalysis() {
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
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
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
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-rose-50 text-rose-700"
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
              <h1 className="text-xl font-bold text-gray-900">AI分析</h1>
              <div className="flex items-center gap-3">
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700 flex items-center gap-2">
                  <Zap size={16} />
                  新しい分析を実行
                </Button>
              </div>
            </div>
          </header>

          {/* メインコンテンツエリア（スクロール可能） */}
          <main className="flex-1 overflow-y-auto p-6">
            <Tabs defaultValue="skills">
              <TabsList className="mb-6">
                <TabsTrigger value="skills">スキル分析</TabsTrigger>
                <TabsTrigger value="professional">職業への変換</TabsTrigger>
                <TabsTrigger value="trends">傾向 & 洞察</TabsTrigger>
              </TabsList>

              <TabsContent value="skills" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>AIが特定したスキル</CardTitle>
                      <CardDescription>記録されたケア活動に基づいて、AIが特定した職業スキル</CardDescription>
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
                            <div className="bg-rose-600 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">複数の責任を同時に管理した47の活動に基づく</p>
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
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "78%" }}></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            迅速な判断を要する予期せぬ状況に関わる23の活動に基づく
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <div className="bg-green-100 p-1.5 rounded-full">
                                <MessageSquare className="text-green-600" size={16} />
                              </div>
                              <h3 className="font-medium">コミュニケーションスキル</h3>
                            </div>
                            <span className="font-bold">92%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "92%" }}></div>
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
                            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "81%" }}></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            複雑なスケジュールとリソース管理を含む38の活動に基づく
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>スキル開発</CardTitle>
                      <CardDescription>スキルが時間とともにどのように向上したか</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">マルチタスク能力</h3>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">3ヶ月前:</span>
                            <span className="font-medium">72%</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">今日:</span>
                            <span className="font-medium text-green-600">85% (+13%)</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">問題解決</h3>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">3ヶ月前:</span>
                            <span className="font-medium">65%</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">今日:</span>
                            <span className="font-medium text-green-600">78% (+13%)</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">コミュニケーションスキル</h3>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">3ヶ月前:</span>
                            <span className="font-medium">88%</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">今日:</span>
                            <span className="font-medium text-green-600">92% (+4%)</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">時間管理</h3>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">3ヶ月前:</span>
                            <span className="font-medium">74%</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">今日:</span>
                            <span className="font-medium text-green-600">81% (+7%)</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>スキルの証拠</CardTitle>
                    <CardDescription>あなたのトップスキルを示す活動</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">マルチタスク能力 (85%)</h3>
                        <div className="space-y-3">
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="font-medium text-sm">仕事の会議の準備をしながら子供たちの朝の準備</p>
                            <p className="text-xs text-gray-500 mt-1">今日, 9:30 • 1時間15分</p>
                            <p className="text-sm mt-2">
                              「タイトな朝のスケジュールの中で、二人の子供の朝食を準備し、学校の準備を手伝い、重要な仕事の会議のためのメモを準備することができました。」
                            </p>
                          </div>
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="font-medium text-sm">子供たちの監督をしながら一週間分の食事を準備</p>
                            <p className="text-xs text-gray-500 mt-1">5月8日, 7:00 • 3時間</p>
                            <p className="text-sm mt-2">
                              「子供たちの活動を監督し、彼らのニーズに対応しながら、一週間分の食事を準備し、小分けすることができました。」
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3">コミュニケーションスキル (92%)</h3>
                        <div className="space-y-3">
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="font-medium text-sm">高齢の親の医療予約のスケジュール調整を手伝う</p>
                            <p className="text-xs text-gray-500 mt-1">昨日, 16:15 • 45分</p>
                            <p className="text-sm mt-2">
                              「医療提供者と効果的にコミュニケーションを取り、予約を調整しながら、複雑な医療情報を親にわかりやすい方法で説明しました。」
                            </p>
                          </div>
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="font-medium text-sm">夕食の準備中に兄弟間の対立を解決</p>
                            <p className="text-xs text-gray-500 mt-1">昨日, 19:30 • 30分</p>
                            <p className="text-sm mt-2">
                              「積極的な傾聴と調停技術を使用して、兄弟が感情を表現し、両方の当事者を満足させる妥協点に達するのを助けました。」
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="professional" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>職業への変換</CardTitle>
                    <CardDescription>ケア活動が職場スキルにどのように変換されるか</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-rose-100 p-2 rounded-full">
                              <BarChart2 className="text-rose-600" size={20} />
                            </div>
                            <h3 className="font-semibold">マルチタスク → プロジェクト管理</h3>
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
                            <h3 className="font-semibold">ケアのコミュニケーション → 顧客関係</h3>
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

                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">業界関連性分析</h3>
                        <p className="text-gray-600 mb-6">
                          あなたのケア活動に基づいて、AIはあなたのスキルが最も価値のある業界を特定しました:
                        </p>

                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">プロジェクト管理</h4>
                              <span className="font-bold">94%マッチ</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-rose-600 h-2.5 rounded-full" style={{ width: "94%" }}></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              あなたのマルチタスク、調整、リソース管理スキルは高い適用性があります
                            </p>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">カスタマーサービス</h4>
                              <span className="font-bold">91%マッチ</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-rose-600 h-2.5 rounded-full" style={{ width: "91%" }}></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              あなたのコミュニケーションと対立解決スキルは顧客対応の役割で優れるでしょう
                            </p>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">医療管理</h4>
                              <span className="font-bold">87%マッチ</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-rose-600 h-2.5 rounded-full" style={{ width: "87%" }}></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              医療調整と細部への注意の経験は医療管理に価値ある資産です
                            </p>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">人事</h4>
                              <span className="font-bold">85%マッチ</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-rose-600 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              あなたの感情知性と対立解決スキルは非常に関連性があります
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>職種マッチング</CardTitle>
                    <CardDescription>ケアから得られたスキルに合致する潜在的な職種</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-rose-300 hover:shadow-md transition-all">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold">プロジェクトコーディネーター</h3>
                            <p className="text-sm text-gray-500">スキルマッチ 92%</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8">
                              詳細
                            </Button>
                            <Button size="sm" className="bg-rose-600 hover:bg-rose-700 h-8">
                              <Briefcase className="h-4 w-4 mr-1" /> 求人を見る
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-gray-600">
                            あなたのマルチタスク能力と組織力は、プロジェクト調整の役割に最適です。
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full">
                              マルチタスク
                            </span>
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">組織力</span>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                              コミュニケーション
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-rose-300 hover:shadow-md transition-all">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold">カスタマーサクセスマネージャー</h3>
                            <p className="text-sm text-gray-500">スキルマッチ 89%</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8">
                              詳細
                            </Button>
                            <Button size="sm" className="bg-rose-600 hover:bg-rose-700 h-8">
                              <Briefcase className="h-4 w-4 mr-1" /> 求人を見る
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-gray-600">
                            あなたのコミュニケーションスキルと複雑な状況を処理する能力は、カスタマーサクセスの役割に適しています。
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                              コミュニケーション
                            </span>
                            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">
                              共感性
                            </span>
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">問題解決</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-rose-300 hover:shadow-md transition-all">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold">医療管理者</h3>
                            <p className="text-sm text-gray-500">スキルマッチ 87%</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8">
                              詳細
                            </Button>
                            <Button size="sm" className="bg-rose-600 hover:bg-rose-700 h-8">
                              <Briefcase className="h-4 w-4 mr-1" /> 求人を見る
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-gray-600">
                            医療調整と細部への注意の経験は、医療管理に価値があります。
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">組織力</span>
                            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                              細部への注意
                            </span>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                              コミュニケーション
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <Button variant="outline" className="flex items-center gap-1 mx-auto">
                        さらに職種マッチングを見る <ArrowRight size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>活動傾向 & 洞察</CardTitle>
                    <CardDescription>ケア活動からのパターンと洞察</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">主要な洞察</h3>
                        <div className="space-y-4">
                          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                            <h4 className="font-medium text-rose-800 mb-2">スキル成長の機会</h4>
                            <p className="text-sm text-gray-700">
                              あなたの対立解決スキルは過去3ヶ月間で大幅な改善（23%の成長）を示しています。これらの事例を引き続き記録してください。これらは職場での貴重な調停能力を示しています。
                            </p>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-800 mb-2">ポートフォリオの強化</h4>
                            <p className="text-sm text-gray-700">
                              医療調整活動についてより詳細を追加することを検討してください。これらは専門的な環境に高度に転用可能な貴重な物流および管理スキルを示しています。
                            </p>
                          </div>

                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-medium text-green-800 mb-2">スキルの多様化</h4>
                            <p className="text-sm text-gray-700">
                              あなたの活動は強力なコミュニケーションとマルチタスクスキルを示していますが、リーダーシップと意思決定の例をもっと追加すると良いでしょう。重要なケアの決定を下した事例を記録してみてください。
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">活動パターン</h3>
                        <p className="text-gray-600 mb-6">
                          記録された活動に基づいて、ケア活動に以下のパターンを特定しました:
                        </p>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">最も一般的な活動タイプ</h4>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm">育児</span>
                                  <span className="text-sm font-medium">42%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-rose-600 h-2 rounded-full" style={{ width: "42%" }}></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm">高齢者ケア</span>
                                  <span className="text-sm font-medium">28%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "28%" }}></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm">家事管理</span>
                                  <span className="text-sm font-medium">18%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "18%" }}></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm">その他</span>
                                  <span className="text-sm font-medium">12%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "12%" }}></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">最も頻繁に使用されるスキル</h4>
                            <div className="flex flex-wrap gap-2">
                              <div className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-sm">
                                コミュニケーション (56活動)
                              </div>
                              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                マルチタスク (47活動)
                              </div>
                              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                時間管理 (38活動)
                              </div>
                              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                問題解決 (23活動)
                              </div>
                              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                                忍耐力 (21活動)
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  )
}
